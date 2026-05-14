import { ChangedFile, groupFilesByCategory } from "./detector";

export interface FileSummary {
  totalChanged: number;
  added: number;
  modified: number;
  deleted: number;
  renamed: number;
  byCategory: Record<string, number>;
  highlights: string[];
}

export function summarizeChangedFiles(files: ChangedFile[]): FileSummary {
  const counts = { added: 0, modified: 0, deleted: 0, renamed: 0 };

  for (const file of files) {
    counts[file.status] = (counts[file.status] ?? 0) + 1;
  }

  const grouped = groupFilesByCategory(files);
  const byCategory: Record<string, number> = {};
  for (const [category, categoryFiles] of Object.entries(grouped)) {
    byCategory[category] = categoryFiles.length;
  }

  return {
    totalChanged: files.length,
    ...counts,
    byCategory,
    highlights: buildHighlights(files, grouped),
  };
}

function buildHighlights(
  files: ChangedFile[],
  grouped: Record<string, ChangedFile[]>
): string[] {
  const highlights: string[] = [];

  if ((grouped["source"] ?? []).length > 0) {
    highlights.push(
      `${grouped["source"].length} source file(s) changed in \`src/\``
    );
  }

  if ((grouped["tests"] ?? []).length > 0) {
    highlights.push(`${grouped["tests"].length} test file(s) updated`);
  }

  if ((grouped["ci"] ?? []).length > 0) {
    highlights.push("CI/GitHub Actions configuration updated");
  }

  if ((grouped["docs"] ?? []).length > 0) {
    highlights.push("Documentation updated");
  }

  const deletedFiles = files.filter((f) => f.status === "deleted");
  if (deletedFiles.length > 0) {
    highlights.push(`${deletedFiles.length} file(s) removed`);
  }

  return highlights;
}

export function formatFileSummaryMarkdown(summary: FileSummary): string {
  const lines: string[] = [
    `**${summary.totalChanged}** file(s) changed`,
    `(+${summary.added} added, ~${summary.modified} modified, -${summary.deleted} deleted)`,
    "",
  ];

  if (summary.highlights.length > 0) {
    for (const h of summary.highlights) {
      lines.push(`- ${h}`);
    }
  }

  return lines.join("\n");
}
