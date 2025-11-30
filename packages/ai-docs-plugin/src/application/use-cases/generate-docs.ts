import type { AiDocsApplicationServices, GenerateDocsInput, GenerateDocsOutput } from '../types';
import { DOCS_DEFAULT_BASE_PATH } from '../../shared/index';
import { PLAN_FILE, ARTIFACTS_SUGGESTIONS_DIR } from '../../shared/constants';
import { collectSections } from '../../domain/plan';
import { planDocs } from './plan-docs';

export async function generateDocs(input: GenerateDocsInput | undefined, services: AiDocsApplicationServices): Promise<GenerateDocsOutput> {
  const config = (await services.configStore.load()) ?? undefined;
  const basePath = config?.output.basePath ?? DOCS_DEFAULT_BASE_PATH;
  const planPath = input?.planPath ?? PLAN_FILE;
  const profile = input?.profile ?? 'default';
  const mode = input?.dryRun ? 'dry-run' : input?.suggestOnly ? 'suggest-only' : 'write';

  services.workflow?.emit({
    step: 'ai-docs.generate',
    status: 'running',
    meta: {
      profile,
      planPath,
      mode
    }
  });

  let plan = await services.docsFs.loadPlan(planPath);
  if (!plan) {
    await planDocs(
      {
        profile,
        planPath
      },
      services
    );
    plan = await services.docsFs.loadPlan(planPath);
  }

  if (!plan) {
    throw new Error(`Unable to load AI Docs plan at ${planPath}`);
  }

  const flattened = collectSections(plan);
  const sectionFilter = input?.sections && input.sections.length > 0 ? new Set(input.sections) : null;
  const targetSections = flattened.filter((section) => (sectionFilter ? sectionFilter.has(section.id) : true));

  if (targetSections.length === 0) {
    return {
      sections: [],
      metadataPaths: [],
      suggestionsPath: input?.dryRun || input?.suggestOnly ? ARTIFACTS_SUGGESTIONS_DIR : undefined
    };
  }

  const context = await services.mind.fetchContext({
    profile,
    includeDocs: plan.inputs.docs,
    includeSources: plan.inputs.code
  });

  const generation = await services.generator.generateSections({
    context,
    plan,
    strategy: input?.strategy ?? 'append',
    targetSections,
    profile
  });

  const suggestionsPath = input?.dryRun || input?.suggestOnly ? ARTIFACTS_SUGGESTIONS_DIR : undefined;

  for (const section of generation.sections) {
    if (!section.content) {
      services.logger.log('warn', 'Generated section missing content', { sectionId: section.sectionId });
      continue;
    }

    if (input?.dryRun || input?.suggestOnly) {
      await services.docsFs.writeSuggestions(section.sectionId, section.content);
    } else {
      await services.docsFs.writeDoc(section.targetPath, section.content, { backup: true });
    }
  }

  if (!input?.dryRun && !input?.suggestOnly) {
    await services.docsFs.cleanupSuggestions();
  }

  const metadataPath = await services.docsFs.saveMetadata({
    planPath,
    generatedAt: services.now().toISOString(),
    sectionsProcessed: generation.sections.length,
    dryRun: Boolean(input?.dryRun),
    suggestOnly: Boolean(input?.suggestOnly),
    profile,
    outputRoot: basePath
  });

  services.logger.log('info', 'AI Docs generation completed', {
    sections: generation.sections.length,
    mode
  });
  services.workflow?.emit({
    step: 'ai-docs.generate',
    status: 'success',
    meta: {
      sections: generation.sections.length,
      mode,
      planPath
    }
  });

  return {
    sections: generation.sections,
    metadataPaths: [metadataPath],
    suggestionsPath
  };
}

