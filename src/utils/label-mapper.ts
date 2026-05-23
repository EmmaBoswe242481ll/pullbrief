/**
 * Maps commit types and file categories to human-readable labels and emoji.
 */

export interface LabelConfig {
  emoji: string;
  label: string;
  description: string;
}

const COMMIT_TYPE_LABELS: Record<string, LabelConfig> = {
  feat: { emoji: '✨', label: 'Features', description: 'New features and enhancements' },
  fix: { emoji: '🐛', label: 'Bug Fixes', description: 'Bug fixes and patches' },
  docs: { emoji: '📚', label: 'Documentation', description: 'Documentation changes' },
  style: { emoji: '💅', label: 'Style', description: 'Code style and formatting' },
  refactor: { emoji: '♻️', label: 'Refactoring', description: 'Code refactoring' },
  perf: { emoji: '⚡', label: 'Performance', description: 'Performance improvements' },
  test: { emoji: '🧪', label: 'Tests', description: 'Test additions and updates' },
  build: { emoji: '🏗️', label: 'Build', description: 'Build system changes' },
  ci: { emoji: '🤖', label: 'CI/CD', description: 'Continuous integration changes' },
  chore: { emoji: '🔧', label: 'Chores', description: 'Maintenance and chores' },
  revert: { emoji: '⏪', label: 'Reverts', description: 'Reverted changes' },
  breaking: { emoji: '💥', label: 'Breaking Changes', description: 'Breaking API changes' },
};

const FILE_CATEGORY_LABELS: Record<string, LabelConfig> = {
  source: { emoji: '📝', label: 'Source Files', description: 'Application source code' },
  test: { emoji: '🧪', label: 'Test Files', description: 'Test and spec files' },
  config: { emoji: '⚙️', label: 'Configuration', description: 'Config and settings files' },
  docs: { emoji: '📖', label: 'Docs', description: 'Documentation files' },
  assets: { emoji: '🖼️', label: 'Assets', description: 'Static assets and media' },
  other: { emoji: '📦', label: 'Other', description: 'Miscellaneous files' },
};

export function getCommitTypeLabel(type: string): LabelConfig {
  return COMMIT_TYPE_LABELS[type.toLowerCase()] ?? {
    emoji: '🔹',
    label: type.charAt(0).toUpperCase() + type.slice(1),
    description: `${type} changes`,
  };
}

export function getFileCategoryLabel(category: string): LabelConfig {
  return FILE_CATEGORY_LABELS[category.toLowerCase()] ?? {
    emoji: '📦',
    label: category,
    description: `${category} files`,
  };
}

export function formatLabelWithEmoji(config: LabelConfig): string {
  return `${config.emoji} ${config.label}`;
}

export function getAllCommitTypeKeys(): string[] {
  return Object.keys(COMMIT_TYPE_LABELS);
}
