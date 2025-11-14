import path from 'node:path';
import { DOCS_DEFAULT_BASE_PATH, DEFAULT_SECTION_BLUEPRINT } from '../../shared/index.js';
import { PLAN_FILE } from '../../shared/constants.js';
import { planSummary } from '../../domain/plan.js';
import type { AiDocsApplicationServices, PlanDocsInput, PlanDocsOutput } from '../types.js';
import type { DocsPlanEntity } from '../../domain/plan.js';
import type { DocSection } from '@kb-labs/ai-docs-contracts';

export async function planDocs(input: PlanDocsInput | undefined, services: AiDocsApplicationServices): Promise<PlanDocsOutput> {
  const config = (await services.configStore.load()) ?? undefined;
  const basePath = config?.output.basePath ?? DOCS_DEFAULT_BASE_PATH;
  const now = services.now().toISOString();
  const extension = config?.output.format ?? 'md';
  const planPath = input?.planPath ?? PLAN_FILE;
  const profile = input?.profile ?? 'default';

  services.workflow?.emit({
    step: 'ai-docs.plan',
    status: 'running',
    meta: {
      profile,
      planPath
    }
  });

  const sections = await Promise.all(
    DEFAULT_SECTION_BLUEPRINT.map(async (section) => {
      const targetPath = path.join(basePath, `${section.id}.${extension}`);
      const exists = await services.docsFs.fileExists(targetPath);
      return {
        id: section.id,
        title: section.title,
        targetPath,
        status: (exists ? 'existing' : 'missing') as DocSection['status'],
        sources: [],
        tags: [],
        children: [] as DocSection[]
      };
    })
  );

  const gaps = sections
    .filter((section) => section.status === 'missing')
    .map((section) => ({
      id: `gap-${section.id}`,
      title: section.title,
      severity: 'warning' as const,
      reason: `Section ${section.title} is missing`,
      relatedPath: section.targetPath
    }));

  const plan: DocsPlanEntity = {
    generatedAt: now,
    configHash: JSON.stringify(config ?? {}),
    sections,
    gaps,
    inputs: {
      code: input?.includeSources ?? [],
      docs: input?.includeDocs ?? [],
      specs: []
    },
    profile: input?.profile
  };

  const savedPlanPath = await services.docsFs.savePlan(plan, planPath);

  const summary = planSummary(plan);

  services.logger.log('info', 'AI Docs plan generated', {
    sections: summary.sections,
    missing: summary.missing,
    planPath: savedPlanPath
  });
  services.workflow?.emit({
    step: 'ai-docs.plan',
    status: 'success',
    meta: {
      sections: summary.sections,
      missing: summary.missing,
      planPath: savedPlanPath
    }
  });

  return {
    planPath: savedPlanPath,
    sections: summary.sections,
    missingSections: summary.missing,
    gaps: summary.gaps
  };
}

