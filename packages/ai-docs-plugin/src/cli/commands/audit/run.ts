import { defineCommand, type CommandResult } from '@kb-labs/shared-command-kit';
import type { AuditDocsInput, AuditDocsOutput } from '../../../application/index';
import { auditDocs } from '../../../application/index';
import { resolveContext, createCliServices, type AiDocsCliContext } from '../../context';

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
      const outputText = ctx.output.ui.sideBox({
        title: 'AI Docs Audit',
        sections: [
          {
            items: [
              `${ctx.output.ui.symbols.success} ${ctx.output.ui.colors.success('Audit finished')}`,
              `Drift score: ${result.driftScore}`,
              `Missing sections: ${result.missing}`,
              `Outdated sections: ${result.outdated}`,
              `Report: ${result.driftPath}`,
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
    const outputText = output.ui.sideBox({
      title: 'AI Docs Audit',
      sections: [
        {
          items: [
            `${output.ui.symbols.success} ${output.ui.colors.success('Audit finished')}`,
            `Drift score: ${result.driftScore}`,
            `Missing sections: ${result.missing}`,
            `Outdated sections: ${result.outdated}`,
            `Report: ${result.driftPath}`,
          ],
        },
      ],
      status: 'success',
    });
    output.write(outputText);
  }

  return result;
}
