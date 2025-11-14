# Architecture Guide

AI Docs follows the KB Labs reference layering (shared → domain → application → infra → surfaces), with a few twists: workflow handlers, Mind adapters, and artifact-safe FS operations. This page explains how those pieces interact so you can extend the plugin confidently.

## Layers

| Layer | Purpose | Depends on |
|-------|---------|------------|
| **shared** | Cross-cutting constants, helpers, types | – |
| **domain** | Pure entities and value objects | shared |
| **application** | Use-cases orchestrating domain logic | domain, shared |
| **infrastructure** | Adapters to external systems (logging, fs, net) | shared |
| **cli** | Handles `kb ai-docs:*` commands, maps flags → use-case inputs | application, shared, infra |
| **workflows** | Thin wrappers for workflow-engine steps (`ai-docs.plan/generate/audit`) | application |
| **setup** | Bootstraps `.kb/ai-docs/*` and config defaults | infra |

Principles:

- Interface layers (CLI/workflows/setup) should not contain business logic—delegate to application use-cases.
- Application coordinates domain behaviour and defines contracts for infrastructure adapters.
- Domain remains pure and side-effect free.
- Shared utilities stay lightweight and framework-agnostic.

## Folder layout

```
packages/ai-docs-plugin/src/
├── shared/          # constants, defaults (paths, commands)
├── domain/          # config entities, DocsPlan/Generation/Drift helpers
├── application/     # use-cases (init/plan/generate/audit) + types
├── infra/           # adapters (fs, config-store, Mind client, mock LLM)
├── cli/             # handlers for kb ai-docs:* commands
├── workflows/       # workflow-engine entry points
└── setup/           # SetupBuilder handler for kb ai-docs setup
```

## Manifest and contracts

- `packages/ai-docs-contracts` describes artifacts, commands, workflows, and schemas consumed by other products.
- `src/manifest.v2.ts` declares CLI commands, fs permissions, setup handler, and referenced artifacts.
- Workflow handlers are exported directly (not declared in manifest yet) so specs can import them.

Whenever you change CLI flags, artifacts, or workflow behaviour: update both the manifest and the contracts package, regenerate builds, and adjust docs/tests.

## Testing strategy

- **Unit**: domain helpers (plan/generation/drift) + application use-cases with mocked ports.
- **Integration**: CLI handlers (invoked through `kb ai-docs:*`), workflow handlers (call them with fake services), setup handler (SetupBuilder assertions).
- **Manual**: `pnpm kb ai-docs:<command>` plus workflow-engine specs in downstream repos.

## Extensibility tips

- Add domain logic before touching CLI/workflows; keep surfaces focused on orchestration.
- When adding new artifacts, update both contracts and FS adapters to ensure safe writes (backups, metadata).
- If you wire a real LLM provider, implement it as another adapter satisfying `MockLlmsPort`.
- Record architecture decisions (e.g., new artifact formats) in `docs/adr/`.

This structure keeps AI Docs predictable for other KB Labs products while leaving room for advanced providers or Studio surfaces later.


