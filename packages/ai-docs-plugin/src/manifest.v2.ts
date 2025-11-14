import type { ManifestV2 } from '@kb-labs/plugin-manifest';

export const manifest: ManifestV2 = {
  schema: 'kb.plugin/2',
  id: '@kb-labs/ai-docs',
  version: '0.0.1',
  display: {
    name: 'KB Labs AI Docs',
    description: 'Bootstrap, plan, generate, and audit engineering documentation safely.',
    tags: ['docs', 'ai', 'workflow']
  },
  cli: {
    commands: [
      {
        id: 'ai-docs:init',
        group: 'ai-docs',
        describe: 'Create docs skeleton and aiDocs config section.',
        handler: './cli/commands/init/run#runInitCommand',
        flags: [
          { name: 'docs-path', type: 'string', description: 'Custom docs root (default docs/ai-docs)' },
          { name: 'format', type: 'string', description: 'md or mdx', choices: ['md', 'mdx'] },
          { name: 'language', type: 'string', description: 'Target language (default en)' },
          { name: 'json', type: 'boolean', description: 'Return JSON payload' }
        ]
      },
      {
        id: 'ai-docs:plan',
        group: 'ai-docs',
        describe: 'Analyse project inputs and emit plan.json + TOC.',
        handler: './cli/commands/plan/run#runPlanCommand',
        flags: [
          { name: 'profile', type: 'string', description: 'Profile ID' },
          { name: 'plan-path', type: 'string', description: 'Override plan output path' },
          { name: 'json', type: 'boolean', description: 'Return JSON payload' }
        ]
      },
      {
        id: 'ai-docs:generate',
        group: 'ai-docs',
        describe: 'Generate/update docs based on plan.json.',
        handler: './cli/commands/generate/run#runGenerateCommand',
        flags: [
          {
            name: 'strategy',
            type: 'string',
            choices: ['append', 'rewrite-section', 'suggest-only'],
            description: 'How to apply generated sections'
          },
          { name: 'profile', type: 'string', description: 'Profile ID' },
          { name: 'plan-path', type: 'string', description: 'Path to plan.json' },
          { name: 'sections', type: 'string', description: 'Comma-separated section IDs to limit scope' },
          { name: 'dry-run', type: 'boolean', description: 'Skip writes, produce diff artifacts' },
          { name: 'suggest-only', type: 'boolean', description: 'Write suggestions without touching docs' },
          { name: 'json', type: 'boolean', description: 'Return JSON payload' }
        ]
      },
      {
        id: 'ai-docs:audit',
        group: 'ai-docs',
        describe: 'Compute drift score and produce reports.',
        handler: './cli/commands/audit/run#runAuditCommand',
        flags: [
          { name: 'from', type: 'string', description: 'Git revision start' },
          { name: 'to', type: 'string', description: 'Git revision end' },
          { name: 'json', type: 'boolean', description: 'Return JSON payload' }
        ]
      }
    ]
  },
    permissions: {
      fs: {
        mode: 'readWrite',
        allow: ['docs/**', '.kb/**', 'kb.config.json'],
        deny: ['**/*.key', '**/*.secret']
      },
    net: 'none',
    env: {
      allow: ['NODE_ENV']
    },
    quotas: {
      timeoutMs: 240000,
      memoryMb: 256,
      cpuMs: 10000
    },
    capabilities: []
  },
  artifacts: [],
  setup: {
    handler: './setup/handler.js#run',
    describe: 'Provision AI Docs workspace defaults (profiles, config, scripts).',
    permissions: {
      fs: {
        mode: 'readWrite',
        allow: ['.kb/ai-docs/**', '.kb/artifacts/ai-docs/**', 'kb.config.json'],
        deny: ['.kb/plugins.json', '.kb/kb-labs.config.json', '.git/**']
      },
      net: 'none'
    }
  }
};

export default manifest;

