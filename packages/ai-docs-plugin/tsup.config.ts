import { defineConfig } from 'tsup';
import nodePreset from '@kb-labs/devkit/tsup/node.js';

export default defineConfig({
  ...nodePreset,
  entry: [
    'src/index.ts',
    'src/manifest.v2.ts',
    'src/setup/handler.ts',
    'src/cli/commands/init/run.ts',
    'src/cli/commands/plan/run.ts',
    'src/cli/commands/generate/run.ts',
    'src/cli/commands/audit/run.ts'
  ],
  external: ['@kb-labs/plugin-manifest', '@kb-labs/ai-docs-contracts', '@kb-labs/setup-operations'],
  dts: {
    resolve: true,
    skipLibCheck: true
  }
});
