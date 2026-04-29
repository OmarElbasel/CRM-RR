# Contributing to Rawaj

Thank you for your interest in contributing! This document will get you started.

## Development Setup

See [README.md](README.md) for the full local setup guide (clone, install, env, run).

## Branch Naming

We use numbered feature branches:

```
NNN-feature-slug
```

Examples: `001-project-foundation`, `013-portfolio-polish-pass`.

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>
```

Common types:
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation only
- `style:` — formatting, missing semi colons, etc.
- `refactor:` — code change that neither fixes a bug nor adds a feature
- `test:` — adding or correcting tests
- `chore:` — maintenance tasks

Examples from the repo:
- `feat: developer admin panel, channels, billing, settings`
- `feat: AI lead pipeline — backend & frontend updates`

## Pull Request Checklist

Before requesting a review, please confirm:

- [ ] `npm run lint` passes in `frontend/`
- [ ] `npm run typecheck` passes in `frontend/`
- [ ] `python manage.py test` passes in `backend/`
- [ ] UI changes include screenshots in the PR description
- [ ] No new `href="#"` or empty `onClick={() => {}}` handlers introduced

## Getting Help

Open a [Discussion](https://github.com/rawaj-ai/space/discussions) or reach out at `hello@rawaj.ai`.
