import { generateSummary, SummaryInput } from './generator';
import * as collector from '../commits/collector';
import * as detector from '../files/detector';
import * as engine from '../template/engine';

jest.mock('../commits/collector');
jest.mock('../files/detector');
jest.mock('../template/engine');

const mockCollectCommits = collector.collectCommits as jest.MockedFunction<typeof collector.collectCommits>;
const mockDetectChangedFiles = detector.detectChangedFiles as jest.MockedFunction<typeof detector.detectChangedFiles>;
const mockRenderTemplateFile = engine.renderTemplateFile as jest.MockedFunction<typeof engine.renderTemplateFile>;

const baseInput: SummaryInput = {
  baseSha: 'abc123',
  headSha: 'def456',
  prNumber: 42,
  prTitle: 'feat: add summary generator',
  repoOwner: 'acme',
  repoName: 'pullbrief',
};

beforeEach(() => {
  jest.clearAllMocks();
  mockCollectCommits.mockResolvedValue([
    { sha: 'abc', message: 'feat: add generator', author: 'alice', date: '2024-01-01' },
    { sha: 'def', message: 'fix: handle edge case', author: 'bob', date: '2024-01-02' },
  ]);
  mockDetectChangedFiles.mockResolvedValue([
    { path: 'src/summary/generator.ts', status: 'added', additions: 70, deletions: 0 },
    { path: 'src/summary/generator.test.ts', status: 'added', additions: 50, deletions: 0 },
  ]);
  mockRenderTemplateFile.mockResolvedValue('# PR Summary\n\nGenerated content');
});

describe('generateSummary', () => {
  it('returns rendered template string', async () => {
    const result = await generateSummary(baseInput);
    expect(result).toBe('# PR Summary\n\nGenerated content');
  });

  it('calls collectCommits with correct shas', async () => {
    await generateSummary(baseInput);
    expect(mockCollectCommits).toHaveBeenCalledWith('abc123', 'def456');
  });

  it('calls detectChangedFiles with correct shas', async () => {
    await generateSummary(baseInput);
    expect(mockDetectChangedFiles).toHaveBeenCalledWith('abc123', 'def456');
  });

  it('passes correct context fields to renderTemplateFile', async () => {
    await generateSummary(baseInput);
    const [, context] = mockRenderTemplateFile.mock.calls[0];
    expect(context).toMatchObject({
      prNumber: 42,
      prTitle: 'feat: add summary generator',
      repo: 'acme/pullbrief',
      totalCommits: 2,
      totalFiles: 2,
    });
  });

  it('uses custom templatePath when provided', async () => {
    await generateSummary({ ...baseInput, templatePath: '/custom/template.md' });
    const [templatePath] = mockRenderTemplateFile.mock.calls[0];
    expect(templatePath).toBe('/custom/template.md');
  });
});
