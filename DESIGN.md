# Design System - Thai Meet

## Product Context

- **What this is:** Thai Meet is a Thailand-focused Android/iOS dating app for Thai local women and foreign tourists. Gate 0 proves the Trust Loop: Public Meet ID, Discover, Chat, LINE ContactExchange, redacted Contact Card, report, and block.
- **Who it is for first:** Thai local women in Bangkok and Pattaya who want the speed of dating discovery without exposing private LINE/Facebook identity too early.
- **Secondary user:** Foreign tourists and residents from the US, Europe, China, Korea, and Japan who need a simple, legible way to meet and move to LINE when both sides choose it.
- **Space:** Mobile dating, Thailand local dating, travel social, LINE-first contact exchange.
- **Project type:** Mobile app design system for Flutter Android/iOS. No consumer web app in MVP.

## Product Thesis

Thai Meet should not feel like a dark Tinder clone or a raw contact-sharing shortcut. It should feel like fast mobile discovery with a visible trust layer.

Memorable line:

```text
Swipe fast. Open LINE only by choice.
```

Korean working line:

```text
스와이프는 빠르게, LINE은 내가 선택할 때만.
```

## Benchmark Correction

ThaiFriendly is a hybrid IA, not only search/profile and not only swipe. The benchmark PDF and supplied swipe screenshot show:

- Swipe card discovery with stacked profile cards.
- Top-level action icons for undo, likes, targeting/filter, and filter.
- Distance badge on the card.
- Quick message input directly below the active card.
- Bottom navigation that keeps search/discover, swipe, messages, list/grid, and profile-like areas close together.
- Search/filter settings as a secondary but important path.

Thai Meet should preserve the useful hybrid pattern:

- **Primary:** Swipe-first Discover.
- **Secondary:** Search/filter/list exploration.
- **Differentiator:** Public Meet ID and controlled LINE Contact Card, never raw LINE ID leakage.

## Aesthetic Direction

- **Direction:** Bangkok Rose Trust.
- **Decoration level:** Intentional. Use meaningful badges, provider marks, photo overlays, and subtle tactile surfaces. Avoid decorative blobs, purple gradients, and generic SaaS illustration.
- **Mood:** Bright, mobile-native, controlled, and warm. The app should feel socially fast but not reckless.
- **Category fit:** Photo-forward like dating apps, but calmer and clearer than dark high-contrast swipe clones.
- **Design risk:** Use a rose-led daylight trust palette instead of the nightclub/dark dating-app default or a generic teal safety app.

## Core Design Principles

1. **Swipe is the first move.** Discover opens to a stacked swipe-card experience, not a marketing page, dashboard, or list-first directory.
2. **Trust is visible, not heavy.** Public Meet ID appears on cards, chat headers, Contact Cards, and ID image screens without turning the app into a verification product.
3. **LINE is explicit.** LINE sharing happens through a Contact Card in chat. Do not place a raw LINE ID in chat messages, push notifications, logs, or copied text.
4. **Thai local woman first.** Controls should make the local user feel able to start fresh, choose when to share, report/block, and keep private identity separate.
5. **Provider colors are scoped.** LINE green appears only for LINE provider actions and Contact Cards. It is not the Thai Meet primary color.
6. **Mobile density beats landing-page polish.** Screens must be dense enough for repeated mobile use, with clear tap targets and minimal explanation text.

## Typography

- **Display and primary UI:** Satoshi. Use for app title, screen headings, card names, primary buttons, and tab labels.
- **Body:** Source Sans 3. Use for explanatory text, system messages, profile copy, settings, and multilingual UI.
- **Public ID and data:** JetBrains Mono. Use for Public Meet IDs, request IDs, internal-looking safety references, and diagnostic UI.
- **Code:** JetBrains Mono.
- **Fallback strategy:** Use Flutter bundled or self-hosted fonts where possible. If a font cannot be bundled in early scaffold, use a metrically close fallback temporarily and keep the role names in tokens.

### Type Scale

| Token | Size | Line | Use |
| --- | ---: | ---: | --- |
| `display-xl` | 44 | 48 | Onboarding hero, not compact app panels |
| `display-lg` | 34 | 38 | Major screen title |
| `title-lg` | 26 | 32 | Profile/card names |
| `title-md` | 20 | 26 | Section headings |
| `body-lg` | 18 | 26 | Empty states and short guidance |
| `body-md` | 16 | 24 | Default app body |
| `body-sm` | 14 | 20 | Metadata, helper text |
| `label-md` | 14 | 18 | Buttons, tabs, chips |
| `mono-id` | 13 | 18 | Public Meet ID badge |

Rules:

- Do not scale font size with viewport width.
- Letter spacing is `0`.
- Use tabular numerals for ages, distances, counters, and metrics.
- Thai, Korean, Chinese, and Japanese text must be tested for wrapping in card badges, buttons, and bottom nav labels.

## Color

- **Approach:** Restrained product palette. Thai Meet has one dating-trust primary, one warm action color, scoped provider colors, and clear semantic colors.
- **Primary rose trust:** `#BE123C` - Public ID, selected controls, primary CTAs, active bottom nav, and safe confirmation. This is dark enough for AA text contrast on pale rose surfaces.
- **Primary rose soft:** `#FFE4EC` - selected surfaces, active chips, and low-emphasis trust backgrounds.
- **Action coral:** `#C2410C` - limited use for attention, notification badges, and one-off confirmation emphasis. Do not use for long body text.
- **Honey support:** `#D97706` / `#FFF7CC` - secondary benchmark/list/account hints only.
- **LINE provider:** `#06C755` - only LINE provider badge, LINE Contact Card, and LINE-specific confirmation.
- **Background daylight:** `#FFF8FA` - main app light background, tinted toward the rose brand hue rather than generic cream.
- **Surface:** `#FFFFFF` - panels, sheets, cards outside photo surfaces.
- **Raised rose surface:** `#FFF1F5` - subtle containers and disabled regions.
- **Text ink:** `#151215` - primary text.
- **Muted text:** `#6F5660` - metadata and secondary copy.
- **Border:** `#F2D4DC` - dividers, cards, input outlines.
- **Safety/error:** `#9F1239` - report, block, destructive warning.
- **Warning:** `#D97706`.
- **Info:** `#2F80ED`.
- **Success:** `#148A5B`.

Rules:

- Rose owns Thai Meet identity and trust actions. Do not reintroduce teal as generic safety color.
- LINE green remains provider-scoped only.
- Coral and honey are support colors, not competing primaries.
- Text using `#BE123C` must sit on `#FFF8FA`, `#FFFFFF`, or `#FFE4EC` only after contrast verification.
- Avoid side-stripe accents and repeating stripe backgrounds. Use full borders, soft surfaces, icons, or real Public ID artwork instead.

### Dark Mode

Dark mode is allowed, but it is not the brand default. Use it mainly where photo cards need dark chrome:

- Background: `#161412`
- Surface: `#211F1B`
- Raised surface: `#2B2823`
- Text: `#FFF8EC`
- Muted text: `#C9BDAD`
- Border: `#443D35`
- Rose trust: `#FB7185`
- Coral: `#FDBA74`

Do not let dark mode become the default Thai Meet identity.

## Spacing

- **Base unit:** 4px.
- **Density:** Comfortable-dense. Dating discovery needs repeated scanning, but trust actions need enough breathing room to avoid mistakes.
- **Scale:** `2xs 2`, `xs 4`, `sm 8`, `md 16`, `lg 24`, `xl 32`, `2xl 48`, `3xl 64`.

Rules:

- Compact toolbars and bottom nav use fixed heights.
- Swipe cards, ID images, and Contact Cards use stable aspect ratios.
- Avoid layout shift when badges, distances, or translated labels change.

## Layout

- **Approach:** Mobile-native hybrid.
- **Gate 0 first screen:** Swipe-first Discover.
- **Secondary exploration:** Search/filter/list from Discover controls.
- **Chat:** Full-screen route with message history, provider-safe Contact Cards, and report/block access.
- **Settings/Public ID:** Lightweight screens for ID regeneration, archive, language, and contact provider setup.

### Mobile Breakpoints

| Width | Layout |
| ---: | --- |
| 320-374 | Compact phone. Short labels, stacked sheets, reduced card chrome. |
| 375-430 | Default design target. iPhone/Android common range. |
| 431-600 | Large phone. Preserve card proportions; do not over-widen text. |
| 601+ | Tablet-safe fallback only. MVP is not tablet-first. |

### Grid and Geometry

- Screen padding: 16px default, 20px on large phones.
- Card radius: 12px to 18px depending on photo card scale.
- UI control radius: 8px default.
- Small badges: 4px to 6px radius.
- Bottom nav: full pill shape is allowed.
- Do not use large rounded cards nested inside other cards.

## Motion

- **Approach:** Intentional.
- **Swipe cards:** Direct manipulation with springy but short motion. Avoid theatrical animations.
- **Contact Card reveal:** Short slide/fade from message stream, 180-240ms.
- **Safety actions:** No playful motion. Use clear confirmation state.
- **Public ID regeneration:** 250-400ms shuffle/replace animation, then stable selected state.
- **Easing:** enter `ease-out`, exit `ease-in`, move `ease-in-out`.

Durations:

- Micro: 50-100ms.
- Short: 150-250ms.
- Medium: 250-400ms.
- Long: avoid in core flows unless onboarding.

## Gate 0 IA

Bottom navigation should stay reduced:

1. Discover.
2. Swipe.
3. Chat.
4. List.
5. My.

Gate 0 route priorities:

- `PublicMeetIdSetup`
- `DiscoverSwipe`
- `DiscoverNearby`
- `ProfileDetail`
- `ChatContactCard`
- `FirstShareConfirmation`
- `MyPublicMeetId`
- `ListSafetyActions`

Facebook routes stay hidden until Gate 1.

## Components

### Swipe Card

Required elements:

- Large photo or Public ID image placeholder.
- Distance badge.
- Public Meet ID badge.
- Display name, age, city/country.
- One-line trust status where useful.
- Reject/like gesture feedback.
- Quick message input below the active card.

Do:

- Keep the active card dominant.
- Show enough of the next card to communicate swipe.
- Keep the quick message below the card, not over the face/photo region.

Do not:

- Put LINE share directly on the swipe card in Gate 0.
- Hide Public Meet ID deep in profile detail.
- Let ad surfaces interrupt the Contact Card path.

### Public Meet ID Badge

- Use JetBrains Mono.
- Format examples: `TM-BKK-001`, `TM-PTY-031`.
- Badge background: primary rose trust.
- Badge text: white.
- Must fit within card top-left on 320px width.

### Public ID Image

Purpose:

- Temporary profile card image before photo upload.
- Reset/fresh-start object when user regenerates Public Meet ID.
- Visual trust marker for users who do not want immediate photo exposure.

Rules:

- Use generated pattern, color, short ID, and nickname.
- Do not resemble official government ID.
- Do not imply real identity verification.
- Include regeneration state and selected state.

### Quick Message

- Available below swipe card.
- Sends normal chat message only.
- Must not accept raw LINE/Facebook contact leakage as a special affordance.
- Placeholder should be short and translated.

### LINE Contact Card

Required states:

- Locked/not shared.
- First-share confirmation.
- Available.
- Revoked.
- Reported.
- Blocked.
- Provider unavailable.

State behavior:

- **Locked:** show why the card is unavailable and keep chat available.
- **First-share confirmation:** one-time warning with cancel and share actions.
- **Available:** show view, revoke, report, and block controls.
- **Revoked:** stop future card access without deleting chat history.
- **Reported:** show safety review state while keeping raw LINE hidden.
- **Blocked:** prevent reopening the card and make the block state obvious in list/chat.
- **Provider unavailable:** explain that LINE cannot load now and offer retry later without blocking chat.

Required visible controls:

- View Contact Card.
- Revoke Contact Card.
- Report.
- Block.

Copy rules:

- Avoid long warnings.
- First-share warning appears once.
- Explain that raw LINE ID is not copied into chat history.

### Report and Block

- Always reachable from Contact Card and profile/chat overflow.
- Destructive actions use safety red.
- Confirmation copy must be short.
- Push notifications never include raw external contact values.

## Content Voice

Thai Meet copy should be:

- Short.
- Direct.
- Calm.
- Control-oriented.
- Easy to translate.

Good:

- "Share LINE when you choose."
- "Your Public Meet ID is active."
- "This Contact Card can be reported or blocked."
- "Raw LINE ID stays out of chat."

Avoid:

- Long safety lectures.
- Flirty system copy.
- Marketing claims inside core app screens.
- Copy that implies Thai Meet verifies real identity in Gate 0.

## Accessibility

- Minimum tap target: 44px.
- Text contrast must meet WCAG AA on non-photo surfaces.
- Photo overlays must maintain readable names, distance badges, and Public ID badges.
- Do not rely on color alone for provider, report, block, or selected states.
- Support Dynamic Type where Flutter implementation allows it, while preserving card geometry.
- Test Thai, English, Korean, Chinese, and Japanese strings for truncation.

## App UI Anti-Slop Rules

- No purple/violet gradient brand direction.
- No decorative orbs, blobs, bokeh, or generic tropical decorations.
- No centered landing-page composition inside the app.
- No dark clone of Tinder/ThaiFriendly as the default system.
- No raw LINE ID visible in chat messages, notifications, QA screenshots, logs, or copied strings.
- No card-inside-card layout.
- No oversized hero typography inside compact app panels.
- No rounded text buttons where a standard icon button is clearer.
- No Discover Native Ads in the contact exchange or chat-detail flow.

## Design Artifacts

Current design consultation preview:

```text
~/.gstack/projects/thai-meet/designs/design-system-20260603/thai-meet-design-preview.html
~/.gstack/projects/thai-meet/designs/design-system-20260603/preview-desktop.png
~/.gstack/projects/thai-meet/designs/design-system-20260603/preview-mobile.png
```

Current Figma Gate 0 source:

```text
https://www.figma.com/design/Jls4ueBkuNa53XXPKv6Yxw
```

The Figma file contains:

- `Brand Reference` page using the ThaiMeet brand package assets.
- `Public ID Templates` page with six editable non-official badge directions.
- `Gate 0 Screens` page with eight mobile Trust Loop screens.

AI mockup generation was not used because no OpenAI API key was configured for the gstack design CLI in this environment.

## Implementation Guidance

When building Flutter UI:

- Start with tokens matching this file.
- Implement `DiscoverSwipe` before broad profile/list polish.
- Add screenshot tests for 375x812 and 390x844 viewports.
- Add string-fit checks for Public ID badge, distance badge, bottom nav labels, and Contact Card buttons.
- Keep provider-specific components separate from generic chat messages.

When reviewing UI:

- First ask whether the screen reinforces "Swipe fast. Open LINE only by choice."
- Then check whether Public Meet ID and Contact Card rules are visible and respected.
- Then check whether mobile text fits without overlapping.

## Decisions Log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-06-03 | Created initial design system with `/design-consultation` | Gate 0 needed a source of truth before Flutter UI implementation. |
| 2026-06-03 | Corrected ThaiFriendly benchmark to hybrid swipe/search IA | Supplied screenshot and benchmark PDF show swipe cards plus search/filter, not search-only. |
| 2026-06-03 | Set default direction to Bangkok Rose Trust | Differentiates from dark dating-app clones while keeping Thai local woman control at the center. |
| 2026-06-03 | Scoped LINE green to provider UI only | Thai Meet should support LINE without becoming visually owned by LINE. |
| 2026-06-03 | Made Public Meet ID a visible card/chat trust marker | Public ID is the trust and fresh-start mechanism, not backend-only metadata. |
| 2026-06-04 | Locked color system to Bangkok Rose Trust | Dating-app benchmarking favored rose/coral energy; rose is now the primary trust/action color, LINE green remains provider-scoped. |
| 2026-06-04 | Moved wireframe first viewport to app-first preview | Reviewers should judge the mobile dating experience before reading benchmark or planning notes. |
| 2026-06-21 | Created Figma Gate 0 source with ThaiMeet brand assets | Product review can now use editable Gate 0 screens and six Public ID template directions instead of the placeholder source. |
