# Thai Meet Wireframes

Static Gate 0 wireframes built from `docs/prd/Thai-Meet_PRD_v3.0_Final_KO.docx`, `DESIGN.md`, ThaiFriendly/MEEFF benchmarking, and UI UX Pro Max guidance.

## Stack

- HTML
- Tailwind CSS via CDN
- Lucide icons via CDN

## QA

```powershell
pnpm wireframes:check
# or, when pnpm is not on PATH:
node wireframes/qa-check.mjs
```

The check validates route IDs, component primitives, motion/accessibility/localization contracts, nav labels, progress semantics, and legacy anti-patterns.

## File

- `index.html` - mobile-first wireframe board for Public ID, Discover, Swipe, Profile, Chat, LINE Contact Card lifecycle, List, My, language, safety actions, and ad placement rules.

## First Viewport Rule

- The first viewport shows the actual mobile app preview before benchmark notes.
- Mobile view keeps a compact in-app value strip visible inside the phone preview.
- Benchmark and planning evidence stay below the app-first hero so reviewers judge the product feel first.

## Benchmark Direction

- Tinder: warm action color and image-first swipe.
- Bumble: brighter female-first trust tone.
- ThaiFriendly: practical swipe plus search/list discovery.
- MEEFF: global chat/list utility, language cues, and visible moderation affordances.

## Product Rules Reflected

- Gate 0 bottom navigation is fixed to `Discover`, `Swipe`, `Chat`, `List`, `My`.
- Swipe previews use stacked, photo-safe profile placeholders so the first screen reads as a dating app rather than an abstract planning board.
- Safety is reachable from profile, Chat, Contact Card, List, and My instead of occupying a top-level tab.
- LINE is visible in Gate 0; Facebook remains Gate 1.
- Contact Card sharing is explicit and never exposes raw LINE IDs in chat.
- Contact Card lifecycle covers locked, confirm, available, revoked, reported, blocked, and provider unavailable states.
- Discover Native Ad is represented only as a muted, non-blocking placeholder.
- Touch targets are sized for mobile use.
- Pressable controls use short tactile feedback, hover is gated to pointer devices, and repeated app surfaces share `surface-card`, `contact-card-state`, and `sheet-panel` treatments.
- Motion tokens are explicit in CSS, `prefers-reduced-motion` is supported, and the wireframe board includes an Interaction Contract for press, swipe, Contact Card reveal, and sheets.
- Accessibility contract is included for focus rings, `aria-current`, progressbar semantics, and reduced-motion behavior.
- Localization contract covers English, Thai, Korean, Chinese, and Japanese copy stress with wrapping guards for chips, buttons, nav labels, and cards.
- Component contract adds stable `data-route` IDs and named primitives for implementation and QA handoff.
- QA contract is executable through `pnpm wireframes:check`.
