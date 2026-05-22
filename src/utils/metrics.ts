export interface ActionMetrics {
  totalCommits: number;
  totalFiles: number;
  breakingChanges: number;
  authors: number;
  categoriesFound: string[];
  generationTimeMs: number;
  templateUsed: string;
}

export interface MetricsSummary {
  metrics: ActionMetrics;
  formattedAt: string;
}

const defaults: ActionMetrics = {
  totalCommits: 0,
  totalFiles: 0,
  breakingChanges: 0,
  authors: 0,
  categoriesFound: [],
  generationTimeMs: 0,
  templateUsed: 'default',
};

export function createMetrics(partial: Partial<ActionMetrics> = {}): ActionMetrics {
  return { ...defaults, ...partial };
}

export function mergeMetrics(base: ActionMetrics, patch: Partial<ActionMetrics>): ActionMetrics {
  return {
    ...base,
    ...patch,
    categoriesFound: patch.categoriesFound
      ? Array.from(new Set([...base.categoriesFound, ...patch.categoriesFound]))
      : base.categoriesFound,
  };
}

export function formatMetricsMarkdown(metrics: ActionMetrics): string {
  const lines: string[] = [
    '### 📊 Generation Metrics',
    '',
    `- **Commits processed:** ${metrics.totalCommits}`,
    `- **Files changed:** ${metrics.totalFiles}`,
    `- **Breaking changes:** ${metrics.breakingChanges}`,
    `- **Authors:** ${metrics.authors}`,
    `- **Categories:** ${metrics.categoriesFound.length > 0 ? metrics.categoriesFound.join(', ') : 'none'}`,
    `- **Template:** \`${metrics.templateUsed}\``,
    `- **Generation time:** ${metrics.generationTimeMs}ms`,
  ];
  return lines.join('\n');
}

export function buildMetricsSummary(metrics: ActionMetrics): MetricsSummary {
  return {
    metrics,
    formattedAt: new Date().toISOString(),
  };
}
