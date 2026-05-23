/**
 * Enriches a generated PR summary by replacing plain references with
 * markdown links using the link-builder utilities.
 */

import {
  buildCommitLink,
  buildUserLink,
  linkifyIssueReferences,
} from '../utils/link-builder';

export interface EnrichOptions {
  repoUrl: string;
  commitShas?: string[];
  authors?: string[];
}

export function enrichSummaryWithLinks(summary: string, options: EnrichOptions): string {
  let enriched = summary;

  enriched = linkifyIssueReferences(enriched, options.repoUrl);

  if (options.commitShas) {
    for (const sha of options.commitShas) {
      const short = sha.slice(0, 7);
      const shortPattern = new RegExp(`\\b${short}\\b`, 'g');
      const fullPattern = new RegExp(`\\b${sha}\\b`, 'g');
      const link = buildCommitLink(options.repoUrl, sha);
      enriched = enriched.replace(fullPattern, link);
      enriched = enriched.replace(shortPattern, link);
    }
  }

  if (options.authors) {
    for (const author of options.authors) {
      const pattern = new RegExp(`(?<!\\[)@${author}(?!\\])`, 'g');
      enriched = enriched.replace(pattern, buildUserLink(author));
    }
  }

  return enriched;
}

export function stripLinkEnrichment(summary: string): string {
  // Convert markdown links back to plain text labels
  return summary.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}
