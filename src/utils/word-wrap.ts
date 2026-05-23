/**
 * Utilities for wrapping and reflowing text to a maximum line width.
 */

export interface WrapOptions {
  /** Maximum number of characters per line (default: 80) */
  width?: number;
  /** String used for line breaks (default: '\n') */
  newline?: string;
  /** Prefix prepended to every wrapped line (default: '') */
  indent?: string;
  /** If true, long words that exceed width are broken (default: false) */
  breakLongWords?: boolean;
}

const DEFAULTS: Required<WrapOptions> = {
  width: 80,
  newline: '\n',
  indent: '',
  breakLongWords: false,
};

/**
 * Wraps a single paragraph of text to the given width.
 * Preserves existing newlines as paragraph breaks.
 */
export function wrapText(text: string, options: WrapOptions = {}): string {
  const opts = { ...DEFAULTS, ...options };
  const { width, newline, indent, breakLongWords } = opts;
  const effectiveWidth = width - indent.length;

  if (effectiveWidth <= 0) {
    throw new RangeError(`wrap width must be greater than indent length (${indent.length})`);
  }

  const paragraphs = text.split(/\r?\n/);
  return paragraphs
    .map((para) => wrapParagraph(para, effectiveWidth, indent, newline, breakLongWords))
    .join(newline);
}

function wrapParagraph(
  para: string,
  width: number,
  indent: string,
  newline: string,
  breakLong: boolean,
): string {
  if (para.trim() === '') return indent;

  const words = para.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const token = breakLong && word.length > width ? word.slice(0, width) : word;
    const remainder = breakLong && word.length > width ? word.slice(width) : '';

    if (current === '') {
      current = token;
    } else if (current.length + 1 + token.length <= width) {
      current += ' ' + token;
    } else {
      lines.push(indent + current);
      current = token;
    }

    if (remainder) {
      lines.push(indent + current);
      current = remainder;
    }
  }

  if (current) lines.push(indent + current);
  return lines.join(newline);
}

/**
 * Wraps text and returns an array of lines (without newline characters).
 */
export function wrapLines(text: string, options: WrapOptions = {}): string[] {
  const newline = '\n';
  return wrapText(text, { ...options, newline }).split(newline);
}
