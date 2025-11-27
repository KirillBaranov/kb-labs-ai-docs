import { defineCommand, type CommandResult } from '@kb-labs/cli-command-kit';
import type { GenerateDocsInput, GenerateDocsOutput } from '../../../application/index.js';
import { generateDocs } from '../../../application/index.js';
import { resolveContext, createCliServices, type AiDocsCliContext } from '../../context.js';

type AiDocsGenerateFlags = {
  strategy: { type: 'string'; description?: string; choices?: readonly string[] };
  profile: { type: 'string'; description?: string };
  'plan-path': { type: 'string'; description?: string };
  sections: { type: 'string'; description?: string };
  'dry-run': { type: 'boolean'; description?: string; default?: boolean };
  'suggest-only': { type: 'boolean'; description?: string; default?: boolean };
  json: { type: 'boolean'; description?: string; default?: boolean };
};

type AiDocsGenerateResult = CommandResult & {
  result?: GenerateDocsOutput;
};

export const run = defineCommand<AiDocsGenerateFlags, AiDocsGenerateResult>({
  name: 'ai-docs:generate',
  flags: {
    strategy: {
      type: 'string',
      description: 'How to apply generated sections',
      choices: ['append', 'rewrite-section', 'suggest-only'] as const,
    },
    profile: {
      type: 'string',
      description: 'Profile ID',
    },
    'plan-path': {
      type: 'string',
      description: 'Path to plan.json',
    },
    sections: {
      type: 'string',
      description: 'Comma-separated section IDs to limit scope',
    },
    'dry-run': {
      type: 'boolean',
      description: 'Skip writes, produce diff artifacts',
      default: false,
    },
    'suggest-only': {
      type: 'boolean',
      description: 'Write suggestions without touching docs',
      default: false,
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
    
    logger?.info('AI Docs generate started', { flags });
    
    ctx.tracker.checkpoint('generate');

    const payload: GenerateDocsInput = {
      strategy: flags.strategy ?? 'append',
      sections: flags.sections ? flags.sections.split(',') : undefined,
      profile: flags.profile,
      dryRun: flags['dry-run'],
      suggestOnly: flags['suggest-only'],
      planPath: flags['plan-path']
    };
    
    const result = await generateDocs(payload, services);
    
    ctx.tracker.checkpoint('complete');
    
    logger?.info('AI Docs generate completed', { 
      sectionsCount: result.sections.length,
      suggestionsPath: result.suggestionsPath,
    });

    if (flags.json) {
      output.json(result);
    } else {
      const outputText = ctx.output.ui.sideBox({
        title: 'AI Docs Generate',
        sections: [
          {
            items: [
              `${ctx.output.ui.symbols.success} ${ctx.output.ui.colors.success('Generation complete')}`,
              `Sections: ${result.sections.length}`,
              `Suggestions path: ${result.suggestionsPath ?? 'n/a'}`,
            ],
          },
        ],
        status: 'success',
        timing: ctx.tracker.total(),
      });
      output.write(outputText);
    }

    return { ok: true, result };
  },
});

export async function runGenerateCommand(
  args: Partial<GenerateDocsInput> & { json?: boolean } = {},
  context?: AiDocsCliContext
): Promise<GenerateDocsOutput> {
  const { services, output, logger } = resolveContext(context);
  
  logger?.info('AI Docs generate started', { args });
  
  const payload: GenerateDocsInput = {
    strategy: args.strategy ?? 'append',
    sections: args.sections,
    profile: args.profile,
    dryRun: args.dryRun,
    suggestOnly: args.suggestOnly,
    planPath: args.planPath
  };
  const result = await generateDocs(payload, services);
  
  logger?.info('AI Docs generate completed', { 
    sectionsCount: result.sections.length,
    suggestionsPath: result.suggestionsPath,
  });

  if (args.json) {
    output.json(result);
  } else {
    const outputText = output.ui.sideBox({
      title: 'AI Docs Generate',
      sections: [
        {
          items: [
            `${output.ui.symbols.success} ${output.ui.colors.success('Generation complete')}`,
            `Sections: ${result.sections.length}`,
            `Suggestions path: ${result.suggestionsPath ?? 'n/a'}`,
          ],
        },
      ],
      status: 'success',
    });
    output.write(outputText);
  }

  return result;
}
