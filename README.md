# pullbrief

> A GitHub Action that auto-generates structured PR summaries from commit messages and changed file paths using a local template engine.

---

## Installation

```bash
npm install
npm run build
```

---

## Usage

Add the following step to your GitHub Actions workflow:

```yaml
name: PR Summary

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  summarize:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Generate PR Summary
        uses: your-org/pullbrief@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          template: '.github/templates/pr-summary.md'
```

### Template Example

Create a template file at `.github/templates/pr-summary.md`:

```
## Summary

**Changed Files:** {{changed_files}}

**Commits:**
{{commit_messages}}
```

`pullbrief` will populate the placeholders and post the result as a PR description or comment.

---

## Configuration

| Input | Description | Required | Default |
|---|---|---|---|
| `github-token` | GitHub token for API access | Yes | — |
| `template` | Path to summary template file | No | `.github/pullbrief.md` |

---

## License

[MIT](./LICENSE)