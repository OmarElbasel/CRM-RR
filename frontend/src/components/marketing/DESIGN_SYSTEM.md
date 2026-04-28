# Rawaj Design System

**Source of Truth**: `Design System (1)/` folder  
**Scope**: Marketing landing page (`(marketing)` route)  
**Last Updated**: 2026-04-22

---

## Philosophy

A calm, premium B2B SaaS aesthetic. Dark sections float inside a warm paper background. Accent is a sharp lime green (`#C8FE5E`) against deep ink (`#0B0B14`). Typography is tight, confident, and editorial — Inter Tight for display, Inter for body, JetBrains Mono for code/URLs.

---

## Design Tokens

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--ink` | `#0B0B14` | Primary dark backgrounds (hero, footer, dark bands) |
| `--ink-2` | `#14141F` | Secondary dark surfaces |
| `--ink-3` | `#1E1E2C` | Tertiary dark surfaces |
| `--paper` | `#FAFAF7` | Page background |
| `--paper-2` | `#F2F1EA` | Secondary light surfaces |
| `--text` | `#15151F` | Primary text on light |
| `--text-2` | `#5A5A6E` | Secondary text on light |
| `--text-3` | `#9898A8` | Tertiary/muted text |
| `--line` | `#E7E6DF` | Borders on light backgrounds |
| `--line-2` | `#D9D7CE` | Secondary borders |
| `--line-dark` | `rgba(255,255,255,0.08)` | Borders on dark backgrounds |
| `--line-dark-2` | `rgba(255,255,255,0.12)` | Secondary dark borders |
| `--primary` | `#594FBF` | Primary brand purple |
| `--primary-ink` | `#35279B` | Dark purple for emphasis |
| `--primary-soft` | `#ECEAFB` | Light purple backgrounds |
| `--accent` | `#C8FE5E` | Lime green accent (CTAs, highlights, stats) |
| `--accent-ink` | `#1F2A00` | Dark text on accent |
| `--mint` | `#7AE7C7` | Success/progress indicator |
| `--danger` | `#E4573C` | Error states |
| `--warn` | `#F4B740` | Warning states |

### Typography

| Role | Font | Weight | Letter-spacing | Size |
|------|------|--------|----------------|------|
| Hero title | Inter Tight | 500 | -0.035em | 68px |
| Section title (h2) | Inter Tight | 500 | -0.03em | 52px |
| Deep dive title (h3) | Inter Tight | 500 | -0.03em | 40px |
| Pillar title (h3) | Inter Tight | 500 | -0.02em | 30px |
| Body | Inter | 400 | normal | 15-17.5px |
| Label/mono | JetBrains Mono | 400 | normal | 11.5px |
| Kicker | Inter Tight | 600 | 0.14em | 11.5px (uppercase) |
| Nav links | Inter | 400 | normal | 13.5px |
| Button | Inter | 500 | normal | 13.5px |

### Spacing

| Token | Value |
|-------|-------|
| Container max-width | 1240px |
| Container padding | 0 32px |
| Section padding (desktop) | 140px 0 |
| Section padding (mobile) | 96px 0 |
| Grid gap (pillars) | 24px |
| Component gap | 16px, 10px, 8px |

### Radius

| Token | Value |
|-------|-------|
| `--radius` | 14px |
| Buttons | 10px (default), 11px (lg) |
| Small elements | 6px, 7px, 8px |
| Pills/badges | 999px |

### Shadows

| Token | Value |
|-------|-------|
| Card default | `0 1px 0 rgba(0,0,0,0.02), 0 30px 60px -30px rgba(10,10,20,0.35)` |
| Card large | `0 1px 0 rgba(0,0,0,0.04), 0 40px 80px -30px rgba(10,10,20,0.55)` |
| Frame | `0 40px 80px -30px rgba(10,10,20,0.25)` |

---

## Component Library

### Layout

- **`.rawaj-landing`** — Root wrapper, sets all CSS custom properties
- **`.container-rl`** — Centered max-width container
- **`.band`** — Section wrapper
  - `.light` — paper background
  - `.paper` — paper-2 background
  - `.dark` — ink background

### Navigation

- **`.nav`** — Sticky glassmorphism nav
  - Background: `rgba(11,11,20,0.72)` + blur(20px)
  - Height: 64px
  - Logo mark: gradient square with inset detail

### Buttons

- **`.btn-rl`** — Base button (36px, 10px radius)
- **`.btn-primary`** — Accent bg, dark text
- **`.btn-ghost`** — Transparent, hover light
- **`.btn-light`** — White bg
- **`.btn-dark`** — Ink bg, white text
- **`.btn-outline`** — Bordered
- **`.btn-lg`** — 44px height, 11px radius

### Cards

- **`.card-rl`** — White card with border + shadow
- **`.dark-card`** — Dark card for dark sections
- **`.pillar`** — Large feature card (20px radius, 32px padding)
- **`.plan`** — Pricing card

### Typography Patterns

- **`.kicker`** — Uppercase label with dot
- **`.section-head`** — Max-width 760px container for section intro
- **`.section-title`** — h2 with italic emphasis support
- **`.section-lede`** — Subtitle paragraph

### Data Display

- **`.metrics`** — 4-column stat grid
- **`.metric .mv`** — Large number (56px, Inter Tight)
- **`.agents`** — 3-column agent cards
- **`.kanban`** — 4-column pipeline board
- **`.inbox-mini`** — Compact conversation list

### Forms/Composers

- **`.composer`** — Email composer mockup
- **`.flow`** — Automation step flow
- **`.step`** — Individual automation step

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| ≤1080px | Single column layouts, nav links hidden, reduced padding, smaller type |

---

## Animation Tokens

| Property | Value |
|----------|-------|
| Default easing | `[0.16, 1, 0.3, 1]` (Apple-like ease-out) |
| Spring stiffness | 100 |
| Spring damping | 20 |
| Stagger delay | 0.1s |
| Duration | 0.6-0.8s |

---

## Files

| File | Purpose |
|------|---------|
| `landing.css` | All scoped styles and tokens |
| `landing-icons.tsx` | 8 custom SVG icons |
| `LandingNav.tsx` | Sticky navigation |
| `LandingHero.tsx` | Hero with mockup stage |
| `LogoStrip.tsx` | Social proof logos |
| `Pillars.tsx` | 2×2 feature grid |
| `Metrics.tsx` | 4 stat metrics |
| `ProductDeepDive.tsx` | Alternating text + browser frames |
| `UseCases.tsx` | 4 use case cards |
| `Testimonial.tsx` | Quote + stats |
| `LandingIntegrations.tsx` | 12 integration logos |
| `LandingPricing.tsx` | 3-tier pricing |
| `FinalCta.tsx` | Dark CTA section |
| `LandingFooter.tsx` | Multi-column footer |
