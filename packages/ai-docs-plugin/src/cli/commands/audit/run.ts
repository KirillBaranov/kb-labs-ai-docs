import type { AuditDocsInput, AuditDocsOutput } from '../../../application/index.js';
import { auditDocs } from '../../../application/index.js';
import { resolveContext, type AiDocsCliContext } from '../../context.js';

export interface AuditCommandArgs extends Partial<AuditDocsInput> {
  json?: boolean;
}

export async function runAuditCommand(args: AuditCommandArgs = {}, context?: AiDocsCliContext): Promise<AuditDocsOutput> {
  const { services, stdout } = resolveContext(context);
  const result = await auditDocs(args, services);

  if (args.json) {
    stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    stdout.write(
      [
        'AI Docs audit finished 🔍',
        `- Drift score: ${result.driftScore}`,
        `- Missing sections: ${result.missing}`,
        `- Outdated sections: ${result.outdated}`,
        `- Report: ${result.driftPath}`
      ].join('\n') + '\n'
    );
  }

  return result;
}

