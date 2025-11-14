import { z } from 'zod';

export const docGenerationStrategySchema = z.enum(['append', 'rewrite-section', 'suggest-only']);
export type DocGenerationStrategy = z.infer<typeof docGenerationStrategySchema>;

const aiDocsSourcesShape = z.object({
  codeGlobs: z.array(z.string().min(1)).default(['src/**/*.{ts,tsx,js,jsx}', 'package.json']),
  docsGlobs: z.array(z.string().min(1)).default(['docs/**/*.{md,mdx}', 'README.md']),
  apiSpecs: z.array(z.string().min(1)).default([])
});

export const aiDocsSourcesSchema = aiDocsSourcesShape
  .default({
    codeGlobs: ['src/**/*.{ts,tsx,js,jsx}', 'package.json'],
    docsGlobs: ['docs/**/*.{md,mdx}', 'README.md'],
    apiSpecs: []
  });
export type AiDocsSources = z.infer<typeof aiDocsSourcesSchema>;

export const aiDocsOutputSchema = z
  .object({
    basePath: z.string().min(1).default('docs/ai-docs'),
    format: z.enum(['md', 'mdx']).default('md'),
    naming: z.enum(['kebab', 'pascal', 'nested']).default('kebab')
  })
  .default({
    basePath: 'docs/ai-docs',
    format: 'md',
    naming: 'kebab'
  });
export type AiDocsOutput = z.infer<typeof aiDocsOutputSchema>;

const aiDocsStyleShape = z.object({
  language: z.string().default('en'),
  formality: z.enum(['casual', 'neutral', 'formal']).default('neutral'),
  preferences: z.array(z.enum(['examples', 'diagrams', 'text-first', 'ops', 'api'])).default([])
});

export const aiDocsStyleSchema = aiDocsStyleShape
  .default({
    language: 'en',
    formality: 'neutral',
    preferences: []
  });
export type AiDocsStyle = z.infer<typeof aiDocsStyleSchema>;

const aiDocsProviderShape = z.object({
  mindProfile: z.string().default('default'),
  llmProfile: z.string().default('mock')
});

export const aiDocsProviderSchema = aiDocsProviderShape
  .default({
    mindProfile: 'default',
    llmProfile: 'mock'
  });
export type AiDocsProvider = z.infer<typeof aiDocsProviderSchema>;

export const aiDocsThresholdsSchema = z
  .object({
    driftScoreMinimum: z.number().min(0).max(100).default(70),
    maxChangesPerRun: z.number().min(1).default(25)
  })
  .default({
    driftScoreMinimum: 70,
    maxChangesPerRun: 25
  });
export type AiDocsThresholds = z.infer<typeof aiDocsThresholdsSchema>;

export const aiDocsProfileSchema = z.object({
  id: z.string().min(1),
  description: z.string().optional(),
  sources: aiDocsSourcesShape.partial().optional(),
  style: aiDocsStyleShape.partial().optional(),
  provider: aiDocsProviderShape.partial().optional()
});
export type AiDocsProfile = z.infer<typeof aiDocsProfileSchema>;

export const aiDocsConfigSchema = z.object({
  sources: aiDocsSourcesSchema,
  output: aiDocsOutputSchema,
  style: aiDocsStyleSchema,
  profiles: z.array(aiDocsProfileSchema).default([]),
  provider: aiDocsProviderSchema,
  thresholds: aiDocsThresholdsSchema
});
export type AiDocsConfig = z.infer<typeof aiDocsConfigSchema>;

export const docSectionStatusSchema = z.enum(['existing', 'new', 'missing']);
export type DocSectionStatus = z.infer<typeof docSectionStatusSchema>;

export interface DocSection {
  id: string;
  title: string;
  targetPath: string;
  status: DocSectionStatus;
  sources?: string[];
  tags?: string[];
  children?: DocSection[];
}

export const docSectionSchema: z.ZodType<DocSection> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    targetPath: z.string().min(1),
    status: docSectionStatusSchema,
    sources: z.array(z.string().min(1)).default([]),
    tags: z.array(z.string().min(1)).default([]),
    children: z.array(docSectionSchema).default([])
  })
);

export const docsPlanGapSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  severity: z.enum(['info', 'warning', 'critical']).default('warning'),
  reason: z.string().min(1),
  relatedPath: z.string().optional()
});
export type DocsPlanGap = z.infer<typeof docsPlanGapSchema>;

export const docsPlanSchema = z.object({
  generatedAt: z.string().min(1),
  profile: z.string().optional(),
  configHash: z.string().min(1),
  sections: z.array(docSectionSchema),
  gaps: z.array(docsPlanGapSchema).default([]),
  inputs: z.object({
    code: z.array(z.string().min(1)).default([]),
    docs: z.array(z.string().min(1)).default([]),
    specs: z.array(z.string().min(1)).default([])
  })
});
export type DocsPlan = z.infer<typeof docsPlanSchema>;

export const generatedSectionResultSchema = z.object({
  sectionId: z.string().min(1),
  targetPath: z.string().min(1),
  strategy: docGenerationStrategySchema,
  status: z.enum(['created', 'updated', 'skipped']).default('created'),
  confidence: z.number().min(0).max(1).default(0.5),
  needsReview: z.boolean().default(false),
  note: z.string().optional(),
  content: z.string().optional()
});
export type GeneratedSectionResult = z.infer<typeof generatedSectionResultSchema>;

export const generationMetadataSchema = z.object({
  path: z.string().min(1),
  sectionId: z.string().min(1),
  strategy: docGenerationStrategySchema,
  profile: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  mode: z.enum(['applied', 'dry-run', 'suggest-only']).default('applied'),
  lastUpdatedAt: z.string().min(1)
});
export type GenerationMetadata = z.infer<typeof generationMetadataSchema>;

export const driftEntrySchema = z.object({
  sectionId: z.string().optional(),
  path: z.string().min(1),
  status: z.enum(['in-sync', 'outdated', 'missing']),
  reason: z.string().optional(),
  confidence: z.number().min(0).max(1).optional()
});
export type DriftEntry = z.infer<typeof driftEntrySchema>;

export const driftReportSchema = z.object({
  generatedAt: z.string().min(1),
  score: z.number().min(0).max(100),
  entries: z.array(driftEntrySchema),
  summary: z.object({
    inSync: z.number().nonnegative().default(0),
    outdated: z.number().nonnegative().default(0),
    missing: z.number().nonnegative().default(0)
  })
});
export type DriftReport = z.infer<typeof driftReportSchema>;

// Command IO schemas
export const initCommandInputSchema = z.object({
  configPath: z.string().default('kb.config.json'),
  projectType: z.enum(['library', 'service', 'monolith']).default('service'),
  purpose: z.enum(['internal', 'product', 'platform']).default('internal'),
  language: z.string().default('en'),
  docsPath: z.string().default('docs/ai-docs'),
  format: z.enum(['md', 'mdx']).default('md'),
  audience: z.string().default('engineering'),
  profile: z.string().default('default')
});
export type InitCommandInput = z.infer<typeof initCommandInputSchema>;

export const initCommandOutputSchema = z.object({
  docsPath: z.string(),
  configPath: z.string(),
  createdFiles: z.array(z.string()),
  profile: z.string()
});
export type InitCommandOutput = z.infer<typeof initCommandOutputSchema>;

export const planCommandInputSchema = z.object({
  configPath: z.string().default('kb.config.json'),
  planPath: z.string().default('.kb/ai-docs/plan.json'),
  includeDocs: z.array(z.string()).optional(),
  includeSources: z.array(z.string()).optional(),
  specs: z.array(z.string()).optional(),
  profile: z.string().optional()
});
export type PlanCommandInput = z.infer<typeof planCommandInputSchema>;

export const planCommandOutputSchema = z.object({
  planPath: z.string(),
  sections: z.number(),
  missingSections: z.number(),
  gaps: z.array(docsPlanGapSchema)
});
export type PlanCommandOutput = z.infer<typeof planCommandOutputSchema>;

export const generateCommandInputSchema = z.object({
  configPath: z.string().default('kb.config.json'),
  planPath: z.string().default('.kb/ai-docs/plan.json'),
  strategy: docGenerationStrategySchema.default('append'),
  sections: z.array(z.string()).optional(),
  profile: z.string().optional(),
  dryRun: z.boolean().default(false),
  suggestOnly: z.boolean().default(false)
});
export type GenerateCommandInput = z.infer<typeof generateCommandInputSchema>;

export const generateCommandOutputSchema = z.object({
  sections: z.array(generatedSectionResultSchema),
  metadataPaths: z.array(z.string()).optional(),
  suggestionsPath: z.string().optional()
});
export type GenerateCommandOutput = z.infer<typeof generateCommandOutputSchema>;

export const auditCommandInputSchema = z.object({
  configPath: z.string().default('kb.config.json'),
  planPath: z.string().default('.kb/ai-docs/plan.json'),
  driftPath: z.string().default('.kb/ai-docs/drift.json'),
  fromRevision: z.string().optional(),
  toRevision: z.string().optional()
});
export type AuditCommandInput = z.infer<typeof auditCommandInputSchema>;

export const auditCommandOutputSchema = z.object({
  driftPath: z.string(),
  markdownReportPath: z.string(),
  driftScore: z.number(),
  missing: z.number(),
  outdated: z.number()
});
export type AuditCommandOutput = z.infer<typeof auditCommandOutputSchema>;

export const aiDocsMetadataSchema = z.object({
  planPath: z.string().default('.kb/ai-docs/plan.json'),
  metadataDir: z.string().default('.kb/ai-docs/metadata'),
  driftReports: z.array(z.string()).default([])
});
export type AiDocsMetadata = z.infer<typeof aiDocsMetadataSchema>;

