# Studio Guide

Studio integration is optional today—AI Docs focuses on CLI/workflow experiences. When Studio widgets are needed (e.g., to visualise drift reports), follow this playbook.

## Directory layout (when implemented)

```
packages/ai-docs-plugin/src/studio/
├── widgets/
│   └── drift-widget.tsx
└── index.ts
```

- **widgets/** – React components fed by REST endpoints.
- **index.ts** – convenient re-export for tooling or future packages.

## Adding a widget

1. Create `src/studio/widgets/<name>-widget.tsx` exporting a React component (or config object).
2. Re-export it from `src/studio/widgets/index.ts` (and `src/studio/index.ts` if required).
3. Add the widget file to `tsup.config.ts` `entry`.
4. Register it in `manifest.v2.ts` under `studio.widgets` with:
   - unique `id`, `title`, `description`;
   - `kind` (`react`, `chart`, etc.);
   - `data.source` referencing a REST route (`type: 'rest', routeId, method`).
5. Cover render logic with tests in `packages/ai-docs-plugin/tests/studio/`.

## Menus and layouts

- Define Studio menus under `manifest.studio.menus` to surface widgets within the UI.
- Layout presets (grids, stacks) help teams drop the widget onto dashboards quickly.

## Styling guidelines

- Prefer KB Labs shared UI components (`@kb-labs/shared-cli-ui`).
- Keep widgets presentational—fetch data through REST routes declared in the manifest.
- Expose configuration via props so the same widget can render different profiles (e.g., internal vs. public docs plans).

## Example snippet

```tsx
export const DriftWidget = ({ driftScore, entries }: DriftWidgetProps) => (
  <section>
    <h2>Docs Drift</h2>
    <p>Score: {driftScore}/100</p>
    <ul>
      {entries.slice(0, 5).map((entry) => (
        <li key={entry.path}>{entry.path} — {entry.status}</li>
      ))}
    </ul>
  </section>
);
```

Wire the widget to a REST endpoint (e.g., `/v1/ai-docs/drift`) via `data.source`, then add it to a layout to expose it inside Studio.
