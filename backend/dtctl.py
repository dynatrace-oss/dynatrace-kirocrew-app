"""Async wrapper around the `dtctl` CLI for the Dynatrace KiroCrew app.

Read-only by construction: this module only ever runs `dtctl query ...` and
`dtctl auth whoami`. It never issues a mutating dtctl verb (apply/create/
delete/update/edit/config).

Invocation contract (see docs/research-dtctl.md):
  - Every call passes ``-o json --plain`` (machine JSON, no colors/prompts).
  - ``query`` success  -> object has ``records`` -> return ``records[]``.
  - Any failure        -> ``{"ok": false, "error": {...}}`` (or ``{"error": {...}}``)
                          -> raised as :class:`DtctlError`.
  - ``whoami`` success -> plain object, or agent-envelope ``{"ok": true, "result": {...}}``.

A 60s in-memory TTL cache is keyed by the DQL string; ``refresh=True`` bypasses it.
The binary is ``dtctl`` on PATH unless ``DTCTL_BIN`` overrides it.
Per-call timeout is 20s.
"""
from __future__ import annotations

import asyncio
import json
import os
import time
from typing import Any

DEFAULT_TIMEOUT = 20.0
CACHE_TTL = 60.0

# query (DQL string) -> (expires_at_monotonic, records)
_cache: dict[str, tuple[float, list[dict]]] = {}

# One dtctl subprocess at a time. dtctl ROTATES the OAuth refresh token on
# every refresh: two concurrent invocations that both find the access token
# expired will race the refresh, the second one presents the now-rotated
# (dead) refresh token, and Dynatrace SSO invalidates the whole token family
# ("RefreshToken ... doesn't exist" / invalid_grant). Serializing all calls
# makes exactly one process perform the refresh.
_dtctl_lock = asyncio.Lock()


class DtctlError(Exception):
    """A dtctl invocation failed.

    ``unreachable`` distinguishes transport/timeout/missing-binary failures
    (map to HTTP 502) from query/auth rejections (map to 4xx/500).
    """

    def __init__(self, message: str, code: str = "dtctl_error", *, unreachable: bool = False):
        super().__init__(message)
        self.message = message
        self.code = code
        self.unreachable = unreachable


def _bin() -> str:
    """Resolve the dtctl binary PATH-independently.

    Gateway-spawned backends run with a minimal PATH (/usr/bin:/bin:...), so
    a bare "dtctl" or shutil.which() misses Homebrew installs. Order:
    DTCTL_BIN -> PATH -> well-known install locations.
    """
    override = os.environ.get("DTCTL_BIN")
    if override:
        return override
    import shutil
    found = shutil.which("dtctl")
    if found:
        return found
    home = os.path.expanduser("~")
    for candidate in (
        "/opt/homebrew/bin/dtctl",      # Homebrew on Apple Silicon
        "/usr/local/bin/dtctl",         # Homebrew on Intel / manual installs
        f"{home}/.local/bin/dtctl",
        f"{home}/bin/dtctl",
    ):
        if os.path.exists(candidate):
            return candidate
    return "dtctl"


def _subprocess_env(env_extra: dict[str, str] | None) -> dict[str, str] | None:
    if not env_extra:
        return None
    env = os.environ.copy()
    for k, v in env_extra.items():
        if v:
            env[k] = v
    return env


async def run_json(args: list[str], timeout: float = DEFAULT_TIMEOUT,
                   env_extra: dict[str, str] | None = None) -> Any:
    """Run ``dtctl <args>`` and return parsed JSON from stdout.

    Raises :class:`DtctlError` on missing binary, timeout, non-JSON output, or
    an explicit error envelope.
    """
    async with _dtctl_lock:
        return await _run_json_unlocked(args, timeout, env_extra)


def _flock_path() -> str:
    import tempfile
    return os.path.join(tempfile.gettempdir(), "kirocrew-dynatrace-dtctl.lock")


async def _run_json_unlocked(args: list[str], timeout: float,
                             env_extra: dict[str, str] | None) -> Any:
    import fcntl
    lock_fd = os.open(_flock_path(), os.O_CREAT | os.O_RDWR, 0o600)
    try:
        # Blocking flock in a thread: serializes dtctl across PROCESSES so a
        # concurrent refresh cannot rotate the token family dead.
        await asyncio.to_thread(fcntl.flock, lock_fd, fcntl.LOCK_EX)
        return await _run_json_locked(args, timeout, env_extra)
    finally:
        try:
            fcntl.flock(lock_fd, fcntl.LOCK_UN)
        except OSError:
            pass
        os.close(lock_fd)


async def _run_json_locked(args: list[str], timeout: float,
                           env_extra: dict[str, str] | None) -> Any:
    try:
        proc = await asyncio.create_subprocess_exec(
            _bin(), *args,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=_subprocess_env(env_extra),
        )
    except FileNotFoundError:
        raise DtctlError(f"dtctl binary not found (set DTCTL_BIN)", "dtctl_missing", unreachable=True)
    except OSError as e:
        raise DtctlError(f"could not launch dtctl: {e}", "dtctl_spawn_failed", unreachable=True)

    try:
        out, err = await asyncio.wait_for(proc.communicate(), timeout=timeout)
    except asyncio.TimeoutError:
        try:
            proc.kill()
        except ProcessLookupError:
            pass
        raise DtctlError(f"dtctl timed out after {int(timeout)}s", "dtctl_timeout", unreachable=True)

    text = (out or b"").decode("utf-8", "replace").strip()
    errtext = (err or b"").decode("utf-8", "replace").strip()

    if not text:
        # No stdout: surface stderr. A non-zero exit with no JSON is typically a
        # transport/auth failure rather than a well-formed query rejection.
        msg = errtext[:500] or "dtctl produced no output"
        raise DtctlError(msg, "dtctl_error", unreachable=(proc.returncode not in (0, None)))

    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        raise DtctlError("could not parse dtctl JSON output", "dtctl_parse")

    return data


def _extract_records(data: Any) -> list[dict]:
    """Branch on the documented dtctl shapes (research §5)."""
    if isinstance(data, dict):
        if "records" in data:  # query success (records ARE the result)
            recs = data.get("records") or []
            return recs if isinstance(recs, list) else []
        if data.get("ok") is False or isinstance(data.get("error"), dict):
            err = data.get("error") or {}
            raise DtctlError(err.get("message", "query failed"), err.get("code") or "dtctl_query_failed")
        if data.get("ok") is True and "result" in data:
            res = data.get("result")
            if isinstance(res, dict) and isinstance(res.get("records"), list):
                return res["records"]
    # Unknown shape -> treat as empty result set.
    return []


async def query(dql: str, refresh: bool = False, timeout: float = DEFAULT_TIMEOUT,
                env_extra: dict[str, str] | None = None,
                context: str | None = None) -> list[dict]:
    """Run a DQL query, returning ``records[]``. Cached 60s by (context, DQL)."""
    now = time.monotonic()
    key = f"{context or ''}\x00{dql}"
    if not refresh:
        hit = _cache.get(key)
        if hit is not None and hit[0] > now:
            return hit[1]

    args = ["query", dql, "-o", "json", "--plain"]
    if context:
        args += ["--context", context]
    data = await run_json(args, timeout, env_extra)
    records = _extract_records(data)
    _cache[key] = (now + CACHE_TTL, records)
    return records


async def whoami(timeout: float = DEFAULT_TIMEOUT,
                 env_extra: dict[str, str] | None = None,
                 context: str | None = None) -> dict:
    """Identity/auth probe. Returns the whoami fields dict, or raises DtctlError."""
    args = ["auth", "whoami", "-o", "json", "--plain"]
    if context:
        args += ["--context", context]
    data = await run_json(args, timeout, env_extra)
    if isinstance(data, dict):
        if data.get("ok") is False:
            err = data.get("error") or {}
            raise DtctlError(err.get("message", "authentication failed"),
                             err.get("code") or "dtctl_auth_failed", unreachable=True)
        if data.get("ok") is True and isinstance(data.get("result"), dict):
            return data["result"]
        return data
    raise DtctlError("unexpected whoami output", "dtctl_auth_failed", unreachable=True)


def clear_cache() -> None:
    _cache.clear()


async def list_contexts(timeout: float = DEFAULT_TIMEOUT) -> list[dict]:
    """List dtctl contexts: [{Name, Environment, Current, ...}]. Read-only."""
    data = await run_json(["config", "get-contexts", "-o", "json", "--plain"], timeout)
    return data if isinstance(data, list) else []


def installed() -> tuple[bool, str]:
    """Whether the dtctl binary is resolvable, and its version if so."""
    import subprocess
    binpath = _bin()
    if binpath == "dtctl" or not os.path.exists(binpath):
        return False, ""
    try:
        out = subprocess.run([binpath, "version"], capture_output=True, text=True,
                             timeout=8).stdout
        first = (out or "").splitlines()[0] if out else ""
        return True, first.replace("dtctl version", "").strip()
    except (OSError, subprocess.SubprocessError):
        return True, ""


async def browser_login(environment: str, context: str,
                        timeout: float = 270.0) -> dict:
    """Run `dtctl auth login` (opens the user's browser; blocks until done).

    Holds the dtctl lock for the duration so no query can race the keyring
    write mid-login. Returns {ok, message}.
    """
    args = ["auth", "login", "--context", context, "--environment", environment,
            "--timeout", "4m"]
    async with _dtctl_lock:
        try:
            proc = await asyncio.create_subprocess_exec(
                _bin(), *args,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.STDOUT,
            )
        except (FileNotFoundError, OSError) as e:
            raise DtctlError(f"could not launch dtctl: {e}", "dtctl_missing", unreachable=True)
        try:
            out, _ = await asyncio.wait_for(proc.communicate(), timeout=timeout)
        except asyncio.TimeoutError:
            try:
                proc.kill()
            except ProcessLookupError:
                pass
            raise DtctlError("Sign-in timed out; the browser window may have been closed.",
                             "dtctl_login_timeout", unreachable=True)
    text = (out or b"").decode("utf-8", "replace")
    ok = "Authentication successful" in text or proc.returncode == 0
    if not ok:
        tail = text.strip().splitlines()[-1] if text.strip() else "login failed"
        raise DtctlError(tail[:300], "dtctl_login_failed")
    return {"ok": True}
