import * as fs from 'fs';
import * as path from 'path';

export interface TemplateContext {
  prTitle: string;
  prNumber: number;
  author: string;
  commits: CommitEntry[];
  changedFiles: string[];
  date: string;
}

export interface CommitEntry {
  hash: string;
  message: string;
  type?: string;
}

/**
 * Renders a Mustache-style template string with the given context.
 * Supports {{variable}} interpolation and {{#list}}...{{/list}} blocks.
 */
export function renderTemplate(template: string, context: TemplateContext): string {
  let output = template;

  // Replace simple variables
  output = output.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = (context as Record<string, unknown>)[key];
    if (value === undefined || value === null) return '';
    if (Array.isArray(value)) return value.length.toString();
    return String(value);
  });

  // Replace {{#commits}}...{{/commits}} blocks
  output = output.replace(
    /\{\{#commits\}\}([\s\S]*?)\{\{\/commits\}\}/g,
    (_, block: string) => {
      return context.commits
        .map((commit) =>
          block
            .replace(/\{\{hash\}\}/g, commit.hash)
            .replace(/\{\{message\}\}/g, commit.message)
            .replace(/\{\{type\}\}/g, commit.type ?? 'chore')
        )
        .join('');
    }
  );

  // Replace {{#changedFiles}}...{{/changedFiles}} blocks
  output = output.replace(
    /\{\{#changedFiles\}\}([\s\S]*?)\{\{\/changedFiles\}\}/g,
    (_, block: string) => {
      return context.changedFiles
        .map((file) => block.replace(/\{\{file\}\}/g, file))
        .join('');
    }
  );

  return output;
}

/**
 * Loads a template file from disk and renders it with the given context.
 */
export function renderTemplateFile(templatePath: string, context: TemplateContext): string {
  const absolutePath = path.resolve(templatePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Template file not found: ${absolutePath}`);
  }
  const template = fs.readFileSync(absolutePath, 'utf-8');
  return renderTemplate(template, context);
}
