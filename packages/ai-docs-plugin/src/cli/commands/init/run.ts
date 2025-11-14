import type { InitDocsInput, InitDocsOutput } from '../../../application/index.js';
import { initDocs } from '../../../application/index.js';
import { resolveContext, type AiDocsCliContext } from '../../context.js';

export interface InitCommandArgs extends Partial<InitDocsInput> {
  json?: boolean;
}

export async function runInitCommand(args: InitCommandArgs = {}, context?: AiDocsCliContext): Promise<InitDocsOutput> {
  const { services, stdout } = resolveContext(context);
  const result = await initDocs(args, services);

  if (args.json) {
    stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    stdout.write(
      [
        'AI Docs initialization complete ✅',
        `- Docs path: ${result.docsPath}`,
        `- Created files: ${result.createdFiles.length}`,
        `- Profile: ${result.profile}`
      ].join('\n') + '\n'
    );
  }

  return result;
}

