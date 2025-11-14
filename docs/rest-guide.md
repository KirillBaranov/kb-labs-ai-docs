# REST Guide

AI Docs currently focuses on CLI + workflow surfaces. When a REST surface becomes necessary (e.g., Studio widgets pulling plan summaries), use this checklist to add routes safely.

## Directory layout (when needed)

```
packages/ai-docs-plugin/src/rest/
├── handlers/
│   └── docs-plan-handler.ts
└── schemas/
    ├── docs-plan-request.schema.ts
    └── docs-plan-response.schema.ts
```

- **schemas/** – Zod request/response contracts (re-exported for tooling).
- **handlers/** – executable functions referenced from the manifest.

## Adding a route

1. **Define schemas**
   - Add `src/rest/schemas/<resource>-schema.ts`.
   - Export `RequestSchema`, `ResponseSchema`, and types inferred via `z.infer`.
2. **Implement handler**
   - Create `src/rest/handlers/<resource>-handler.ts`.
   - Validate input via the request schema, call the relevant use-case (`planDocs`, `generateDocs`, etc.), and return response data parsed by the response schema.
   - Use `ctx.runtime?.log` for observability.
3. **Register in manifest**
   - Append a route to `manifest.v2.ts` under `rest.routes`.
   - Provide `method`, `path`, schema refs, handler path, and required permissions.
4. **Bundle entry**
   - Add the handler (and schema if needed) to `tsup.config.ts` `entry`.
5. **Test**
   - Create `packages/ai-docs-plugin/tests/rest/<resource>.spec.ts`.
   - Cover success + validation failures.

## Permissions checklist

- Limit `fs` allow-lists to files actually read/written by the handler.
- Keep `net` and `env` scopes minimal (most handlers can run with `net: none`).
- Document new routes and contracts in `docs/rest-guide.md` or ADRs.

## Example snippet

```ts
export async function handleDocsPlan(input: unknown, ctx: HandlerContext = {}) {
  const parsed = DocsPlanRequestSchema.parse(input ?? {});
  const plan = await planDocs({ profile: parsed.profile }, ctx.services);
  ctx.runtime?.log?.('info', 'REST plan requested', { profile: parsed.profile });
  return DocsPlanResponseSchema.parse(plan);
}
```

This pattern keeps routing logic tiny and delegates heavy work to existing use-cases, preserving testability.
