# FAQ & Troubleshooting

## Build fails with “Cannot resolve @kb-labs/...”

AI Docs expects sibling repos (`kb-labs-plugin`, `kb-labs-shared`, `kb-labs-devkit`, `kb-labs-setup-engine`) to be linked locally. Double-check `pnpm-workspace.yaml`, `tsconfig.paths.json`, or install published versions if you’re outside the mono workspace.

## `pnpm lint` / `tsc` complain about missing files

Ensure `packages/ai-docs-plugin/tsconfig.json` includes both `src` and `tests`. When you move tests, update `include`/`exclude` and any path aliases.

## CLI says “Build artifacts missing”

Run `pnpm --filter @kb-labs/ai-docs-plugin run build` before invoking `pnpm kb ai-docs:<command>`. The kb runtime loads bundles from `packages/ai-docs-plugin/dist/`.

## CLI prints nothing

All commands write to `stdout`. If you pipe output to `/dev/null`, nothing will show up. Add `--json` for a deterministic payload in scripts/CI.

## Setup didn’t touch kb.config.json

The setup handler relies on `ctx.runtime.config.ensureSection`. If you ran `kb ai-docs setup --dry-run`, no changes were applied. Re-run without `--dry-run` (or with `--force` to overwrite existing sections).

## Drift score is always 100

The repo currently uses a mock drift detector. Once Mind and repo-scanner integrations land, the score will reflect reality. Inspect `packages/ai-docs-plugin/src/domain/drift.ts` to see how the mock calculation works.

## Manifest change checklist

1. Update `src/manifest.v2.ts` (CLI metadata, setup permissions, artifacts).
2. Add new entry points to `tsup.config.ts`.
3. Keep `packages/ai-docs-contracts` (schemas + manifest) in sync with artifact/command changes.
4. Write tests and documentation for the new behaviour.
