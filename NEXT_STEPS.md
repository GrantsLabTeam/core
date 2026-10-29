# Next steps: Design System portfolio

Status as of 2026-10-28, branch `analyze/design-system-portfolio`.

## What exists

- **Design System section in Storybook**, at `packages/ui/src/design-system/`: 18 Figma-style pages.
  - Cover.
  - Foundations: Color, Typography, Shape & Elevation, Iconography, Brand.
  - Components: Badges, Buttons, Data Display, Feedback, Form Controls, Navigation.
  - Patterns & Screens: Checker, Data Visualization, Forms & Flows, Pools & Programs, Projects &
    Applications, Retrofunding.
  - The shared layout is in `_canvas/Canvas.tsx`.
  - The sidebar order is set in `packages/ui/.storybook/preview.ts`.
- **Export tools**, in `tools/portfolio-export/`, which produce:

  - a static Storybook bundle with Mac and Linux launchers;
  - an 18-page PDF;
  - a static offline website.

  `tools/portfolio-export/README.md` has the run order.

- **Last delivered files** (on the old server, in `~`):
  - `gitcoin-design-system-storybook.zip` (6.3 MB)
  - `gitcoin-design-system-portfolio.zip` (9.1 MB: PDF + website)

## Before leaving the old server

- [ ] Commit this branch and push it (nothing is committed or pushed yet). Decide whether it becomes
      a PR on `GrantsLabTeam/core` or stays a personal branch.
- [ ] Copy the two zips from `~` if they're still needed. They can also be rebuilt from the repo.
- [ ] Clean up:
  - `~/gitcoin-design-system-storybook*`
  - `~/gitcoin-design-system-portfolio*`
  - `~/.cache/gitcoin-ds-pdf` (80 MB working copy of the export scripts)
  - `~/.cache/unz-test`
  - the worktree `~/.paseo/worktrees/3tgjvurt/curly-hippo`, after pushing (`git worktree remove`
    from `~/sources/core`).

## Open questions with the designer

- [ ] **Mac launcher:** she had trouble opening the Storybook bundle on her Mac. A fix was shipped:
      a Perl fallback server, updated steps for macOS 15+, and a Terminal fallback. It still needs
      confirming on her machine; we're waiting on the exact error and macOS version. The PDF and
      website avoid the problem entirely.
- [ ] **Copy review:** page descriptions only describe what the code does. She may want to rewrite
      them in her own voice and add her design reasoning.
- [ ] **Credit:** add her name and role to the Cover. Not done, since her name wasn't provided.
- [ ] **Screenshots:** full-page PNGs of each page could be added to the zip as ready-made portfolio
      images. The PDF/HTML pipeline already renders them (`verify-html.mjs` writes `htmlshots/`).

## Not implemented

### Content gaps

- **Full Checker app pages** (ApplicationEvaluationOverview, SubmitApplicationEvaluation,
  ViewApplicationEvaluations) are left out. They call the live `api.checker.gitcoin.co` and the
  indexer GraphQL. They need MSW handlers for those endpoints.
- **ProgressModal** isn't on the Components page; it's only on Forms & Flows as a snapshot. The
  modal only renders full-screen, and its step rows aren't exported.
- **Missing states:**
  - hover and focus (can't be shown statically);
  - Select open (it locks page scroll);
  - Input error (the component has no error option).
- **Modal snapshots:** Dialog, ProgramPickerModal and ProgressModal are copied into frames and can't
  be clicked.
- **Placeholder images:** project images on Projects & Applications are placeholder photos (picsum),
  because IPFS was rate-limited during the build (`patterns/_helpers.tsx`).
- **Dark mode:** only the leaderboard and pagination define dark colors, so the pages are
  light-only.

### Bugs found in existing components (not fixed)

- `StakeProjectCard.tsx` shows "Unlocks in -6 days" for future unlock dates; the time difference has
  the wrong sign. That state is left out of the showcase.
- A React `forwardRef` warning on the Navigation page comes from an existing component (source not
  identified).
- A Radix "Missing Description" warning in ProgramPickerModal.
- The Distribute table has a fixed 692 px height, which leaves empty space.

### Export tooling

- The Storybook bundle steps are manual: copy the launchers, paste
  `storybook-bundle/file-guard.html` into `storybook/index.html`, then zip. A `make-bundle.sh` would
  do all three steps.
- The scripts hard-code port 6050 and must be run from `tools/portfolio-export/`. Make the port an
  argument.
- `fixcss.mjs` patches font URLs after `snapshot.mjs`. It would be cleaner inside the snapshot.
- The static website is fixed at 1600 px wide; on narrow screens it scrolls sideways.
- Not tested: the launchers on a real Mac, Safari, and the PDF in Preview or Acrobat.

### Ideas discussed, not started

- **Figma file:**
  - Option A: a one-time Figma plugin that creates color and text styles, effect styles, logos and
    icons as vectors, and basic components (Button, Badge, inputs).
  - Option B: import the hosted website into Figma with the html.to.design plugin.
- **Hosting:** host the website (e.g. Netlify Drop) so she can link to or embed pages in her
  portfolio site.
