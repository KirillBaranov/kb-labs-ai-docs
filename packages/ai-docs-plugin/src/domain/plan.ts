import type { DocSection, DocsPlan, DocsPlanGap } from '@kb-labs/ai-docs-contracts';

export interface DocsPlanEntity extends DocsPlan {}

export interface SectionTraversalOptions {
  includeChildren?: boolean;
}

export function collectSections(plan: DocsPlanEntity, options: SectionTraversalOptions = {}): DocSection[] {
  const includeChildren = options.includeChildren ?? true;
  const accumulator: DocSection[] = [];

  const walk = (section: DocSection) => {
    accumulator.push(section);
    if (!includeChildren || !section.children) return;
    section.children.forEach((child) => walk(child));
  };

  plan.sections.forEach((section) => walk(section));
  return accumulator;
}

export function countMissingSections(plan: DocsPlanEntity): number {
  return collectSections(plan).filter((section) => section.status === 'missing').length;
}

export function planSummary(plan: DocsPlanEntity): { sections: number; missing: number; gaps: DocsPlanGap[] } {
  return {
    sections: collectSections(plan).length,
    missing: countMissingSections(plan),
    gaps: plan.gaps ?? []
  };
}

