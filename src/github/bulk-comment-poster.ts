/**
 * Posts PR comments in bulk using the batch processor to respect rate limits.
 */

import { processBatch, BatchResult } from "../utils/batch-processor";
import { log } from "../utils/logger";

export interface CommentPayload {
  owner: string;
  repo: string;
  issueNumber: number;
  body: string;
}

export interface GitHubCommentClient {
  createComment(payload: CommentPayload): Promise<{ id: number; url: string }>;
}

export interface BulkPostOptions {
  batchSize?: number;
  concurrency?: number;
}

export interface PostedComment {
  id: number;
  url: string;
  issueNumber: number;
}

/**
 * Post multiple PR comments in batches, logging progress per batch.
 */
export async function bulkPostComments(
  client: GitHubCommentClient,
  payloads: CommentPayload[],
  options: BulkPostOptions = {}
): Promise<BatchResult<PostedComment>> {
  const { batchSize = 5, concurrency = 1 } = options;

  log("info", `Posting ${payloads.length} comment(s) in batches of ${batchSize}`);

  return processBatch<CommentPayload, PostedComment>(
    payloads,
    async (payload) => {
      const response = await client.createComment(payload);
      log("debug", `Posted comment ${response.id} on PR #${payload.issueNumber}`);
      return {
        id: response.id,
        url: response.url,
        issueNumber: payload.issueNumber,
      };
    },
    {
      batchSize,
      concurrency,
      onBatchComplete: (batchIndex, total) => {
        log("debug", `Completed batch ${batchIndex + 1}/${total}`);
      },
    }
  );
}

/**
 * Format a summary of bulk post results for logging or debugging.
 */
export function formatBulkPostSummary(result: BatchResult<PostedComment>): string {
  const lines = [
    `Posted: ${result.successCount}`,
    `Failed: ${result.failureCount}`,
  ];
  if (result.errors.length > 0) {
    const errorDetails = result.errors
      .map((e) => `  - index ${e.index}: ${String(e.error)}`)
      .join("\n");
    lines.push(`Errors:\n${errorDetails}`);
  }
  return lines.join("\n");
}
