import { formatMarkdownTable, formatKeyValueTable, formatCountTable } from './table-formatter';

describe('formatMarkdownTable', () => {
  it('renders a basic table with headers and rows', () => {
    const result = formatMarkdownTable({
      columns: [
        { header: 'Name' },
        { header: 'Type', align: 'center' },
        { header: 'Count', align: 'right' },
      ],
      rows: [
        ['feat', 'feature', '3'],
        ['fix', 'bugfix', '1'],
      ],
    });

    expect(result).toContain('| Name | Type | Count |');
    expect(result).toContain('| :--- | :---: | ---: |');
    expect(result).toContain('| feat | feature | 3 |');
    expect(result).toContain('| fix | bugfix | 1 |');
  });

  it('returns fallback string when rows are empty', () => {
    const result = formatMarkdownTable({
      columns: [{ header: 'Name' }],
      rows: [],
    });
    expect(result).toBe('_No data available._');
  });

  it('uses custom fallback when provided', () => {
    const result = formatMarkdownTable({
      columns: [{ header: 'Name' }],
      rows: [],
      fallback: '_Nothing here._',
    });
    expect(result).toBe('_Nothing here._');
  });

  it('escapes pipe characters in cell values', () => {
    const result = formatMarkdownTable({
      columns: [{ header: 'Value' }],
      rows: [['a | b']],
    });
    expect(result).toContain('a \\| b');
  });

  it('fills missing cells with empty string', () => {
    const result = formatMarkdownTable({
      columns: [{ header: 'A' }, { header: 'B' }],
      rows: [['only-one']],
    });
    expect(result).toContain('| only-one |  |');
  });
});

describe('formatKeyValueTable', () => {
  it('renders key-value pairs as a two-column table', () => {
    const result = formatKeyValueTable({ repo: 'pullbrief', status: 'active' });
    expect(result).toContain('| Key | Value |');
    expect(result).toContain('| repo | pullbrief |');
    expect(result).toContain('| status | active |');
  });
});

describe('formatCountTable', () => {
  it('sorts rows by count descending', () => {
    const result = formatCountTable([
      { label: 'fix', count: 2 },
      { label: 'feat', count: 5 },
    ]);
    const lines = result.split('\n');
    const featIndex = lines.findIndex((l) => l.includes('feat'));
    const fixIndex = lines.findIndex((l) => l.includes('fix'));
    expect(featIndex).toBeLessThan(fixIndex);
  });

  it('uses custom label header', () => {
    const result = formatCountTable([{ label: 'feat', count: 1 }], 'Type');
    expect(result).toContain('| Type | Count |');
  });
});
