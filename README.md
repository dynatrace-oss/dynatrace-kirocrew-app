# Repository Template

This template is the starting point for new repositories in the `dynatrace-oss` organization.

Creating a repository in `dynatrace-oss` establishes an ongoing ownership, maintenance, and lifecycle commitment. Before a repository is published or actively used, the owning team must confirm that the repository has clear ownership, appropriate documentation, and the minimum required governance and automation in place.

## Purpose

Use this template when creating a new repository that will live in `dynatrace-oss`.

This template provides a baseline structure for:
- repository documentation
- contribution guidance
- community health files
- basic automation
- ownership and maintenance expectations

## Required actions after repository creation

After creating a repository from this template, the owning team must complete the following before the repository is considered ready for active use or publication:

### 1. Replace placeholder content
Update this README to describe:
- what the repository contains
- who it is for
- how it should be used
- how contributors can get started
- any important limitations, prerequisites, or support boundaries

### 2. Confirm repository ownership
Each repository must have:
- a primary maintainer, DRI, or owning team
- a documented support model
- a `CODEOWNERS` file that reflects the responsible team or maintainers

Ownership must remain current over time. Repositories without durable ownership may be subject to review, restriction, or archival.

### 3. Review inherited community health files
Some community health files may be inherited from organization defaults. The owning team is responsible for reviewing them and deciding whether repository-specific versions are needed.

At minimum, review:
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `SUPPORT.md`

If the repository has different contribution, security, or support expectations than the organization defaults, add repository-specific versions.

### 4. Confirm licensing
Each repository must include the correct license for its contents. Do not assume the default is always appropriate. Confirm the intended license before publishing. More information on licensing can be found [here](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository).

### 5. Add or validate baseline automation
At minimum, the repository should include automation appropriate to its contents. This usually includes:
- Markdown linting
- validation for configuration files where applicable
- dependency update automation
- any language-specific test or lint workflows needed for the project

### 6. Validate publication readiness
Before making a repository public, confirm that:
- the repository has a clear purpose
- ownership is defined
- required documentation is present
- the support model is clear
- secrets are not present
- branch protection and review expectations are in place where needed

## Publication and support expectations

Repositories in `dynatrace-oss` are not automatically considered commercially supported products.

Unless explicitly stated otherwise, maintainers should make support expectations clear in the repository documentation. If a project is community-supported, experimental, internal-only, or provided without official product support, that should be stated plainly in the README and/or `SUPPORT.md`.

Example language:

> This project is open source and maintained by Dynatrace contributors. It is not covered by standard Dynatrace commercial support unless explicitly stated otherwise.

## Minimum recommended repository contents

The following should usually be present in each repository:

- `README.md`
- `LICENSE`
- `CODEOWNERS`
- `CONTRIBUTING.md` or inherited equivalent
- `SECURITY.md` or inherited equivalent
- `SUPPORT.md` or inherited equivalent
- `AGENTS.md` or inherited equivalent 
- issue templates
- pull request template
- baseline CI workflows

## Repository lifecycle

Creating a repository is the beginning of a lifecycle, not a one-time setup step. Repository owners are expected to maintain the repository over time, including:
- keeping ownership information current
- reviewing dependency and automation health
- responding to contribution and support signals as appropriate
- archiving or transferring the repository when it is no longer actively maintained or no longer belongs in the organization

## AI assistant guidance

This repository includes repository-level guidance for AI coding assistants:

- `AGENTS.md` provides repository expectations and review guidance for agent-based coding tools
- `.github/copilot-instructions.md` provides repository-wide instructions for GitHub Copilot

## Repository Exemplars

Looking for some inspiration? Here are a few Dynatrace Open Source repo examples:
- (https://github.com/dynatrace-oss/dynatrace-managed-mcp)
- (https://github.com/dynatrace-oss/hash4j)
- (https://github.com/dynatrace-oss/kimera)

## Questions

For questions about repository setup, lifecycle expectations, or placement in `dynatrace-oss`, contact the [Open Source Program](https://dynatrace.sharepoint.com/sites/DevRel/SitePages/Open-Source-Program-Office.aspx).
