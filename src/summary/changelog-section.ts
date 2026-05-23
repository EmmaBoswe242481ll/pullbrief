import { ChangelogSection } from '../utils/changelog';
import { slugify } from '../utils/slugifier';
import { truncateString } from '../utils/truncator';
import { escapeMarkdown } from '../utils/sanitizer';

export interface RenderedSection {
  anchor: string;
  heading: string;
  body: string;
}

export function renderChangelogSection(section: ChangelogSection): RenderedSection {
  const anchor = slugify(section.label);
  const heading = section.label;
  const body = section.entries
    .map((entry) => `- ${escapeMarkdown(truncateString(entry, 120))}`) 
    .join('\n');

  return { anchor, heading, body };
}

export function renderChangelogTableOfContents(sections: ChangelogSection[]): string {
  if (sections.length === 0) return '';

  const lines = sections.map((s) => {
    const anchor = slugify(s.label);
    return `- [${s.label}](#${anchor}) (${s.entries.length})`;
  });

  return `**Contents**\n${lines.join('\n')}`;
}

export function assembleFullChangelog(
  sections: ChangelogSection[],
  prTitle?: string
): string {
  if (sections.length === 0) return '';

  const parts: string[] = [];

  if (prTitle) {
    parts.push(`## ${escapeMarkdown(prTitle)}\n`);
  }

  const toc = renderChangelogTableOfContents(sections);
  if (toc) {
    parts.push(toc + '\n');
  }

  for (const section of sections) {
    const rendered = renderChangelogSection(section);
    parts.push(`### ${rendered.heading}\n${rendered.body}`);
  }

  return parts.join('\n\n');
}
