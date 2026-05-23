/**
 * Utility functions for pluralizing words in generated summaries.
 */

/** A map of common irregular plurals used in PR summaries. */
const IRREGULAR: Record<string, string> = {
  commit: "commits",
  file: "files",
  author: "authors",
  change: "changes",
  fix: "fixes",
  dependency: "dependencies",
  entry: "entries",
  category: "categories",
  repository: "repositories",
  library: "libraries",
};

/**
 * Returns the plural form of a word based on the given count.
 *
 * @param word - The singular form of the word.
 * @param count - The count to determine singular vs plural.
 * @param customPlural - Optional explicit plural form.
 * @returns The correctly pluralized word.
 */
export function pluralize(word: string, count: number, customPlural?: string): string {
  if (count === 1) return word;
  if (customPlural) return customPlural;
  const lower = word.toLowerCase();
  if (IRREGULAR[lower]) {
    // Preserve original casing for first letter
    const plural = IRREGULAR[lower];
    return word[0] === word[0].toUpperCase()
      ? plural.charAt(0).toUpperCase() + plural.slice(1)
      : plural;
  }
  return defaultPluralize(word);
}

/**
 * Applies simple English pluralization rules.
 */
function defaultPluralize(word: string): string {
  if (/(?:s|x|z|ch|sh)$/i.test(word)) return word + "es";
  if (/[^aeiou]y$/i.test(word)) return word.slice(0, -1) + "ies";
  return word + "s";
}

/**
 * Formats a count with its correctly pluralized label.
 *
 * @example
 * countLabel(3, "commit") // => "3 commits"
 * countLabel(1, "file")   // => "1 file"
 */
export function countLabel(count: number, word: string, customPlural?: string): string {
  return `${count} ${pluralize(word, count, customPlural)}`;
}

/**
 * Returns "is" or "are" based on count.
 */
export function isAre(count: number): string {
  return count === 1 ? "is" : "are";
}

/**
 * Returns "was" or "were" based on count.
 */
export function wasWere(count: number): string {
  return count === 1 ? "was" : "were";
}
