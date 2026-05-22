/**
 * Utility functions for building and formatting Markdown content.
 */

/** Wrap text in a Markdown code span. */
export function inlineCode(text: string): string {
  return `\`${text}\``;
}

/** Create a Markdown heading of the given level (1–6). */
export function heading(text: string, level: 1 | 2 | 3 | 4 | 5 | 6 = 2): string {
  const prefix = '#'.repeat(level);
  return `${prefix} ${text}`;
}

/** Create a Markdown unordered list from an array of items. */
export function bulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

/** Create a Markdown ordered list from an array of items. */
export function orderedList(items: string[]): string {
  return items.map((item, i) => `${i + 1}. ${item}`).join('\n');
}

/** Wrap text in a fenced Markdown code block with an optional language hint. */
export function codeBlock(text: string, language = ''): string {
  return `\`\`\`${language}\n${text}\n\`\`\``;
}

/** Create a Markdown blockquote. */
export function blockquote(text: string): string {
  return text
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n');
}

/** Create a Markdown bold span. */
export function bold(text: string): string {
  return `**${text}**`;
}

/** Create a Markdown italic span. */
export function italic(text: string): string {
  return `_${text}_`;
}

/** Create a Markdown hyperlink. */
export function link(label: string, url: string): string {
  return `[${label}](${url})`;
}

/** Join multiple Markdown sections with a blank line separator. */
export function joinSections(...sections: string[]): string {
  return sections.filter(Boolean).join('\n\n');
}

/** Render a simple two-column Markdown table. */
export function table(headers: [string, string], rows: [string, string][]): string {
  const header = `| ${headers[0]} | ${headers[1]} |`;
  const divider = `| --- | --- |`;
  const body = rows.map(([a, b]) => `| ${a} | ${b} |`).join('\n');
  return [header, divider, body].join('\n');
}
