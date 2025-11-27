import { SetupBuilder } from '@kb-labs/setup-operations';

const KB_DIR = '.kb/ai-docs';
const PROFILE_PATH = `${KB_DIR}/profiles/default.json`;
const README_PATH = `${KB_DIR}/README.md`;

const defaultAiDocsConfig = {
  sources: {
    codeGlobs: ['src/**/*.{ts,tsx,js,jsx}', 'package.json'],
    docsGlobs: ['docs/**/*.{md,mdx}', 'README.md'],
    apiSpecs: []
  },
  output: {
    basePath: 'docs/ai-docs',
    format: 'md',
    naming: 'kebab'
  },
  style: {
    language: 'en',
    formality: 'neutral',
    preferences: []
  },
  profiles: [
    {
      id: 'internal',
      description: 'Internal engineering handbook profile',
      style: {
        language: 'en'
      }
    }
  ],
  provider: {
    mindProfile: 'default',
    llmProfile: 'mock'
  },
  thresholds: {
    driftScoreMinimum: 70,
    maxChangesPerRun: 25
  }
};

type SetupInput = {
  profileId?: string;
};

type SetupContext = {
  logger?: {
    debug: (msg: string, meta?: Record<string, unknown>) => void;
    info: (msg: string, meta?: Record<string, unknown>) => void;
    warn: (msg: string, meta?: Record<string, unknown>) => void;
    error: (msg: string, meta?: Record<string, unknown>) => void;
  };
  runtime?: {
    fs?: {
      mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
      writeFile(path: string, data: string, options?: { encoding?: BufferEncoding }): Promise<void>;
    };
    config?: {
      ensureSection?: (pointer: string, value: unknown, options?: { strategy?: 'deep' | 'replace' }) => Promise<void>;
    };
  };
};

export async function run(input: SetupInput = {}, ctx: SetupContext = {}) {
  const builder = new SetupBuilder();

  builder.ensureFile(
    PROFILE_PATH,
    `${JSON.stringify(
      {
        id: input.profileId ?? 'internal',
        summary: 'Default AI Docs profile scaffolding. Update preferences per project needs.'
      },
      null,
      2
    )}\n`,
    {
      metadata: { description: 'Seed default AI Docs profile' }
    }
  );

  builder.ensureFile(
    README_PATH,
    [
      '# AI Docs workspace files',
      '',
      '- `profiles/*.json` store reusable generation presets.',
      '- `plan.json` and `drift.json` appear after planning/audit runs.',
      '- generation artifacts are staged in `.kb/artifacts/ai-docs/` before merging into docs.',
      '',
      'Run `kb ai-docs init` and then `kb ai-docs plan` to bootstrap the TOC.'
    ].join('\n') + '\n',
    {
      metadata: { description: 'Describe AI Docs kb folder purpose' }
    }
  );

  builder.ensureConfigSection('aiDocs', defaultAiDocsConfig, {
    metadata: { description: 'Seed aiDocs config defaults' }
  });
  builder.ensureConfigSection('plugins.ai-docs', {
    enabled: true,
    docsPath: 'docs/ai-docs',
    planPath: '.kb/ai-docs/plan.json',
    driftThreshold: 70
  });

  builder.suggestScript('ai-docs:init', {
    command: 'kb ai-docs init',
    description: 'Bootstrap AI Docs skeleton'
  });
  builder.suggestScript('ai-docs:plan', {
    command: 'kb ai-docs plan',
    description: 'Generate documentation plan'
  });

  if (ctx.runtime?.fs?.mkdir && ctx.runtime.fs.writeFile) {
    await ctx.runtime.fs.mkdir(`${KB_DIR}/profiles`, { recursive: true });
    await ctx.runtime.fs.writeFile(
      `${KB_DIR}/.gitkeep`,
      '# AI Docs artifacts live here. Generated files should be reviewed before committing.\n'
    );
    ctx.logger?.info('AI Docs KB directory prepared.');
  }

  await ctx.runtime?.config?.ensureSection?.('aiDocs', defaultAiDocsConfig);

  return {
    message: 'AI Docs setup ready. Run `kb ai-docs init` to scaffold docs/ai-docs.',
    operations: builder.build().operations,
    configDefaults: {
      enabled: true,
      docsPath: 'docs/ai-docs',
      planPath: '.kb/ai-docs/plan.json'
    },
    suggestions: {
      scripts: {
        'ai-docs:init': 'kb ai-docs init',
        'ai-docs:plan': 'kb ai-docs plan',
        'ai-docs:audit': 'kb ai-docs audit'
      },
      gitignore: ['.kb/ai-docs/metadata/', '.kb/artifacts/ai-docs/', 'docs/ai-docs/**/*.tmp']
    }
  };
}

export default run;

