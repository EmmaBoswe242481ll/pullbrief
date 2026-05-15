/**
 * Sanitization utilities for user-supplied and API-sourced strings.
 */

const MAX_COMMIT_MESSAGE_LENGTH = 2000;
const MAX_TITLE_LENGTH = 256;
const CONTROL_CHAR_PATTERN = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

/**
 * Strips control characters and trims whitespace from a string.
 */
export function sanitizeString(input: string): string {
  return input.replace(CONTROL_CHAR_PATTERN, '').trim();
}

/**
 * Truncates a commit message to a safe length and sanitizes it.
 */
export function sanitizeCommitMessage(message: string): string {
  const cleaned = sanitizeString(message);
  if (cleaned.length > MAX_COMMIT_MESSAGE_LENGTH) {
    return cleaned.slice(0, MAX_COMMIT_MESSAGE_LENGTH) + '…';
  }
  return cleaned;
}

/**
 * Sanitizes and truncates a PR title.
 */
export function sanitizeTitle(title: string): string {
  const cleaned = sanitizeString(title);
  if (cleaned.length > MAX_TITLE_LENGTH) {
    return cleaned.slice(0, MAX_TITLE_LENGTH) + '…';
  }
  return cleaned;
}

/**
 * Escapes characters that have special meaning in Markdown.
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/([\\`*_{}[\]()#+\-.!|])/g, '\\$1');
}

/**
 * Sanitizes an array of strings, filtering out empty results.
 */
export function sanitizeStringArray(items: string[]): string[] {
  return items.map(sanitizeString).filter(s => s.length > 0);
}

/**
 * Normalizes newlines to Unix-style and collapses excessive blank lines.
 */
export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
