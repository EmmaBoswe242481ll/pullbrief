/**
 * Lightweight markdown formatting helpers.
 */

import { wrapText } from './word-wrap';

export function inlineCode(text: string): string {
  return `\`${text}\``;
}

export function heading(level: 1 | 2 | 3 | 4 | 5 | 6, text: string): string {
  return `${'#'.repeat(level)} ${text}`;
}

export function bulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

export function orderedList(items: string[]): string {
  return items.map((item, i) => `${i + 1}. ${item}`).join('\n');
}

export function codeBlock(code: string, lang = ''): string {
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

export function bold(text: string): string {
  return `**${text}**`;
}

export function italic(text: string): string {
  return `_${text}_`;
}

export function link(label: string, url: string): string {
  return `[${label}](${url})`;
}

export function blockquote(text: string): string {
  return text
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n');
}

export function horizontalRule(): string {
  return '---';
}

/**
 * Wraps a prose paragraph to 80 characters for readable markdown source.
 */
export function wrapProse(text: string, width = 80): string {
  return wrapText(text, { width });
}

/**
 * Formats a two-column markdown table.
 * @param headers - Tuple of [leftHeader, rightHeader]
 * @param rows    - Array of [leftCell, rightCell] tuples
 */
export function table(
  headers: [string, string],
  rows: [string, string][],
): string {
  const [h1, h2] = headers;
  const divider = `| --- | --- |`;
  const headerRow = `| ${h1} | ${h2} |`;
  const bodyRows = rows.map(([a, b]) => `| ${a} | ${b} |`);
  return [headerRow, divider, ...bodyRows].join('\n');
}
