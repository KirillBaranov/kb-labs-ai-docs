import type { AiDocsApplicationServices } from '../application/index';
import {
  createConfigStore,
  createDocsFs,
  createMockLlms,
  createMockMindClient,
  createConsoleLogger
} from '../infra/index';

import type { Output } from '@kb-labs/core-sys/output';
import type { Logger } from '@kb-labs/core-sys/logging';
// @ts-expect-error - types will be available after command-kit types are generated
import type { CliContext } from '@kb-labs/cli-core';

export interface AiDocsCliContext {
  services?: AiDocsApplicationServices;
  output?: Output;
  logger?: Logger;
  cwd?: string;
}

export function createCliServices(): AiDocsApplicationServices {
  const logger = createConsoleLogger({ scope: 'ai-docs:cli' });
  const mindClient = createMockMindClient();

  return {
    configStore: createConfigStore(),
    docsFs: createDocsFs(),
    mind: {
      fetchContext: (request) => mindClient.fetchContext(request)
    },
    generator: createMockLlms(),
    logger,
    now: () => new Date()
  };
}

export function resolveContext(context: AiDocsCliContext = {}): {
  services: AiDocsApplicationServices;
  output: CliContext['output'];
  logger: CliContext['logger'];
} {
  if (!context.output) {
    throw new Error('Output is required. Ensure CliContext with output is passed to command handler.');
  }
  
  return {
    services: context.services ?? createCliServices(),
    output: context.output,
    logger: context.logger,
  };
}

