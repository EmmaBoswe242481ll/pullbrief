import { ActionMetrics, createMetrics, mergeMetrics, formatMetricsMarkdown } from '../utils/metrics';
import { log } from '../utils/logger';

export interface ReporterOptions {
  includeInBody: boolean;
  logToConsole: boolean;
}

const defaultOptions: ReporterOptions = {
  includeInBody: false,
  logToConsole: true,
};

export class MetricsReporter {
  private metrics: ActionMetrics;
  private options: ReporterOptions;

  constructor(options: Partial<ReporterOptions> = {}) {
    this.metrics = createMetrics();
    this.options = { ...defaultOptions, ...options };
  }

  record(patch: Partial<ActionMetrics>): void {
    this.metrics = mergeMetrics(this.metrics, patch);
  }

  getMetrics(): ActionMetrics {
    return { ...this.metrics };
  }

  report(): string {
    const markdown = formatMetricsMarkdown(this.metrics);
    if (this.options.logToConsole) {
      log('info', 'MetricsReporter', markdown);
    }
    return markdown;
  }

  appendToBody(body: string): string {
    if (!this.options.includeInBody) {
      return body;
    }
    const markdown = formatMetricsMarkdown(this.metrics);
    const separator = '\n\n---\n\n';
    return `${body}${separator}${markdown}`;
  }

  reset(): void {
    this.metrics = createMetrics();
  }
}

export function createMetricsReporter(options?: Partial<ReporterOptions>): MetricsReporter {
  return new MetricsReporter(options);
}
