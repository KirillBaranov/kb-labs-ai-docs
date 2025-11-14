# Getting Started

This guide walks through the quickest way to exercise AI Docs locally: install → build → init/plan/generate/audit.

## 1. Install dependencies

```bash
pnpm install
```

`devkit:sync` runs automatically, so ESLint/TS/Vitest configs stay aligned with the KB Labs presets.

## 2. Build the plugin

```bash
pnpm --filter @kb-labs/ai-docs-plugin run build
```

Artifacts land in `packages/ai-docs-plugin/dist/` and are consumed by the plugin runtime/CLI.

## 3. Bootstrap documentation

```bash
pnpm kb ai-docs:init --docs-path docs/ai-docs --format md --language en --json
```

Creates `docs/ai-docs/*` starters, seeds `kb.config.json`, and prints a JSON payload describing created files.

## 4. Plan / restructure

```bash
pnpm kb ai-docs:plan --profile internal --json
```

Writes `.kb/ai-docs/plan.json` plus counts/gaps. The `--json` flag is perfect for CI annotations.

## 5. Generate (w/ dry-run)

```bash
pnpm kb ai-docs:generate --strategy append --dry-run --json
```

Mock LLMs prepare content and store metadata without touching docs. Drop `--dry-run` (or switch to `--suggest-only`) when you are ready to apply changes.

## 6. Audit drift

```bash
pnpm kb ai-docs:audit --json
```

Produces `.kb/ai-docs/drift.(json|md)` plus drift scores/outdated counts in the terminal.

## 7. Run via workflow engine

If you prefer Workflow specs to CLI calls, reference the exported handlers:

```ts
import { runPlanWorkflow, runGenerateWorkflow, runAuditWorkflow } from '@kb-labs/ai-docs-plugin';

await runPlanWorkflow({ profile: 'internal' }, { services });
await runGenerateWorkflow({ strategy: 'append', dryRun: true }, { services });
await runAuditWorkflow({}, { services });
```

Each handler accepts the same options as the CLI commands and emits the documented artifacts, making it easy to wire AI Docs into CI/CD pipelines.

### Troubleshooting

- `Build artifacts missing` — run `pnpm --filter @kb-labs/ai-docs-plugin run build` before executing `pnpm kb ai-docs:*`.
- `Permission denied` — tweak fs allow/deny patterns in `manifest.v2.ts` if you need writes outside `.kb/`.
- `Invalid aiDocs config` — inspect the `aiDocs` section in `kb.config.json` (schema lives in `packages/ai-docs-contracts`).

---

## 8. Tests

```bash
pnpm --filter @kb-labs/ai-docs-plugin test
```

Vitest is configured via `packages/ai-docs-plugin/vitest.config.ts`. Add smoke tests for use-cases/CLI as new behaviour appears.

---

See also:

- [`docs/overview.md`](./overview.md) — product context and goals.
- [`docs/template-setup-guide.md`](./template-setup-guide.md) — setup workflow walkthrough.
- [`docs/architecture.md`](./architecture.md) — layering and dependency rules.

