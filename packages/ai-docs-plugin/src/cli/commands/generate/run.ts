import type { GenerateDocsInput, GenerateDocsOutput } from '../../../application/index.js';
import { generateDocs } from '../../../application/index.js';
import { resolveContext, type AiDocsCliContext } from '../../context.js';

export interface GenerateCommandArgs extends Partial<GenerateDocsInput> {
  json?: boolean;
}

export async function runGenerateCommand(
  args: GenerateCommandArgs = {},
  context?: AiDocsCliContext
): Promise<GenerateDocsOutput> {
  const { services, stdout } = resolveContext(context);
  const payload: GenerateDocsInput = {
    strategy: args.strategy ?? 'append',
    sections: args.sections,
    profile: args.profile,
    dryRun: args.dryRun,
    suggestOnly: args.suggestOnly,
    planPath: args.planPath
  };
  const result = await generateDocs(payload, services);

  if (args.json) {
    stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    stdout.write(
      [
        'AI Docs generation complete ✍️',
        `- Sections: ${result.sections.length}`,
        `- Suggestions path: ${result.suggestionsPath ?? 'n/a'}`
      ].join('\n') + '\n'
    );
  }

  return result;
}

