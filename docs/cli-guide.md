# CLI Guide

AI Docs ships four production commands exposed through `kb ai-docs:*`. This guide explains what each command does today and how to extend the CLI layer safely.

## Command overview

| Command | Purpose | Notable flags |
| --- | --- | --- |
| `ai-docs:init` | Scaffold docs + config | `--docs-path`, `--format`, `--language`, `--profile`, `--json` |
| `ai-docs:plan` | Analyse sources/docs, emit plan | `--profile`, `--plan-path`, `--json` |
| `ai-docs:generate` | Fill/update sections from plan | `--strategy`, `--sections`, `--plan-path`, `--dry-run`, `--suggest-only`, `--json` |
| `ai-docs:audit` | Compute drift score and reports | `--from`, `--to`, `--json` |

All commands accept `--json` for machine-readable output (used by CI and workflow-engine integrations).

## Command anatomy

Each handler lives in `packages/ai-docs-plugin/src/cli/commands/<name>/run.ts` and exports a `run<Name>Command` function that:

1. Normalises CLI flags into a typed args object.
2. Resolves application services via `resolveContext`.
3. Invokes the appropriate use-case (`initDocs`, `planDocs`, `generateDocs`, `auditDocs`).
4. Writes human output to `stdout` unless `--json` is set.
5. Returns the use-case payload for tests / JSON mode.

Keep handlers thin—business logic belongs to application/domain layers.

## Adding or updating commands

1. Create a new folder under `src/cli/commands/<id>/`.
2. Implement `run<Id>Command` that:
   - parses flags (strings/booleans/arrays);
   - calls the corresponding use-case;
   - writes to `stdout` and returns the payload.
3. Register the command in `src/manifest.v2.ts` (describe, flags, handler path, permissions).
4. Add the file to `tsup.config.ts` `entry` array so it’s bundled.
5. Export the handler from `src/index.ts` if other plugins should import it programmatically.
6. Write Vitest coverage in `packages/ai-docs-plugin/tests/cli/`.

## Common helpers

- `resolveContext` wires default services (logger, config store, docs fs, Mind client, mock LLM).
- `services.workflow?.emit` is available inside use-cases—handlers simply forward args.
- Domain/application types live under `@app/*` aliases for autocomplete.

## Testing CLI handlers

Use Vitest to verify both return payloads and emitted text:

```ts
import { runPlanCommand } from '../../src/cli/commands/plan/run';

test('plan prints summary', async () => {
  const write = vi.fn();
  const result = await runPlanCommand(
    { json: true },
    { stdout: { write } as any }
  );

  expect(result.sections).toBeGreaterThan(0);
  expect(write).toHaveBeenCalledWith(expect.stringMatching(/plan/i));
});
```

For end-to-end smoke tests, invoke the command through the kb runtime:

```bash
pnpm kb ai-docs:plan --json
```

This exercises the compiled bundle plus manifest wiring exactly as users will.

