# AGENTS.md

## Purpose

This repository is a template for creating new repositories in the `dynatrace-oss` organization.

Agents working in this repository should optimize for:
- clear ownership
- durable repository standards
- minimal but useful baseline automation
- documentation that is easy for maintainers to update after repository creation

## What this repository is

This repository is not an end-user project. It is a baseline template for maintainers creating new repositories.

The root `README.md` should be treated as a maintainer setup guide. Changes should make the template easier to adopt, easier to review, and less likely to produce incomplete or unclear repositories.

## Repository expectations

- Keep changes simple, explicit, and easy for maintainers to understand.
- Prefer small, reviewable pull requests.
- Preserve required governance files unless the task is explicitly to change the template standard.
- Use placeholder content only where maintainers are expected to replace it after creating a new repository from this template.
- Make ownership, support, and publication expectations explicit.

## Required baseline files

Unless the task explicitly says otherwise, preserve or improve these files:

- `README.md`
- `LICENSE`
- `CODEOWNERS`
- `SUPPORT.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/dependabot.yml`
- `.github/workflows/`
- `.github/ISSUE_TEMPLATE/`
- `AGENTS.md`
- `.github/copilot-instructions.md`

## Documentation guidance

- Treat the root `README.md` as a maintainer setup guide for the template.
- Prefer concrete, action-oriented instructions.
- Prefer policy-style wording where expectations are mandatory.
- Keep support and ownership language explicit.
- Keep examples short and easy to copy into generated repositories.
- Clearly mark placeholder values that must be replaced.

## Workflow guidance

Before proposing changes:
- check whether ownership, support, or publication expectations are affected
- preserve review-friendly workflows
- avoid unnecessary complexity
- avoid adding language-specific tooling unless it is broadly useful across most repositories created from this template

## Pull request guidance

When preparing a pull request:
- summarize what changed
- explain why the change improves the template
- call out any new maintainer actions required after repository creation
- keep the scope focused and easy to review

## Review checklist

When reviewing changes to this repository or repositories created from this template, verify that:

- `CODEOWNERS` is present
- support expectations are documented
- placeholder text is clearly marked
- no secrets or environment-specific values are included
- baseline automation is present and understandable
- maintainers can tell what must be updated before publication

## What to avoid

- Do not assume repositories created from this template are commercially supported.
- Do not add heavy automation unless it is broadly useful.
- Do not leave unclear placeholders that could accidentally ship to a public repository.
- Do not optimize for a single language or stack unless the template is intentionally stack-specific.
