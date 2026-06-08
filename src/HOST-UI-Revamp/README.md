# HOST — UI Revamp (refactor/ui-revamp)

Refactored **real source files** from your `refactor/ui-revamp` branch — a full visual
overhaul of the app shell (sidebar, floating header, home launcher, split-screen
login) to match the dashboard design. **No API, redux, routing, i18n, or business
logic was changed** — only styling + additive presentation markup.

## 8 changed files (drop in at the SAME paths)

```
src/variable.scss
src/App.jsx                                              ← Ant theme tokens only
src/App.scss                                             ← global button/input/scrollbar polish
src/components/layout/layout.scss                        ← sidebar icon-tiles + floating header
src/components/home/home.scss                            ← launcher → card system
src/components/authentication/auth.scss                  ← split-screen login
src/components/authentication/presentation/Login.jsx     ← welcome heading + social buttons
src/components/layout/presentation/index.jsx             ← gradient brand panel (Auth wrapper)
```

## How to apply (stays on refactor/ui-revamp only)

```bash
git checkout refactor/ui-revamp        # your branch
# copy the src/ files from this bundle over your repo's src/ (same paths)
npm install                            # if not already
npm start                              # http://localhost:3000
```

Then review the diff and commit on `refactor/ui-revamp`. Because **you** run the
copy + commit, no other branch is ever touched.

## What changed, by file

- **variable.scss** — expanded the token system (shadows, radii, pastel fg colors,
  neutral tiles, motion easings, sidebar metrics). All existing variable names kept,
  so nothing that referenced them breaks.
- **App.jsx** — richer `ConfigProvider` tokens: pill buttons with primary glow,
  rounded filled inputs, Menu inset items, soft Table. (Only the `theme={{…}}` object
  changed; all logic/hooks untouched.)
- **App.scss** — primary buttons get a soft shadow + lift hover; refined scrollbars
  and selection; default buttons hover indigo.
- **layout.scss** — sidebar menu icons became soft rounded **tiles** (neutral by
  default, indigo when active/hover); active item is an indigo gradient pill; floating
  glass header refined (circular bell/nav buttons, cleaner welcome text, pill language
  selector); softer collapse disc; submenu popups restyled; content fades in on route
  change.
- **home.scss** — each launcher group is now a white **card** with a clean titled
  header (gradient underline); action buttons became tinted rows with indigo icon
  tiles that lift + slide on hover. Structure untouched → all navigation/dispatch works.
- **auth.scss + index.jsx + Login.jsx** — split-screen: animated gradient brand panel
  (your `auth-side-image.png` faded behind aurora blobs) on the left; welcome heading,
  styled credentials, full-width submit, and Google/Microsoft buttons on the right.

## Notes / follow-ups

- **Social buttons (Google / Microsoft)** on login are **visual only** — wire them to
  your OAuth flow, or delete the `.social-row` + `.login-divider` blocks in `Login.jsx`
  if you don't want them. They submit nothing (`type="button"`).
- Brand-panel tagline + the login subtitle are short English literals. If you need them
  translated, move them to your i18n `t('…')` keys.
- Icon colors in the sidebar/home rely on the SVGs using `currentColor` (they did
  before — old code tinted them white). If any specific icon doesn't recolor, it has a
  hardcoded fill and needs a one-line SVG tweak.

## Rollback
Every change is visual/additive. `git checkout -- <file>` any single file to revert it.
