import { defineCommand, type CommandResult } from '@kb-labs/cli-command-kit';
import type { InitDocsInput, InitDocsOutput } from '../../../application/index.js';
import { initDocs } from '../../../application/index.js';
import { resolveContext, createCliServices, type AiDocsCliContext } from '../../context.js';

type AiDocsInitFlags = {
  'docs-path': { type: 'string'; description?: string };
  format: { type: 'string'; description?: string; choices?: readonly string[] };
  language: { type: 'string'; description?: string; default?: string };
  json: { type: 'boolean'; description?: string; default?: boolean };
};

type AiDocsInitResult = CommandResult & {
  result?: InitDocsOutput;
};

export const run = defineCommand<AiDocsInitFlags, AiDocsInitResult>({
  name: 'ai-docs:init',
  flags: {
    'docs-path': {
      type: 'string',
      description: 'Custom docs root (default docs/ai-docs)',
    },
    format: {
      type: 'string',
      description: 'md or mdx',
      choices: ['md', 'mdx'] as const,
    },
    language: {
      type: 'string',
      description: 'Target language (default en)',
      default: 'en',
    },
    json: {
      type: 'boolean',
      description: 'Return JSON payload',
      default: false,
    },
  },
  async handler(ctx, argv, flags) {
    const context: AiDocsCliContext = {
      output: ctx.output,
      logger: ctx.logger,
      cwd: ctx.cwd,
      services: createCliServices(),
    };
    
    const { services, output, logger } = resolveContext(context);
    
    logger?.info('AI Docs init started', { flags });
    
    ctx.tracker.checkpoint('init');

    const args: Partial<InitDocsInput> = {
      docsPath: flags['docs-path'],
      format: flags.format,
      language: flags.language,
    };
    
    const result = await initDocs(args, services);
    
    ctx.tracker.checkpoint('complete');
    
    logger?.info('AI Docs init completed', { 
      docsPath: result.docsPath,
      createdFilesCount: result.createdFiles.length,
      profile: result.profile,
    });

    if (flags.json) {
      output.json(result);
    } else {
      output.write([
        'AI Docs initialization complete ✅',
        `- Docs path: ${result.docsPath}`,
        `- Created files: ${result.createdFiles.length}`,
        `- Profile: ${result.profile}`
      ].join('\n') + '\n');
    }

    return { ok: true, result };
  },
});

export async function runInitCommand(args: Partial<InitDocsInput> & { json?: boolean } = {}, context?: AiDocsCliContext): Promise<InitDocsOutput> {
  const { services, output, logger } = resolveContext(context);
  
  logger?.info('AI Docs init started', { args });
  
  const result = await initDocs(args, services);
  
  logger?.info('AI Docs init completed', { 
    docsPath: result.docsPath,
    createdFilesCount: result.createdFiles.length,
    profile: result.profile,
  });

  if (args.json) {
    output.json(result);
  } else {
    output.write([
      'AI Docs initialization complete ✅',
      `- Docs path: ${result.docsPath}`,
      `- Created files: ${result.createdFiles.length}`,
      `- Profile: ${result.profile}`
    ].join('\n') + '\n');
  }

  return result;
}
