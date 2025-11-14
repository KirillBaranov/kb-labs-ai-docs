# Contributing Guide

Thanks for helping grow the KB Labs plugin ecosystem!

---

## 🧰 Local development

```bash
pnpm install
pnpm --filter @kb-labs/ai-docs-plugin run build # optional warm-up
pnpm --filter @kb-labs/ai-docs-plugin test
```

Handy scripts:

- `pnpm verify` – lint + type-check + test
- `pnpm devkit:sync` – align configs with `@kb-labs/devkit`
- `pnpm kb ai-docs:<cmd>` – smoke-test CLI handlers against the kb runtime

## 📐 Engineering guidelines

### Layering

- `shared` → `domain` → `application` → `infra` → `cli/workflows/setup`
- Interface layers invoke application use-cases; keep them thin and deterministic.
- Application orchestrates domain objects and depends on infrastructure adapters via interfaces.
- Domain is pure (no fs/net/env access).
- Infra hosts adapters for filesystem, Mind, mock LLM, workflow hooks, setup helpers.

### Code quality

- Follow ESLint + Prettier (run `pnpm lint`).
- TypeScript is strict; add explicit types at module boundaries.
- Cover behaviour with Vitest (`packages/ai-docs-plugin/tests/**`).
- Update docs and manifest/setup sections when changing contracts.

### Manifest checklist

1. Register new commands/routes/widgets in `src/manifest.v2.ts`.
2. Declare permissions (fs/net/env/quotas) required by the feature.
3. Wire setup handler + workflow steps with explicit permissions.
4. Add entries to `tsup.config.ts` so outputs are bundled with d.ts files.
5. Provide tests and documentation updates.

### Conventional commits

```
feat: add drift gaps severity
fix: adjust plan config hash
docs: expand workflow guide
refactor: split generate logic
test: cover json output path
chore: bump devkit
```

---

## 🔄 Pull request workflow

Before opening a PR:

1. Branch off `main`.
2. Implement the change following layering + manifest guidelines.
3. Run `pnpm verify`.
4. Update docs (README, guides, ADRs) as needed.
5. Provide CLI transcripts or screenshots when appropriate.

PR requirements:

- Include tests proving behaviour (CLI/REST/Studio as applicable).
- Reference related issues or ADRs.
- Ensure CI is green and request maintainer review.

---

Documentation standards live in [`docs/DOCUMENTATION.md`](./docs/DOCUMENTATION.md). Capture major structural decisions with [`docs/adr/0000-template.md`](./docs/adr/0000-template.md).
