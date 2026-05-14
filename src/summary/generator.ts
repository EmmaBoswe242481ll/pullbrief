import { groupCommitsByType, parseCommitLine } from '../commits/parser';
import { collectCommits, extractAuthors, extractBreakingChanges } from '../commits/collector';
import { detectChangedFiles, groupFilesByCategory } from '../files/detector';
import { summarizeChangedFiles } from '../files/summarizer';
import { renderTemplateFile } from '../template/engine';
import * as path from 'path';

export interface SummaryInput {
  baseSha: string;
  headSha: string;
  prNumber: number;
  prTitle: string;
  repoOwner: string;
  repoName: string;
  templatePath?: string;
}

export interface SummaryContext {
  prNumber: number;
  prTitle: string;
  repo: string;
  authors: string[];
  commitGroups: Record<string, string[]>;
  breakingChanges: string[];
  fileSummary: string;
  fileCategories: Record<string, string[]>;
  totalCommits: number;
  totalFiles: number;
  generatedAt: string;
}

export async function generateSummary(input: SummaryInput): Promise<string> {
  const commits = await collectCommits(input.baseSha, input.headSha);
  const parsedCommits = commits.map(parseCommitLine);
  const commitGroups = groupCommitsByType(parsedCommits);
  const authors = extractAuthors(commits);
  const breakingChanges = extractBreakingChanges(parsedCommits);

  const changedFiles = await detectChangedFiles(input.baseSha, input.headSha);
  const fileCategories = groupFilesByCategory(changedFiles);
  const fileSummary = formatFileSummaryMarkdown(
    summarizeChangedFiles(changedFiles)
  );

  const context: SummaryContext = {
    prNumber: input.prNumber,
    prTitle: input.prTitle,
    repo: `${input.repoOwner}/${input.repoName}`,
    authors,
    commitGroups,
    breakingChanges,
    fileSummary,
    fileCategories,
    totalCommits: commits.length,
    totalFiles: changedFiles.length,
    generatedAt: new Date().toISOString(),
  };

  const templatePath =
    input.templatePath ??
    path.resolve(__dirname, '../template/default.md');

  return renderTemplateFile(templatePath, context);
}

function formatFileSummaryMarkdown(summary: ReturnType<typeof summarizeChangedFiles>): string {
  const lines: string[] = [];
  if (summary.added.length) lines.push(`**Added:** ${summary.added.join(', ')}`);
  if (summary.modified.length) lines.push(`**Modified:** ${summary.modified.join(', ')}`);
  if (summary.deleted.length) lines.push(`**Deleted:** ${summary.deleted.join(', ')}`);
  return lines.join('\n');
}
