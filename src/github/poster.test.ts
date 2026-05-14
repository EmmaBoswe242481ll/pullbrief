import { postOrUpdatePRComment } from './poster';
import * as github from '@actions/github';
import * as core from '@actions/core';

jest.mock('@actions/github');
jest.mock('@actions/core');

const mockCreateComment = jest.fn().mockResolvedValue({ data: { id: 101 } });
const mockUpdateComment = jest.fn().mockResolvedValue({ data: { id: 202 } });
const mockListComments = jest.fn();

const mockOctokit = {
  rest: {
    issues: {
      createComment: mockCreateComment,
      updateComment: mockUpdateComment,
      listComments: mockListComments,
    },
  },
};

(github.getOctokit as jest.Mock).mockReturnValue(mockOctokit);
(core.info as jest.Mock).mockImplementation(() => {});

const baseOptions = {
  token: 'fake-token',
  owner: 'acme',
  repo: 'pullbrief',
  pullNumber: 42,
  body: '## PR Summary\nSome content',
};

describe('postOrUpdatePRComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (github.getOctokit as jest.Mock).mockReturnValue(mockOctokit);
    (core.info as jest.Mock).mockImplementation(() => {});
  });

  it('creates a new comment when none exists', async () => {
    mockListComments.mockResolvedValue({ data: [] });

    const id = await postOrUpdatePRComment(baseOptions);

    expect(mockCreateComment).toHaveBeenCalledTimes(1);
    expect(mockCreateComment).toHaveBeenCalledWith(
      expect.objectContaining({
        issue_number: 42,
        body: expect.stringContaining('<!-- pullbrief-summary -->'),
      })
    );
    expect(id).toBe(101);
  });

  it('updates an existing comment when marker is found', async () => {
    mockListComments.mockResolvedValue({
      data: [{ id: 55, body: '<!-- pullbrief-summary -->\nOld content' }],
    });

    const id = await postOrUpdatePRComment(baseOptions);

    expect(mockUpdateComment).toHaveBeenCalledTimes(1);
    expect(mockUpdateComment).toHaveBeenCalledWith(
      expect.objectContaining({ comment_id: 55 })
    );
    expect(id).toBe(202);
  });

  it('uses provided commentId and skips listing comments', async () => {
    const id = await postOrUpdatePRComment({ ...baseOptions, commentId: 99 });

    expect(mockListComments).not.toHaveBeenCalled();
    expect(mockUpdateComment).toHaveBeenCalledWith(
      expect.objectContaining({ comment_id: 99 })
    );
    expect(id).toBe(202);
  });
});
