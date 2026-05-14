import { getPullRequestContext, getInputs } from './context';

const mockCore = {
  getInput: jest.fn(),
  getBooleanInput: jest.fn(),
};

const mockGithub = {
  context: {
    eventName: 'pull_request',
    repo: { owner: 'acme', repo: 'my-repo' },
    payload: {
      pull_request: {
        number: 42,
        title: 'feat: add new feature',
        body: 'Some description',
        user: { login: 'dev-user' },
        base: { sha: 'abc123', ref: 'main' },
        head: { sha: 'def456', ref: 'feature/new' },
      },
    },
  },
};

jest.mock('@actions/core', () => mockCore);
jest.mock('@actions/github', () => mockGithub);

describe('getPullRequestContext', () => {
  it('returns correct context from github payload', () => {
    const ctx = getPullRequestContext();
    expect(ctx.owner).toBe('acme');
    expect(ctx.repo).toBe('my-repo');
    expect(ctx.pullNumber).toBe(42);
    expect(ctx.baseSha).toBe('abc123');
    expect(ctx.headSha).toBe('def456');
    expect(ctx.author).toBe('dev-user');
    expect(ctx.baseRef).toBe('main');
    expect(ctx.headRef).toBe('feature/new');
  });

  it('throws if event is not pull_request', () => {
    mockGithub.context.eventName = 'push';
    expect(() => getPullRequestContext()).toThrow('Expected pull_request event');
    mockGithub.context.eventName = 'pull_request';
  });

  it('throws if pull_request payload is missing', () => {
    const originalPayload = mockGithub.context.payload.pull_request;
    // @ts-expect-error intentionally removing pull_request for test
    mockGithub.context.payload.pull_request = undefined;
    expect(() => getPullRequestContext()).toThrow();
    mockGithub.context.payload.pull_request = originalPayload;
  });
});

describe('getInputs', () => {
  beforeEach(() => {
    // Reset mocks before each test to avoid state leaking between cases
    mockCore.getInput.mockReset();
    mockCore.getBooleanInput.mockReset();
  });

  it('returns parsed inputs', () => {
    mockCore.getInput.mockImplementation((name: string) => {
      if (name === 'github-token') return 'ghp_token';
      if (name === 'template-path') return '';
      if (name === 'output-file') return 'summary.md';
      return '';
    });
    mockCore.getBooleanInput.mockReturnValue(true);

    const inputs = getInputs();
    expect(inputs.githubToken).toBe('ghp_token');
    expect(inputs.updateBody).toBe(true);
    expect(inputs.outputFile).toBe('summary.md');
    expect(inputs.templatePath).toBeUndefined();
  });

  it('returns templatePath when template-path input is provided', () => {
    mockCore.getInput.mockImplementation((name: string) => {
      if (name === 'github-token') return 'ghp_token';
      if (name === 'template-path') return '.github/summary.hbs';
      if (name === 'output-file') return '';
      return '';
    });
    mockCore.getBooleanInput.mockReturnValue(false);

    const inputs = getInputs();
    expect(inputs.templatePath).toBe('.github/summary.hbs');
  });

  it('returns undefined outputFile when output-file input is empty', () => {
    mockCore.getInput.mockImplementation((name: string) => {
      if (name === 'github-token') return 'ghp_token';
      return '';
    });
    mockCore.getBooleanInput.mockReturnValue(false);

    const inputs = getInputs();
    expect(inputs.outputFile).toBeUndefined();
  });
});
