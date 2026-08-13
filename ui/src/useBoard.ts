import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from './api'
import type { ApiError, BoardResponse, Status, ViewKey, WindowKey } from './api'

const POLL_MS = 60_000

export interface UseBoard {
  status: Status | null
  board: BoardResponse | null
  loading: boolean
  error: ApiError | null
  refresh: () => Promise<void>
  reloadStatus: () => Promise<void>
  reload: () => Promise<void>
}

/**
 * Owns all board/status fetching. Refetches the board on view/window change,
 * polls every 60s (paused while the tab is hidden), and exposes a manual
 * refresh that busts the backend cache via ?refresh=1.
 */
export function useBoard(view: ViewKey, win: WindowKey): UseBoard {
  const [status, setStatus] = useState<Status | null>(null)
  const [board, setBoard] = useState<BoardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  // keep latest view/win for the polling closure without re-arming the interval
  const viewRef = useRef(view)
  const winRef = useRef(win)
  viewRef.current = view
  winRef.current = win

  const loadStatus = useCallback(async () => {
    try {
      setStatus(await api<Status>('/status'))
    } catch {
      /* status is best-effort; board errors surface instead */
    }
  }, [])

  const loadBoard = useCallback(async (v: ViewKey, w: WindowKey, manual: boolean) => {
    try {
      const qs = new URLSearchParams({ view: v, window: w })
      if (manual) qs.set('refresh', '1')
      const data = await api<BoardResponse>('/board?' + qs.toString())
      // Drop out-of-date responses: the view/window changed while this
      // request was in flight, so its payload no longer matches the UI.
      if (v !== viewRef.current || w !== winRef.current) return
      setBoard(data)
      setError(null)
      setLoading(false)
    } catch (e) {
      // Ignore errors from a request that is no longer current.
      if (v !== viewRef.current || w !== winRef.current) return
      // Same-view failure (e.g. a poll tick): surface the error but KEEP the
      // last good board so a subtle stale indicator can show instead of blanking.
      setError(e as ApiError)
      setLoading(false)
    }
  }, [])

  // initial + on view/window change: blank immediately so stale cards from the
  // previous view/window can never render past the switch.
  useEffect(() => {
    setBoard(null)
    setError(null)
    setLoading(true)
    void loadBoard(view, win, false)
    void loadStatus()
  }, [view, win, loadBoard, loadStatus])

  // 60s polling, paused while the tab is hidden
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState !== 'visible') return
      void loadBoard(viewRef.current, winRef.current, false)
      void loadStatus()
    }
    const id = window.setInterval(tick, POLL_MS)
    const onVis = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [loadBoard, loadStatus])

  const refresh = useCallback(async () => {
    setLoading(true)
    await Promise.all([loadBoard(viewRef.current, winRef.current, true), loadStatus()])
  }, [loadBoard, loadStatus])

  // Hard reload after a credential change (sign-in / sign-out). Blanks the board
  // first so a stale demo board can never flash under the real one, then
  // refetches board + status fresh (cache-busted) with the new credential.
  const reload = useCallback(async () => {
    setBoard(null)
    setError(null)
    setLoading(true)
    await Promise.all([loadBoard(viewRef.current, winRef.current, true), loadStatus()])
  }, [loadBoard, loadStatus])

  return { status, board, loading, error, refresh, reloadStatus: loadStatus, reload }
}
