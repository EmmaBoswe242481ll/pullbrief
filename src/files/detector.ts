import { execSync } from "child_process";

export interface ChangedFile {
  path: string;
  status: "added" | "modified" | "deleted" | "renamed";
  category: string;
}

const STATUS_MAP: Record<string, ChangedFile["status"]> = {
  A: "added",
  M: "modified",
  D: "deleted",
  R: "renamed",
};

export function detectChangedFiles(base: string, head: string): ChangedFile[] {
  const output = execSync(
    `git diff --name-status ${base}...${head}`,
    { encoding: "utf-8" }
  ).trim();

  if (!output) return [];

  return output
    .split("\n")
    .map((line) => parseFileLine(line))
    .filter((f): f is ChangedFile => f !== null);
}

export function parseFileLine(line: string): ChangedFile | null {
  const parts = line.trim().split(/\t+/);
  if (parts.length < 2) return null;

  const rawStatus = parts[0].charAt(0).toUpperCase();
  const filePath = parts[parts.length - 1];
  const status = STATUS_MAP[rawStatus] ?? "modified";

  return {
    path: filePath,
    status,
    category: categorizeFile(filePath),
  };
}

export function categorizeFile(filePath: string): string {
  if (filePath.endsWith(".test.ts") || filePath.endsWith(".spec.ts")) {
    return "tests";
  }
  if (filePath.startsWith("src/")) return "source";
  if (filePath.startsWith(".github/")) return "ci";
  if (
    filePath.endsWith(".md") ||
    filePath.endsWith(".txt") ||
    filePath.endsWith(".rst")
  ) {
    return "docs";
  }
  if (
    filePath.endsWith(".json") ||
    filePath.endsWith(".yaml") ||
    filePath.endsWith(".yml") ||
    filePath.endsWith(".toml")
  ) {
    return "config";
  }
  return "other";
}

export function groupFilesByCategory(
  files: ChangedFile[]
): Record<string, ChangedFile[]> {
  return files.reduce<Record<string, ChangedFile[]>>((acc, file) => {
    if (!acc[file.category]) acc[file.category] = [];
    acc[file.category].push(file);
    return acc;
  }, {});
}
