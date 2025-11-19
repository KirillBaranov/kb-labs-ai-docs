import type {
  GenerateCommandOutput,
  GeneratedSectionResult,
  GenerationMetadata
} from '@kb-labs/ai-docs-contracts';

export type GenerationResultEntity = GenerateCommandOutput;

export function buildSectionResult(
  partial: Partial<GeneratedSectionResult> & Pick<GeneratedSectionResult, 'sectionId' | 'targetPath'>
): GeneratedSectionResult {
  return {
    strategy: partial.strategy ?? 'append',
    status: partial.status ?? 'created',
    confidence: partial.confidence ?? 0.5,
    needsReview: partial.needsReview ?? false,
    note: partial.note,
    content: partial.content,
    sectionId: partial.sectionId,
    targetPath: partial.targetPath
  };
}

export function createMetadata(input: GenerationMetadata): GenerationMetadata {
  return {
    ...input,
    mode: input.mode ?? 'applied'
  };
}

