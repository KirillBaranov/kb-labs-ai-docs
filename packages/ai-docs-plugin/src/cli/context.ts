import type { AiDocsApplicationServices } from '../application/index.js';
import {
  createConfigStore,
  createDocsFs,
  createMockLlms,
  createMockMindClient,
  createConsoleLogger
} from '../infra/index.js';

export interface AiDocsCliContext {
  services?: AiDocsApplicationServices;
  stdout?: NodeJS.WritableStream;
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

export function resolveContext(context: AiDocsCliContext = {}): Required<AiDocsCliContext> {
  return {
    stdout: context.stdout ?? process.stdout,
    services: context.services ?? createCliServices()
  };
}

