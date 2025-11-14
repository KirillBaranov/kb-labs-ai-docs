import type { PluginContracts } from './types.js';
import { contractsSchemaId, contractsVersion } from './version.js';

const schemaPrefix = '@kb-labs/ai-docs-contracts/schema';

export const pluginContractsManifest: PluginContracts = {
  schema: contractsSchemaId,
  pluginId: '@kb-labs/ai-docs',
  contractsVersion,
  artifacts: {
    'ai-docs.plan': {
      id: 'ai-docs.plan',
      kind: 'json',
      description: 'Machine-readable documentation plan and TOC.',
      pathPattern: '.kb/ai-docs/plan.json',
      mediaType: 'application/json',
      schemaRef: `${schemaPrefix}#DocsPlan`
    },
    'ai-docs.metadata': {
      id: 'ai-docs.metadata',
      kind: 'json',
      description: 'Per-file metadata describing generation mode, strategy, and confidence.',
      pathPattern: '.kb/ai-docs/metadata/*.json',
      mediaType: 'application/json',
      schemaRef: `${schemaPrefix}#GenerationMetadata`
    },
    'ai-docs.drift.json': {
      id: 'ai-docs.drift.json',
      kind: 'json',
      description: 'Structured drift report capturing missing/outdated sections.',
      pathPattern: '.kb/ai-docs/drift.json',
      mediaType: 'application/json',
      schemaRef: `${schemaPrefix}#DriftReport`
    },
    'ai-docs.drift.md': {
      id: 'ai-docs.drift.md',
      kind: 'markdown',
      description: 'Human readable drift summary for review workflows.',
      pathPattern: '.kb/ai-docs/drift.md',
      mediaType: 'text/markdown'
    },
    'ai-docs.suggestions': {
      id: 'ai-docs.suggestions',
      kind: 'dir',
      description: 'Suggested documentation changes (used by dry-run / suggest-only modes).',
      pathPattern: '.kb/artifacts/ai-docs/suggestions/**',
      mediaType: 'text/markdown'
    }
  },
  commands: {
    'ai-docs:init': {
      id: 'ai-docs:init',
      description: 'Bootstrap AI Docs config, docs skeleton, and profiles.',
      input: {
        ref: `${schemaPrefix}#InitCommandInput`,
        format: 'zod'
      },
      output: {
        ref: `${schemaPrefix}#InitCommandOutput`,
        format: 'zod'
      },
      produces: ['ai-docs.plan']
    },
    'ai-docs:plan': {
      id: 'ai-docs:plan',
      description: 'Analyze repository and emit a documentation plan / TOC.',
      input: {
        ref: `${schemaPrefix}#PlanCommandInput`,
        format: 'zod'
      },
      output: {
        ref: `${schemaPrefix}#PlanCommandOutput`,
        format: 'zod'
      },
      produces: ['ai-docs.plan']
    },
    'ai-docs:generate': {
      id: 'ai-docs:generate',
      description: 'Generate or update documentation sections based on the plan.',
      input: {
        ref: `${schemaPrefix}#GenerateCommandInput`,
        format: 'zod'
      },
      output: {
        ref: `${schemaPrefix}#GenerateCommandOutput`,
        format: 'zod'
      },
      produces: ['ai-docs.metadata', 'ai-docs.suggestions']
    },
    'ai-docs:audit': {
      id: 'ai-docs:audit',
      description: 'Compute drift between codebase and docs.',
      input: {
        ref: `${schemaPrefix}#AuditCommandInput`,
        format: 'zod'
      },
      output: {
        ref: `${schemaPrefix}#AuditCommandOutput`,
        format: 'zod'
      },
      produces: ['ai-docs.drift.json', 'ai-docs.drift.md']
    }
  },
  workflows: {
    'ai-docs.workflow.plan': {
      id: 'ai-docs.workflow.plan',
      description: 'Workflow wrapper that runs the planning command and publishes artifacts.',
      produces: ['ai-docs.plan'],
      steps: [
        {
          id: 'ai-docs.workflow.plan.step.plan-command',
          commandId: 'ai-docs:plan',
          produces: ['ai-docs.plan']
        }
      ]
    },
    'ai-docs.workflow.generate': {
      id: 'ai-docs.workflow.generate',
      description: 'Workflow that runs planning (if needed) and generation with progress events.',
      produces: ['ai-docs.plan', 'ai-docs.metadata', 'ai-docs.suggestions'],
      steps: [
        {
          id: 'ai-docs.workflow.generate.step.plan',
          commandId: 'ai-docs:plan',
          produces: ['ai-docs.plan']
        },
        {
          id: 'ai-docs.workflow.generate.step.generate',
          commandId: 'ai-docs:generate',
          produces: ['ai-docs.metadata', 'ai-docs.suggestions']
        }
      ]
    },
    'ai-docs.workflow.audit': {
      id: 'ai-docs.workflow.audit',
      description: 'Workflow that ensures plan exists and emits drift report.',
      produces: ['ai-docs.drift.json', 'ai-docs.drift.md'],
      steps: [
        {
          id: 'ai-docs.workflow.audit.step.plan',
          commandId: 'ai-docs:plan',
          produces: ['ai-docs.plan']
        },
        {
          id: 'ai-docs.workflow.audit.step.audit',
          commandId: 'ai-docs:audit',
          produces: ['ai-docs.drift.json', 'ai-docs.drift.md']
        }
      ]
    }
  }
};

