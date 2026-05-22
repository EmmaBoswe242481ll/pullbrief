import { fetchAllPages, fetchPage, chunkArray } from "./paginator";

describe("fetchAllPages", () => {
  it("fetches a single page when results fit in one page", async () => {
    const fetcher = jest.fn().mockResolvedValueOnce(["a", "b", "c"]);
    const result = await fetchAllPages(fetcher, { perPage: 100 });
    expect(result).toEqual(["a", "b", "c"]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("fetches multiple pages until results are exhausted", async () => {
    const fetcher = jest
      .fn()
      .mockResolvedValueOnce([1, 2])
      .mockResolvedValueOnce([3, 4])
      .mockResolvedValueOnce([5]);
    const result = await fetchAllPages(fetcher, { perPage: 2 });
    expect(result).toEqual([1, 2, 3, 4, 5]);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("stops at maxPages even if more data exists", async () => {
    const fetcher = jest.fn().mockResolvedValue([1, 2]);
    const result = await fetchAllPages(fetcher, { perPage: 2, maxPages: 3 });
    expect(result).toHaveLength(6);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("returns empty array when first page is empty", async () => {
    const fetcher = jest.fn().mockResolvedValueOnce([]);
    const result = await fetchAllPages(fetcher);
    expect(result).toEqual([]);
  });
});

describe("fetchPage", () => {
  it("returns items and hasMore=true when page is full", async () => {
    const fetcher = jest.fn().mockResolvedValueOnce(["x", "y"]);
    const result = await fetchPage(fetcher, 1, 2);
    expect(result.items).toEqual(["x", "y"]);
    expect(result.hasMore).toBe(true);
    expect(result.totalPages).toBe(1);
  });

  it("returns hasMore=false when page is not full", async () => {
    const fetcher = jest.fn().mockResolvedValueOnce(["x"]);
    const result = await fetchPage(fetcher, 1, 2);
    expect(result.hasMore).toBe(false);
  });
});

describe("chunkArray", () => {
  it("splits array into equal chunks", () => {
    expect(chunkArray([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
  });

  it("handles remainder chunk", () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("returns single chunk when size exceeds array length", () => {
    expect(chunkArray([1, 2], 10)).toEqual([[1, 2]]);
  });

  it("returns empty array for empty input", () => {
    expect(chunkArray([], 5)).toEqual([]);
  });
});
