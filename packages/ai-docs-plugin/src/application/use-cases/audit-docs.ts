import type { DriftEntry } from '@kb-labs/ai-docs-contracts';
import type { AiDocsApplicationServices, AuditDocsInput, AuditDocsOutput } from '../types';
import { createEmptyDriftReport, addDriftEntry } from '../../domain/drift';

export async function auditDocs(input: AuditDocsInput | undefined, services: AiDocsApplicationServices): Promise<AuditDocsOutput> {
  services.workflow?.emit({
    step: 'ai-docs.audit',
    status: 'running',
    meta: {
      fromRevision: input?.fromRevision,
      toRevision: input?.toRevision
    }
  });

  const report = addDriftEntry(createEmptyDriftReport(), {
    path: 'docs/ai-docs/architecture.md',
    status: 'outdated',
    reason: 'Placeholder drift detection – replace with real comparison',
    confidence: 0.4
  });

  const markdown = [
    '# AI Docs Drift Report',
    '',
    `Score: ${report.score}`,
    '',
    '| Path | Status | Reason |',
    '| --- | --- | --- |',
    report.entries.map((entry: DriftEntry) => `| ${entry.path} | ${entry.status} | ${entry.reason ?? 'n/a'} |`).join('\n')
  ].join('\n');

  const { jsonPath, markdownPath } = await services.docsFs.saveDrift(report, markdown);

  services.logger.log('info', 'AI Docs drift report created', {
    score: report.score,
    entries: report.entries.length,
    fromRevision: input?.fromRevision,
    toRevision: input?.toRevision
  });
  services.workflow?.emit({
    step: 'ai-docs.audit',
    status: 'success',
    meta: {
      score: report.score,
      missing: report.summary.missing,
      outdated: report.summary.outdated,
      driftPath: jsonPath
    }
  });

  return {
    driftPath: jsonPath,
    markdownReportPath: markdownPath,
    driftScore: report.score,
    missing: report.summary.missing,
    outdated: report.summary.outdated
  };
}

