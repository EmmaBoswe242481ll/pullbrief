import { processBatch, splitIntoBatches } from "./batch-processor";

describe("splitIntoBatches", () => {
  it("splits array into equal chunks", () => {
    expect(splitIntoBatches([1, 2, 3, 4, 5, 6], 2)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it("handles a remainder chunk", () => {
    expect(splitIntoBatches([1, 2, 3, 4, 5], 2)).toEqual([
      [1, 2],
      [3, 4],
      [5],
    ]);
  });

  it("returns a single batch when batchSize >= length", () => {
    expect(splitIntoBatches([1, 2, 3], 10)).toEqual([[1, 2, 3]]);
  });

  it("returns empty array for empty input", () => {
    expect(splitIntoBatches([], 5)).toEqual([]);
  });

  it("throws for batchSize <= 0", () => {
    expect(() => splitIntoBatches([1], 0)).toThrow(RangeError);
  });
});

describe("processBatch", () => {
  it("processes all items and returns results", async () => {
    const items = [1, 2, 3, 4, 5];
    const { results, errors, successCount, failureCount } = await processBatch(
      items,
      async (n) => n * 2
    );
    expect(results).toEqual([2, 4, 6, 8, 10]);
    expect(errors).toHaveLength(0);
    expect(successCount).toBe(5);
    expect(failureCount).toBe(0);
  });

  it("collects errors without stopping processing", async () => {
    const items = [1, 2, 3];
    const { errors, failureCount } = await processBatch(
      items,
      async (n) => {
        if (n === 2) throw new Error("bad item");
        return n;
      }
    );
    expect(failureCount).toBe(1);
    expect(errors[0].index).toBe(1);
    expect(errors[0].error).toBeInstanceOf(Error);
  });

  it("calls onBatchComplete for each batch", async () => {
    const onBatchComplete = jest.fn();
    await processBatch([1, 2, 3, 4], async (n) => n, {
      batchSize: 2,
      onBatchComplete,
    });
    expect(onBatchComplete).toHaveBeenCalledTimes(2);
    expect(onBatchComplete).toHaveBeenCalledWith(0, 2);
    expect(onBatchComplete).toHaveBeenCalledWith(1, 2);
  });

  it("returns empty results for empty input", async () => {
    const { results, successCount } = await processBatch([], async (n) => n);
    expect(results).toEqual([]);
    expect(successCount).toBe(0);
  });
});
