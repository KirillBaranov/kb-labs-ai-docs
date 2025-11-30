import type { AiDocsApplicationServices } from '../application/index';
import { planDocs } from '../application/use-cases/plan-docs';

export interface PlanWorkflowInput {
  profile?: string;
  planPath?: string;
  includeDocs?: string[];
  includeSources?: string[];
}

export interface PlanWorkflowContext {
  services?: AiDocsApplicationServices;
}

export async function runPlanWorkflow(input: PlanWorkflowInput, ctx: PlanWorkflowContext): Promise<void> {
  if (!ctx.services) {
    throw new Error('runPlanWorkflow requires application services');
  }

  await planDocs(
    {
      profile: input.profile,
      planPath: input.planPath,
      includeDocs: input.includeDocs,
      includeSources: input.includeSources
    },
    ctx.services
  );
}

