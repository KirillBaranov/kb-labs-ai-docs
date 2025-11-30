import type { AiDocsApplicationServices } from '../application/index';
import { planDocs } from '../application/use-cases/plan-docs';
import { generateDocs } from '../application/use-cases/generate-docs';

export interface GenerateWorkflowInput {
  profile?: string;
  planPath?: string;
  sections?: string[];
  strategy?: 'append' | 'rewrite-section' | 'suggest-only';
  dryRun?: boolean;
  suggestOnly?: boolean;
}

export interface GenerateWorkflowContext {
  services?: AiDocsApplicationServices;
}

export async function runGenerateWorkflow(input: GenerateWorkflowInput, ctx: GenerateWorkflowContext): Promise<void> {
  if (!ctx.services) {
    throw new Error('runGenerateWorkflow requires application services');
  }

  // Ensure plan exists unless a planPath is explicitly provided and already present
  if (input.planPath) {
    const exists = await ctx.services.docsFs.fileExists(input.planPath);
    if (!exists) {
      await planDocs(
        {
          profile: input.profile,
          planPath: input.planPath
        },
        ctx.services
      );
    }
  } else {
    await planDocs(
      {
        profile: input.profile
      },
      ctx.services
    );
  }

  await generateDocs(
    {
      profile: input.profile,
      planPath: input.planPath,
      sections: input.sections,
      strategy: input.strategy ?? 'append',
      dryRun: input.dryRun,
      suggestOnly: input.suggestOnly
    },
    ctx.services
  );
}

