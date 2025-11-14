import type {
  AiDocsConfig,
  AuditCommandOutput,
  DocGenerationStrategy,
  DocsPlan,
  DocSection,
  GenerateCommandOutput,
  InitCommandOutput,
  PlanCommandOutput
} from '@kb-labs/ai-docs-contracts';
import type { DocsPlanEntity } from '../domain/plan.js';
import type { GenerationResultEntity } from '../domain/generation.js';
import type { DriftReport } from '@kb-labs/ai-docs-contracts';
import type { AiDocsConfigEntity } from '../domain/config.js';

export interface MindContextRequest {
  profile?: string;
  includeSources?: string[];
  includeDocs?: string[];
}

export interface MindContextSnapshot {
  modules: string[];
  adr: string[];
  domains: string[];
  notes: string[];
}

export interface LoggerPort {
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>): void;
}

export interface WorkflowPort {
  emit(event: { step: string; status: 'pending' | 'running' | 'success' | 'error'; meta?: Record<string, unknown> }): void;
}

export interface ConfigStorePort {
  load(): Promise<AiDocsConfigEntity | null>;
  save(config: AiDocsConfig): Promise<void>;
  ensureSection(config: AiDocsConfig): Promise<void>;
}

export interface DocsFsPort {
  writeSkeleton(basePath: string, files: Record<string, string>): Promise<string[]>;
  savePlan(plan: DocsPlan, targetPath?: string): Promise<string>;
  loadPlan(planPath: string): Promise<DocsPlan | null>;
  fileExists(path: string): Promise<boolean>;
  writeDoc(path: string, content: string, options?: { backup?: boolean }): Promise<void>;
  saveMetadata(metadata: Record<string, unknown>): Promise<string>;
  saveDrift(report: DriftReport, markdown: string): Promise<{ jsonPath: string; markdownPath: string }>;
  writeSuggestions(sectionId: string, content: string): Promise<string>;
  cleanupSuggestions(): Promise<void>;
}

export interface MockLlmsPort {
  generateSections(args: {
    context: MindContextSnapshot;
    plan: DocsPlanEntity;
    strategy: DocGenerationStrategy;
    targetSections: DocSection[];
    profile?: string;
  }): Promise<GenerationResultEntity>;
}

export interface AiDocsApplicationServices {
  configStore: ConfigStorePort;
  docsFs: DocsFsPort;
  mind: {
    fetchContext(request: MindContextRequest): Promise<MindContextSnapshot>;
  };
  generator: MockLlmsPort;
  logger: LoggerPort;
  workflow?: WorkflowPort;
  now(): Date;
}

export interface InitDocsInput {
  projectType: 'library' | 'service' | 'monolith';
  purpose: 'internal' | 'product' | 'platform';
  language: string;
  docsPath: string;
  format: 'md' | 'mdx';
  profile: string;
}

export interface PlanDocsInput {
  profile?: string;
  planPath?: string;
  includeDocs?: string[];
  includeSources?: string[];
}

export interface GenerateDocsInput {
  strategy: DocGenerationStrategy;
  sections?: string[];
  profile?: string;
  dryRun?: boolean;
  suggestOnly?: boolean;
  planPath?: string;
}

export interface AuditDocsInput {
  fromRevision?: string;
  toRevision?: string;
}

export type InitDocsOutput = InitCommandOutput;
export type PlanDocsOutput = PlanCommandOutput;
export type GenerateDocsOutput = GenerateCommandOutput;
export type AuditDocsOutput = AuditCommandOutput;

