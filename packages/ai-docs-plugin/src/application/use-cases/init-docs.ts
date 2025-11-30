import { DOCS_DEFAULT_BASE_PATH } from '../../shared/constants';
import { createDefaultConfig } from '../../domain/config';
import type { AiDocsApplicationServices, InitDocsInput, InitDocsOutput } from '../types';

const DEFAULT_FILES: Record<string, string> = {
  'overview.md': '# Project Overview\n\nDescribe the mission and scope.\n',
  'architecture.md': '# Architecture\n\nHigh-level diagrams, modules, and data flows.\n',
  'getting-started.md': '# Getting Started\n\nCommands, prerequisites, and environments.\n',
  'conventions.md': '# Conventions\n\nCoding, testing, release, and documentation rules.\n'
};

export async function initDocs(input: Partial<InitDocsInput>, services: AiDocsApplicationServices): Promise<InitDocsOutput> {
  const config = (await services.configStore.load()) ?? createDefaultConfig();

  const docsPath = input.docsPath ?? config.output.basePath ?? DOCS_DEFAULT_BASE_PATH;
  const format = input.format ?? config.output.format ?? 'md';

  const nextConfig = {
    ...config,
    output: {
      ...config.output,
      basePath: docsPath,
      format
    },
    style: {
      ...config.style,
      language: input.language ?? config.style.language ?? 'en'
    }
  };

  await services.configStore.save(nextConfig);

  const skeletonFiles = Object.fromEntries(
    Object.entries(DEFAULT_FILES).map(([relativePath, content]) => [
      `${docsPath.replace(/\/$/, '')}/${relativePath}`,
      content
    ])
  );

  const createdFiles = await services.docsFs.writeSkeleton(docsPath, skeletonFiles);

  services.logger.log('info', 'AI Docs skeleton created', {
    docsPath,
    files: createdFiles.length
  });

  return {
    docsPath,
    configPath: 'kb.config.json',
    createdFiles,
    profile: input.profile ?? 'default'
  };
}

