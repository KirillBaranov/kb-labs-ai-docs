import type { AiDocsApplicationServices } from '../application/index';
import { planDocs } from '../application/use-cases/plan-docs';
import { auditDocs } from '../application/use-cases/audit-docs';

export interface AuditWorkflowInput {
  profile?: string;
  planPath?: string;
  fromRevision?: string;
  toRevision?: string;
}

export interface AuditWorkflowContext {
  services?: AiDocsApplicationServices;
}

export async function runAuditWorkflow(input: AuditWorkflowInput, ctx: AuditWorkflowContext): Promise<void> {
  if (!ctx.services) {
    throw new Error('runAuditWorkflow requires application services');
  }

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

  await auditDocs(
    {
      fromRevision: input.fromRevision,
      toRevision: input.toRevision
    },
    ctx.services
  );
}

