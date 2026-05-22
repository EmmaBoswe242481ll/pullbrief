/**
 * Utility for paginating through GitHub API responses.
 */

export interface PaginationOptions {
  maxPages?: number;
  perPage?: number;
}

export interface PageResult<T> {
  items: T[];
  totalPages: number;
  hasMore: boolean;
}

export type PageFetcher<T> = (page: number, perPage: number) => Promise<T[]>;

/**
 * Fetches all pages from a paginated API endpoint.
 */
export async function fetchAllPages<T>(
  fetcher: PageFetcher<T>,
  options: PaginationOptions = {}
): Promise<T[]> {
  const { maxPages = 10, perPage = 100 } = options;
  const results: T[] = [];
  let page = 1;

  while (page <= maxPages) {
    const items = await fetcher(page, perPage);
    results.push(...items);

    if (items.length < perPage) {
      break;
    }

    page++;
  }

  return results;
}

/**
 * Fetches a single page and returns metadata about pagination state.
 */
export async function fetchPage<T>(
  fetcher: PageFetcher<T>,
  page: number,
  perPage: number = 100
): Promise<PageResult<T>> {
  const items = await fetcher(page, perPage);
  const hasMore = items.length === perPage;

  return {
    items,
    totalPages: page,
    hasMore,
  };
}

/**
 * Chunks an array into pages of a given size.
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
