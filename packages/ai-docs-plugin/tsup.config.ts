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
  tsconfig: "tsconfig.build.json", // Use build-specific tsconfig without paths
  // nodePreset already includes all workspace packages as external via tsup.external.json
  dts: {
    resolve: true,
    skipLibCheck: true
  }
});
