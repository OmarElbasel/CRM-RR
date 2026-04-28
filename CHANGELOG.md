# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- MIT `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, and `CODE_OF_CONDUCT.md`.
- GitHub issue/PR templates and CI workflow (`lint`, `typecheck`, `test`, `build`).
- `docs/` directory with moved design briefs and integration guides.
- Single design language (`ds-*` tokens) across all frontend surfaces.
- `lucide-react` as the sole icon set; removed Material Symbols.
- Local brand SVGs (`public/brands/`) replacing hot-linked Wikipedia/Google CDN images.
- Standard SaaS surfaces: branded `not-found`, `error`, `global-error`, `loading` states.
- Legal pages: `privacy`, `terms`, `cookies`, `security`, `status`.
- `sign-in` and `sign-up` pages with Clerk inside a branded shell.
- Real stats endpoints: `GET /api/pipeline/stats/` and `GET /api/channels/stats/`.
- Demo-mode banner and dummy-data fallbacks for first-run experience.
- Server-persisted onboarding (`Organization.onboarding_state` JSONField + API).
- Consolidated `/settings` page with tabs; old settings paths redirect.
- Sidebar grouped by Workspace / Marketing / Setup; mobile hamburger nav.
- Marketing landing migrated to Tailwind + `ds-*` tokens; real screenshots.
- Command palette (⌘K), global toast, dark mode (`next-themes`), and i18n (`next-intl`).
- Playwright smoke + a11y tests and Lighthouse CI.

### Changed
- Rewrote `README.md` with accurate product description, feature matrix, and screenshots.
- Pipeline page title changed from "Order Hub" to "Pipeline".
- All hardcoded fake stats replaced with real data or `—`.

### Removed
- `UI_REDESIGN` feature flag and all conditional branches.
- Dead controls (empty `onClick`, `href="#"`, non-functional notifications bell).
- `landing.css` and BEM classes from marketing components.
- `PlaceholderFeature` for non-credential-gated surfaces.
- `Design System (1)/` duplicate artifact.

## [0.x.x] — Previous releases

See `git log` for earlier release history.
