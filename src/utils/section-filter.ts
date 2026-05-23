/**
 * Utilities for filtering summary sections based on content and configuration.
 */

export interface SectionFilterOptions {
  excludeEmpty?: boolean;
  includeTypes?: string[];
  excludeTypes?: string[];
  minItemCount?: number;
}

export interface FilterableSection {
  type: string;
  items: string[];
  label?: string;
}

/**
 * Returns true if the section passes all filter criteria.
 */
export function passesFilter(
  section: FilterableSection,
  options: SectionFilterOptions = {}
): boolean {
  const { excludeEmpty = true, includeTypes, excludeTypes, minItemCount = 0 } = options;

  if (excludeEmpty && section.items.length === 0) {
    return false;
  }

  if (section.items.length < minItemCount) {
    return false;
  }

  if (includeTypes && includeTypes.length > 0) {
    if (!includeTypes.includes(section.type)) {
      return false;
    }
  }

  if (excludeTypes && excludeTypes.length > 0) {
    if (excludeTypes.includes(section.type)) {
      return false;
    }
  }

  return true;
}

/**
 * Filters an array of sections according to provided options.
 */
export function filterSections(
  sections: FilterableSection[],
  options: SectionFilterOptions = {}
): FilterableSection[] {
  return sections.filter((section) => passesFilter(section, options));
}

/**
 * Returns only sections that have at least one item.
 */
export function filterEmptySections(
  sections: FilterableSection[]
): FilterableSection[] {
  return filterSections(sections, { excludeEmpty: true });
}

/**
 * Partitions sections into passing and failing groups.
 */
export function partitionSections(
  sections: FilterableSection[],
  options: SectionFilterOptions = {}
): { included: FilterableSection[]; excluded: FilterableSection[] } {
  const included: FilterableSection[] = [];
  const excluded: FilterableSection[] = [];

  for (const section of sections) {
    if (passesFilter(section, options)) {
      included.push(section);
    } else {
      excluded.push(section);
    }
  }

  return { included, excluded };
}
