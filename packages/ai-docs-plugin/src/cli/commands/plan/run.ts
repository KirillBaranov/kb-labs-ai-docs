import { defineCommand, type CommandResult } from '@kb-labs/cli-command-kit';
import type { PlanDocsInput, PlanDocsOutput } from '../../../application/index.js';
import { planDocs } from '../../../application/index.js';
import { resolveContext, createCliServices, type AiDocsCliContext } from '../../context.js';

type AiDocsPlanFlags = {
  profile: { type: 'string'; description?: string };
  'plan-path': { type: 'string'; description?: string };
  json: { type: 'boolean'; description?: string; default?: boolean };
};

type AiDocsPlanResult = CommandResult & {
  result?: PlanDocsOutput;
};

export const run = defineCommand<AiDocsPlanFlags, AiDocsPlanResult>({
  name: 'ai-docs:plan',
  flags: {
    profile: {
      type: 'string',
      description: 'Profile ID',
    },
    'plan-path': {
      type: 'string',
      description: 'Override plan output path',
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
    
    logger?.info('AI Docs plan started', { flags });
    
    ctx.tracker.checkpoint('plan');

    const args: Partial<PlanDocsInput> = {
      profile: flags.profile,
      planPath: flags['plan-path'],
    };
    
    const result = await planDocs(args, services);
    
    ctx.tracker.checkpoint('complete');
    
    logger?.info('AI Docs plan completed', { 
      planPath: result.planPath,
      sections: result.sections,
      missingSections: result.missingSections,
      gapsCount: result.gaps.length,
    });

    if (flags.json) {
      output.json(result);
    } else {
      output.write([
        'AI Docs plan ready 📋',
        `- Plan path: ${result.planPath}`,
        `- Sections: ${result.sections}`,
        `- Missing: ${result.missingSections}`,
        `- Gaps: ${result.gaps.length}`
      ].join('\n') + '\n');
    }

    return { ok: true, result };
  },
});

export async function runPlanCommand(args: Partial<PlanDocsInput> & { json?: boolean } = {}, context?: AiDocsCliContext): Promise<PlanDocsOutput> {
  const { services, output, logger } = resolveContext(context);
  
  logger?.info('AI Docs plan started', { args });
  
  const result = await planDocs(args, services);
  
  logger?.info('AI Docs plan completed', { 
    planPath: result.planPath,
    sections: result.sections,
    missingSections: result.missingSections,
    gapsCount: result.gaps.length,
  });

  if (args.json) {
    output.json(result);
  } else {
    output.write([
      'AI Docs plan ready 📋',
      `- Plan path: ${result.planPath}`,
      `- Sections: ${result.sections}`,
      `- Missing: ${result.missingSections}`,
      `- Gaps: ${result.gaps.length}`
    ].join('\n') + '\n');
  }

  return result;
}
