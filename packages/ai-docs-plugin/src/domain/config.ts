import type {
  AiDocsConfig,
  AiDocsProfile,
  AiDocsProvider,
  AiDocsStyle,
  AiDocsSources,
  AiDocsThresholds
} from '@kb-labs/ai-docs-contracts';
import {
  aiDocsConfigSchema,
  aiDocsProfileSchema,
  aiDocsProviderSchema,
  aiDocsSourcesSchema,
  aiDocsStyleSchema,
  aiDocsThresholdsSchema
} from '@kb-labs/ai-docs-contracts';

export type AiDocsConfigEntity = AiDocsConfig;

export interface ConfigValidationResult {
  ok: true;
  value: AiDocsConfigEntity;
}

export interface ConfigValidationError {
  ok: false;
  issues: string[];
}

export type ConfigValidation = ConfigValidationResult | ConfigValidationError;

export function validateConfig(input: unknown): ConfigValidation {
  const parsed = aiDocsConfigSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      issues: parsed.error.issues.map((issue) => issue.message)
    };
  }

  return {
    ok: true,
    value: parsed.data
  };
}

export function createDefaultConfig(): AiDocsConfigEntity {
  return aiDocsConfigSchema.parse({
    sources: aiDocsSourcesSchema.parse(undefined),
    output: {
      basePath: 'docs/ai-docs',
      format: 'md',
      naming: 'kebab'
    },
    style: aiDocsStyleSchema.parse(undefined),
    profiles: [createProfile({ id: 'internal', description: 'Default AI Docs profile' })],
    provider: aiDocsProviderSchema.parse(undefined),
    thresholds: aiDocsThresholdsSchema.parse(undefined)
  });
}

export function createProfile(input: Partial<AiDocsProfile> & { id: string }): AiDocsProfile {
  return aiDocsProfileSchema.parse(input);
}

export function mergeProfile(base: AiDocsConfigEntity, profileId: string): AiDocsConfigEntity {
  const profile = base.profiles.find((item) => item.id === profileId);
  if (!profile) {
    return base;
  }

  return {
    ...base,
    sources: {
      ...base.sources,
      ...profile.sources
    } as AiDocsSources,
    style: {
      ...base.style,
      ...profile.style
    } as AiDocsStyle,
    provider: {
      ...base.provider,
      ...profile.provider
    } as AiDocsProvider
  };
}

export function evaluateThresholds(config: AiDocsConfigEntity): AiDocsThresholds {
  return aiDocsThresholdsSchema.parse(config.thresholds);
}

