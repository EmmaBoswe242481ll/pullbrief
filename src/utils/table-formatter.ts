/**
 * Utilities for rendering markdown tables.
 */

export interface TableColumn {
  header: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableOptions {
  columns: TableColumn[];
  rows: string[][];
  fallback?: string;
}

function alignmentMarker(align?: 'left' | 'center' | 'right'): string {
  switch (align) {
    case 'center': return ':---:';
    case 'right': return '---:';
    default: return ':---';
  }
}

export function formatMarkdownTable(options: TableOptions): string {
  const { columns, rows, fallback = '_No data available._' } = options;

  if (rows.length === 0) {
    return fallback;
  }

  const headers = columns.map((c) => c.header);
  const separators = columns.map((c) => alignmentMarker(c.align));

  const headerRow = `| ${headers.join(' | ')} |`;
  const separatorRow = `| ${separators.join(' | ')} |`;

  const dataRows = rows.map((row) => {
    const cells = columns.map((_, i) => (row[i] ?? '').replace(/\|/g, '\\|'));
    return `| ${cells.join(' | ')} |`;
  });

  return [headerRow, separatorRow, ...dataRows].join('\n');
}

export function formatKeyValueTable(data: Record<string, string>): string {
  const rows = Object.entries(data).map(([key, value]) => [key, value]);
  return formatMarkdownTable({
    columns: [
      { header: 'Key', align: 'left' },
      { header: 'Value', align: 'left' },
    ],
    rows,
  });
}

export function formatCountTable(
  items: Array<{ label: string; count: number }>,
  labelHeader = 'Item',
): string {
  const rows = items
    .sort((a, b) => b.count - a.count)
    .map(({ label, count }) => [label, String(count)]);

  return formatMarkdownTable({
    columns: [
      { header: labelHeader, align: 'left' },
      { header: 'Count', align: 'right' },
    ],
    rows,
  });
}
