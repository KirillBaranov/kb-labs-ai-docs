# Setup & Bootstrap Guide

This walkthrough explains what happens during `kb ai-docs setup` and how to prepare a workspace for AI Docs.

## 0. Prerequisites

- Node.js ≥ 20, pnpm ≥ 9
- Local clones of `kb-labs-plugin`, `kb-labs-setup-engine`, and `kb-labs-devkit` (linked via pnpm workspaces)

## 1. Run setup

```bash
kb ai-docs setup
```

The handler (`packages/ai-docs-plugin/src/setup/handler.ts`) will:

- create `.kb/ai-docs/` with README, profiles, and gitkeep;
- add an `aiDocs` section to `kb.config.json`;
- suggest npm scripts (`ai-docs:init|plan|audit`);
- ensure `plugins.ai-docs.enabled = true`.

All filesystem/config operations are declared via `SetupBuilder`, so setup-engine can diff/rollback them.

## 2. Inspect `kb.config.json`

After setup you should see:

```jsonc
"aiDocs": {
  "sources": { "codeGlobs": ["src/**/*.{ts,tsx,js,jsx}", "package.json"], ... },
  "output": { "basePath": "docs/ai-docs", "format": "md" },
  "style": { "language": "en", "formality": "neutral" },
  "provider": { "mindProfile": "default", "llmProfile": "mock" },
  "thresholds": { "driftScoreMinimum": 70, "maxChangesPerRun": 25 }
}
```

Tweak the values (language, globs, thresholds) to match your project conventions.

## 3. Scaffold docs

```bash
kb ai-docs init --docs-path docs/ai-docs
```

Creates the starter files (`overview.md`, `architecture.md`, `getting-started.md`, `conventions.md`) and syncs the config.

## 4. Plan → Generate → Audit loop

1. `kb ai-docs plan` — writes `.kb/ai-docs/plan.json` and highlights gaps.
2. `kb ai-docs generate --dry-run` — saves proposals to `.kb/artifacts/ai-docs/suggestions/`.
3. `kb ai-docs audit` — calculates drift-score and stores `drift.(json|md)`.

Every command supports `--json` and `--dry-run` so you can integrate with CI safely.

> Using workflow engine? Instead of CLI calls, import `runPlanWorkflow`, `runGenerateWorkflow`, or `runAuditWorkflow` from `@kb-labs/ai-docs-plugin/src/workflows/*` and pass the same options you’d provide via flags. Handlers emit identical artifacts.

## 5. Where artifacts live

| File/Directory | Purpose |
| --- | --- |
| `.kb/ai-docs/plan.json` | Current TOC with section statuses |
| `.kb/ai-docs/metadata/*.json` | Generation metadata (strategy, confidence, timestamps) |
| `.kb/ai-docs/drift.(json|md)` | Drift reports for humans + automation |
| `.kb/artifacts/ai-docs/` | Dry-run / suggest-only outputs |
| `docs/ai-docs/*` | The actual documentation checked into the repo |

## 6. Keeping DevKit up to date

1. `pnpm install`
2. `pnpm devkit:paths`
3. `pnpm devkit:sync`
4. `pnpm --filter @kb-labs/ai-docs-plugin run build`
5. `pnpm --filter @kb-labs/ai-docs-contracts test`

## 7. Customising AI Docs

- Contracts: edit `packages/ai-docs-contracts/src/contract.ts` + `schema.ts` when artifact/command shapes change.
- Manifest/setup: review fs permissions, setup handler strings, and CLI metadata whenever you add commands.
- Docs: update `README.md`, `docs/overview.md`, `docs/getting-started.md` whenever UX or workflows change.
- Tests: add smoke coverage for new use-cases, setup operations, and adapters.

## 8. Handy commands

| Command | Description |
| --- | --- |
| `pnpm --filter @kb-labs/ai-docs-plugin run build` | Build CLI/manifest/setup bundles |
| `pnpm --filter @kb-labs/ai-docs-plugin test` | Run Vitest suite |
| `pnpm --filter @kb-labs/ai-docs-contracts test` | Validate contracts schemas |
| `pnpm kb ai-docs:<cmd>` | Execute CLI commands via kb runtime (init/plan/generate/audit) |

Follow these steps to keep AI Docs onboarding smooth while you customise content, strategies, or integrations.

