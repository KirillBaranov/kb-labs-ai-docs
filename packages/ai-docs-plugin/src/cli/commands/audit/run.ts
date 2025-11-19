import { defineCommand, type CommandResult } from '@kb-labs/cli-command-kit';
import type { AuditDocsInput, AuditDocsOutput } from '../../../application/index.js';
import { auditDocs } from '../../../application/index.js';
import { resolveContext, createCliServices, type AiDocsCliContext } from '../../context.js';

type AiDocsAuditFlags = {
  from: { type: 'string'; description?: string };
  to: { type: 'string'; description?: string };
  json: { type: 'boolean'; description?: string; default?: boolean };
};

type AiDocsAuditResult = CommandResult & {
  result?: AuditDocsOutput;
};

export const run = defineCommand<AiDocsAuditFlags, AiDocsAuditResult>({
  name: 'ai-docs:audit',
  flags: {
    from: {
      type: 'string',
      description: 'Git revision start',
    },
    to: {
      type: 'string',
      description: 'Git revision end',
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
    
    logger?.info('AI Docs audit started', { flags });
    
    ctx.tracker.checkpoint('audit');

    const args: Partial<AuditDocsInput> = {
      from: flags.from,
      to: flags.to,
    };
    
    const result = await auditDocs(args, services);
    
    ctx.tracker.checkpoint('complete');
    
    logger?.info('AI Docs audit completed', { 
      driftScore: result.driftScore,
      missing: result.missing,
      outdated: result.outdated,
      driftPath: result.driftPath,
    });

    if (flags.json) {
      output.json(result);
    } else {
      output.write([
        'AI Docs audit finished 🔍',
        `- Drift score: ${result.driftScore}`,
        `- Missing sections: ${result.missing}`,
        `- Outdated sections: ${result.outdated}`,
        `- Report: ${result.driftPath}`
      ].join('\n') + '\n');
    }

    return { ok: true, result };
  },
});

export async function runAuditCommand(args: Partial<AuditDocsInput> & { json?: boolean } = {}, context?: AiDocsCliContext): Promise<AuditDocsOutput> {
  const { services, output, logger } = resolveContext(context);
  
  logger?.info('AI Docs audit started', { args });
  
  const result = await auditDocs(args, services);
  
  logger?.info('AI Docs audit completed', { 
    driftScore: result.driftScore,
    missing: result.missing,
    outdated: result.outdated,
    driftPath: result.driftPath,
  });

  if (args.json) {
    output.json(result);
  } else {
    output.write([
      'AI Docs audit finished 🔍',
      `- Drift score: ${result.driftScore}`,
      `- Missing sections: ${result.missing}`,
      `- Outdated sections: ${result.outdated}`,
      `- Report: ${result.driftPath}`
    ].join('\n') + '\n');
  }

  return result;
}
