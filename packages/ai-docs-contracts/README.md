# @kb-labs/ai-docs-contracts

Contracts for the AI Docs plugin: artifacts, commands, workflows, API payloads, plus the semver’d version of these promises.

## Why this package exists

Every KB Labs plugin publishes a lightweight contract so other surfaces (CLI host, workflow engine, Studio, marketplace) can rely on the same “truth” without importing runtime code. This package only contains manifests, schemas, and types.

## Quick start checklist

1. Keep this package alongside the plugin (`packages/ai-docs-contracts`).
2. Update `pluginContractsManifest` whenever artifacts/commands/workflows change.
3. Extend Zod schemas in `src/schema.ts` to describe new payloads (plan, metadata, drift, etc.).
4. Bump `contractsVersion` following SemVer rules below.
5. Run `pnpm test && pnpm type-check` to ensure the manifest validates.
6. Import the manifest/types in CLI/workflow code instead of hard-coding IDs.

## What's inside

- `pluginContractsManifest` — IDs and descriptions for AI Docs artifacts (plan, metadata, drift) and commands (`ai-docs:init|plan|generate|audit`).
- Zod schemas (`src/schema`) + TS types for config, plan, generation results, drift reports, and command IO.
- Validation helper `parsePluginContracts` used by tests and consumers.

## Versioning rules

- `contractsVersion` uses SemVer and is independent from the plugin’s npm version.
- **MAJOR** — breaking changes to artifacts/commands (rename/remove fields).
- **MINOR** — backward-compatible additions (new sections, optional fields).
- **PATCH** — metadata/docs adjustments without schema changes.

## Minimal usage example

```ts
import { pluginContractsManifest } from '@kb-labs/ai-docs-contracts';

const planArtifactId = pluginContractsManifest.artifacts['ai-docs.plan'].id;
// Use `planArtifactId` in logs, workflow declarations, or CLI output metadata.
```

## Who consumes it

- **Workflow engine** — validates step definitions and emitted artifacts.
- **Studio / release tooling** — renders drift and plan summaries using schema metadata.
- **CLI / runtime** — avoids magic strings when logging or emitting artifacts.

Keep this package lean, tested, and versioned so downstream tools can trust AI Docs’ promises.

