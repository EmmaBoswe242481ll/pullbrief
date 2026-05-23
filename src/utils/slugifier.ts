/**
 * Converts arbitrary strings into URL/anchor-safe slugs.
 * Used for generating stable heading anchors in PR summary markdown.
 */

/**
 * Convert a string to a lowercase hyphen-separated slug.
 * Non-alphanumeric characters are replaced with hyphens and
 * consecutive hyphens are collapsed.
 *
 * @example
 * slugify('feat: Add OAuth2 support') // => 'feat-add-oauth2-support'
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique slug by appending a numeric suffix when the base
 * slug already exists in the provided set. Mutates `seen` in place so
 * callers can accumulate state across multiple calls.
 *
 * @example
 * const seen = new Set<string>();
 * uniqueSlug('fixes', seen); // => 'fixes'
 * uniqueSlug('fixes', seen); // => 'fixes-1'
 * uniqueSlug('fixes', seen); // => 'fixes-2'
 */
export function uniqueSlug(base: string, seen: Set<string>): string {
  const slug = slugify(base);
  if (!seen.has(slug)) {
    seen.add(slug);
    return slug;
  }
  let counter = 1;
  while (seen.has(`${slug}-${counter}`)) {
    counter++;
  }
  const unique = `${slug}-${counter}`;
  seen.add(unique);
  return unique;
}

/**
 * Build a GitHub-flavoured Markdown anchor link from a heading string.
 *
 * @example
 * headingAnchor('Breaking Changes') // => '#breaking-changes'
 */
export function headingAnchor(heading: string): string {
  return `#${slugify(heading)}`;
}

/**
 * Slugify every string in an array, ensuring each result is unique
 * within the returned array.
 */
export function slugifyAll(inputs: string[]): string[] {
  const seen = new Set<string>();
  return inputs.map((s) => uniqueSlug(s, seen));
}
