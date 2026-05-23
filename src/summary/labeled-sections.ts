/**
 * Builds labeled, emoji-annotated sections for the PR summary output.
 */

import { getCommitTypeLabel, getFileCategoryLabel, formatLabelWithEmoji } from '../utils/label-mapper';
import { bulletList, heading } from '../utils/markdown';

export interface LabeledSection {
  heading: string;
  items: string[];
  emoji: string;
}

export function buildLabeledCommitSections(
  grouped: Record<string, string[]>
): LabeledSection[] {
  return Object.entries(grouped)
    .filter(([, items]) => items.length > 0)
    .map(([type, items]) => {
      const config = getCommitTypeLabel(type);
      return {
        heading: formatLabelWithEmoji(config),
        items,
        emoji: config.emoji,
      };
    });
}

export function buildLabeledFileSections(
  grouped: Record<string, string[]>
): LabeledSection[] {
  return Object.entries(grouped)
    .filter(([, files]) => files.length > 0)
    .map(([category, files]) => {
      const config = getFileCategoryLabel(category);
      return {
        heading: formatLabelWithEmoji(config),
        items: files,
        emoji: config.emoji,
      };
    });
}

export function renderLabeledSection(
  section: LabeledSection,
  headingLevel: 2 | 3 | 4 = 3
): string {
  const lines: string[] = [
    heading(headingLevel, section.heading),
    bulletList(section.items),
  ];
  return lines.join('\n');
}

export function renderAllLabeledSections(
  sections: LabeledSection[],
  headingLevel: 2 | 3 | 4 = 3
): string {
  if (sections.length === 0) return '';
  return sections
    .map((s) => renderLabeledSection(s, headingLevel))
    .join('\n\n');
}
