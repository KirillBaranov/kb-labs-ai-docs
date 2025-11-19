import nodePreset from '@kb-labs/devkit/eslint/node.js';

export default [
  ...nodePreset,
  {
    ignores: [
      '**/tsup.config.ts',
      '**/vitest.config.ts',
      '**/*.vue'
    ]
  },
  {
    files: ['**/tests/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
    }
  }
];