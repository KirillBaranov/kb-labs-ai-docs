import type { DriftEntry, DriftReport } from '@kb-labs/ai-docs-contracts';

export function createEmptyDriftReport(): DriftReport {
  return {
    generatedAt: new Date().toISOString(),
    score: 100,
    entries: [],
    summary: {
      inSync: 0,
      outdated: 0,
      missing: 0
    }
  };
}

export function addDriftEntry(report: DriftReport, entry: DriftEntry): DriftReport {
  const entries = [...report.entries, entry];
  const summary = {
    ...report.summary
  };

  if (entry.status === 'in-sync') {
    summary.inSync += 1;
  }
  if (entry.status === 'outdated') {
    summary.outdated += 1;
  }
  if (entry.status === 'missing') {
    summary.missing += 1;
  }

  const numerator = summary.inSync;
  const denominator = summary.inSync + summary.outdated + summary.missing || 1;

  const score = Math.round((numerator / denominator) * 100);

  return {
    ...report,
    entries,
    summary,
    score,
    generatedAt: new Date().toISOString()
  };
}

