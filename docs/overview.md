# KB Labs AI Docs Overview

AI Docs automates the engineering-docs lifecycle (bootstrap → plan → generate → audit) on top of Mind, the workflow engine, and DevKit standards.

## Why AI Docs

- **Bootstrap** — `kb ai-docs:init` scaffolds `docs/ai-docs` plus config defaults in seconds.
- **Plan** — `kb ai-docs:plan` analyses existing docs/code and emits a canonical TOC with gaps.
- **Generate** — `kb ai-docs:generate` produces or updates sections via Mind context + mock/future LLM providers, with dry-run/suggest-only guarantees.
- **Audit** — `kb ai-docs:audit` calculates drift-score and reports what is missing, outdated, or in-sync.

## Repository contents

- `packages/ai-docs-plugin` — CLI, workflow steps, setup handler, Mind adapter, mock LLM, application/domain layers.
- `packages/ai-docs-contracts` — manifests and Zod schemas for artifacts (`plan.json`, metadata, drift), commands, workflows, future APIs.
- `docs/` — guides for setup, getting started, architecture, CLI usage, FAQ.
- `scripts/` — devkit helpers (paths + sync) shared across packages.
- `IMPLEMENTATION_NOTES.md` — running progress/status document.

Use this repo as the reference implementation when integrating AI Docs with KB Labs products or when authoring similar documentation plugins with strong artifact guarantees and observability.

