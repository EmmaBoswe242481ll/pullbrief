import {
  getCommitTypeLabel,
  getFileCategoryLabel,
  formatLabelWithEmoji,
  getAllCommitTypeKeys,
} from './label-mapper';

describe('getCommitTypeLabel', () => {
  it('returns correct label for known type', () => {
    const result = getCommitTypeLabel('feat');
    expect(result.label).toBe('Features');
    expect(result.emoji).toBe('✨');
  });

  it('is case-insensitive', () => {
    const result = getCommitTypeLabel('FIX');
    expect(result.label).toBe('Bug Fixes');
  });

  it('returns fallback for unknown type', () => {
    const result = getCommitTypeLabel('custom');
    expect(result.label).toBe('Custom');
    expect(result.emoji).toBe('🔹');
    expect(result.description).toContain('custom');
  });

  it('returns breaking changes label', () => {
    const result = getCommitTypeLabel('breaking');
    expect(result.emoji).toBe('💥');
  });
});

describe('getFileCategoryLabel', () => {
  it('returns correct label for source category', () => {
    const result = getFileCategoryLabel('source');
    expect(result.label).toBe('Source Files');
    expect(result.emoji).toBe('📝');
  });

  it('returns fallback for unknown category', () => {
    const result = getFileCategoryLabel('unknown');
    expect(result.label).toBe('unknown');
    expect(result.emoji).toBe('📦');
  });

  it('handles config category', () => {
    const result = getFileCategoryLabel('config');
    expect(result.label).toBe('Configuration');
  });
});

describe('formatLabelWithEmoji', () => {
  it('combines emoji and label', () => {
    const config = { emoji: '🚀', label: 'Launch', description: 'test' };
    expect(formatLabelWithEmoji(config)).toBe('🚀 Launch');
  });
});

describe('getAllCommitTypeKeys', () => {
  it('returns all known commit types', () => {
    const keys = getAllCommitTypeKeys();
    expect(keys).toContain('feat');
    expect(keys).toContain('fix');
    expect(keys).toContain('chore');
    expect(keys.length).toBeGreaterThan(5);
  });
});
