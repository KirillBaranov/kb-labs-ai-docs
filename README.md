# KB Labs AI Docs (@kb-labs/ai-docs)

> Engineering-first documentation assistant for KB Labs projects: bootstrap, plan, generate, and audit technical docs without silent overwrites.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9+-orange.svg)](https://pnpm.io/)

## 🧭 Mission
AI Docs helps engineering teams:
- bootstrap a documentation workspace in one command (`kb ai-docs:init`);
- build a machine-readable plan / TOC based on existing code + docs (`kb ai-docs:plan`);
- generate or sync sections with Mind context + LLMs without silent overwrites (`kb ai-docs:generate`);
- monitor drift between code and docs (`kb ai-docs:audit`).

The focus is engineering content (devs, SREs) rather than marketing pages.

## 🧱 Primary scenarios
| Command | Scenario | Output |
| --- | --- | --- |
| `kb ai-docs:init` | Bootstrap | `docs/ai-docs/*` skeleton, `aiDocs` section in `kb.config.json`, starter profiles |
| `kb ai-docs:plan` | Plan / restructure | `.kb/ai-docs/plan.json` + proposed TOC + gap list |
| `kb ai-docs:generate` | Generate / sync | Markdown sections (append/rewrite/suggest-only), metadata, dry-run diffs |
| `kb ai-docs:audit` | Drift detection | Drift score + `drift.json`/`drift.md` with in-sync/outdated/missing markers |

Every command supports `--json`, honors dry-run, and writes artifacts before touching docs.

### Workflow steps
For workflow-engine users, the plugin also exposes thin wrappers:

| Step ID | Handler | Produces |
| --- | --- | --- |
| `ai-docs.plan` | `./workflows/plan#runPlanWorkflow` | `ai-docs.plan` |
| `ai-docs.generate` | `./workflows/generate#runGenerateWorkflow` | `ai-docs.plan`, `ai-docs.metadata`, `ai-docs.suggestions` |
| `ai-docs.audit` | `./workflows/audit#runAuditWorkflow` | `ai-docs.drift.json`, `ai-docs.drift.md` |

Steps reuse the CLI use-cases under the hood, emit the same artifacts, and are safe to chain inside CI or release pipelines.

## 🚀 Quick start
```bash
git clone https://github.com/kirill-baranov/kb-labs-ai-docs.git
cd kb-labs-ai-docs
pnpm install

# Build packages
pnpm build

# Exercise commands via kb CLI
pnpm kb ai-docs:init --help
pnpm kb ai-docs:plan --help
```

## 🗺️ Repository map
```
kb-labs-ai-docs/
├── packages/
│   ├── ai-docs-contracts   # public contracts (artifacts, commands, workflows, schemas)
│   └── ai-docs-plugin      # CLI + workflows + setup + domain/application/infra layers
├── docs/                   # AI Docs usage guides (init/plan/generate/audit, workflows, mind)
├── scripts/                # Devkit helpers (paths/sync)
└── IMPLEMENTATION_NOTES.md # running status notes
```

Architecture follows DevKit rules: `shared → domain → application → infra → cli/workflows`. The contracts package hosts Zod schemas + manifest consumed by other products.

## 🔌 Integrations
- **Mind** — provides compressed context (module summaries, ADRs, domain notes) through `MindContextClient`.
- **Workflow engine** — ships workflow handlers (`workflows/*.ts`) so specs can call `ai-docs.plan/generate/audit` directly.
- **Plugin runtime / setup engine** — setup handler seeds `kb.config.json`, profiles, and `.kb/ai-docs` folders.
- **Artifacts & logs** — every change flows through `.kb/ai-docs/*` and `.kb/artifacts/ai-docs/*`; risky writes are marked `needs-review`.

## 📊 Observability
- Metrics: `ai_docs_runs_total`, `ai_docs_generated_docs_total`, `ai_docs_drift_score_avg`, `ai_docs_drift_critical_count`.
- Structured logs: phase (scan/plan/generate/audit), dry-run flag, processed files.
- Drift reports: score 0–100 plus per-section status (`in-sync` / `outdated` / `missing`).

## 📚 Documentation
- [`docs/overview.md`](./docs/overview.md) — product context.
- [`docs/getting-started.md`](./docs/getting-started.md) — bootstrap/init walkthrough.
- [`docs/template-setup-guide.md`](./docs/template-setup-guide.md) — setup handler & workspace expectations.
- [`docs/architecture.md`](./docs/architecture.md) — layering rules.
- [`docs/cli-guide.md`](./docs/cli-guide.md) — CLI UX (init/plan/generate/audit).
- [`docs/rest-guide.md`](./docs/rest-guide.md) & [`docs/studio-guide.md`](./docs/studio-guide.md) — extension notes for future REST/Studio surfaces.

See `IMPLEMENTATION_NOTES.md` for live progress.

## 🤝 Contributing
Check [`CONTRIBUTING.md`](./CONTRIBUTING.md) for devkit scripts, layering policy, and testing rules.

## 📄 License
MIT © KB Labs
