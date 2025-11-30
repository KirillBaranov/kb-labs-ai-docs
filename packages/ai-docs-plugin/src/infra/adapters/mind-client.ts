import type { MindContextRequest, MindContextSnapshot } from '../../application/types';

export interface MindClient {
  fetchContext(request: MindContextRequest): Promise<MindContextSnapshot>;
}

export function createMockMindClient(): MindClient {
  return {
    async fetchContext(request) {
      return {
        modules: ['core', 'api', 'infra'],
        adr: ['ADR-001: Use AI Docs', 'ADR-002: Enforce drift auditing'],
        domains: ['engineering-docs'],
        notes: [
          `profile=${request.profile ?? 'default'}`,
          `sources=${request.includeSources?.length ?? 0}`,
          `docs=${request.includeDocs?.length ?? 0}`
        ]
      };
    }
  };
}

