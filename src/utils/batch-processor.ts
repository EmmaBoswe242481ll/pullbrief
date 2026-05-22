/**
 * Batch processor utility for handling arrays of items in configurable chunks
 * with optional concurrency control and error handling.
 */

export interface BatchProcessorOptions {
  batchSize?: number;
  concurrency?: number;
  onBatchComplete?: (batchIndex: number, total: number) => void;
}

export interface BatchResult<T> {
  results: T[];
  errors: Array<{ index: number; error: unknown }>;
  successCount: number;
  failureCount: number;
}

/**
 * Process an array of items in batches, collecting results and errors.
 */
export async function processBatch<TInput, TOutput>(
  items: TInput[],
  handler: (item: TInput, index: number) => Promise<TOutput>,
  options: BatchProcessorOptions = {}
): Promise<BatchResult<TOutput>> {
  const { batchSize = 10, concurrency = 1, onBatchComplete } = options;

  const results: TOutput[] = [];
  const errors: Array<{ index: number; error: unknown }> = [];

  const batches = splitIntoBatches(items, batchSize);

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex += concurrency) {
    const concurrentBatches = batches.slice(batchIndex, batchIndex + concurrency);

    await Promise.all(
      concurrentBatches.map(async (batch, concurrentOffset) => {
        const globalBatchIndex = batchIndex + concurrentOffset;
        const baseIndex = globalBatchIndex * batchSize;

        for (let i = 0; i < batch.length; i++) {
          const itemIndex = baseIndex + i;
          try {
            const result = await handler(batch[i], itemIndex);
            results[itemIndex] = result;
          } catch (error) {
            errors.push({ index: itemIndex, error });
          }
        }

        onBatchComplete?.(globalBatchIndex, batches.length);
      })
    );
  }

  const successResults = results.filter((_, i) =>
    !errors.some((e) => e.index === i)
  );

  return {
    results: successResults,
    errors,
    successCount: successResults.length,
    failureCount: errors.length,
  };
}

/**
 * Split an array into fixed-size chunks.
 */
export function splitIntoBatches<T>(items: T[], batchSize: number): T[][] {
  if (batchSize <= 0) throw new RangeError("batchSize must be greater than 0");
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}
