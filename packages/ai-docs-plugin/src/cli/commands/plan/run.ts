import type { PlanDocsInput, PlanDocsOutput } from '../../../application/index.js';
import { planDocs } from '../../../application/index.js';
import { resolveContext, type AiDocsCliContext } from '../../context.js';

export interface PlanCommandArgs extends Partial<PlanDocsInput> {
  json?: boolean;
}

export async function runPlanCommand(args: PlanCommandArgs = {}, context?: AiDocsCliContext): Promise<PlanDocsOutput> {
  const { services, stdout } = resolveContext(context);
  const result = await planDocs(args, services);

  if (args.json) {
    stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    stdout.write(
      [
        'AI Docs plan ready 📋',
        `- Plan path: ${result.planPath}`,
        `- Sections: ${result.sections}`,
        `- Missing: ${result.missingSections}`,
        `- Gaps: ${result.gaps.length}`
      ].join('\n') + '\n'
    );
  }

  return result;
}

