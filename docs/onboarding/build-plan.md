# Onboarding wizard — build plan

Started 2026-08-26. Source screens: `flolyt-figma-designs/onboarding/03-create-workspace.svg`
through `08-invite-team-and-roles.svg` (6 SVGs; `01-sign-up` and `02-sign-in` are not in this
folder — 02 is already built against the old kit-122 flow, see `build-tracker.md` row 2).

This file is the working plan for that build: what each screen needs, what's blocked, and the
decisions made along the way. The actual endpoint reference stays at
[`docs/endpoints/workspace.md`](../endpoints/workspace.md) per the established
[[endpoint_docs_convention]] — this file links to it rather than duplicating it.

## Why this exists

After sign-in, `verifyLoginCode` gets back `onboardingRequired: true` for a user with no
workspace yet. **Flipped** —
[`use-verify-login-code.ts`](../../src/features/auth/use-verify-login-code.ts) now sends a user
with `onboardingRequired: true` to `/onboarding/start`, everyone else to `/`. Steps 1 (workspace)
and 2 (business model) exist as of 2026-08-27 — a real account lands in `/onboarding/workspace`
after the pre-workspace screen, then `/onboarding/business-model`, then has nowhere further to go
until data/agents/team are built.

## The 5-step wizard, per the stepper baked into each SVG

| # | Step label | Screen(s) | Notes |
|---|---|---|---|
| 1 | Workspace | `03-create-workspace.svg` | name, slug, timezone, primary market, reporting currency, markets sold in |
| 2 | Business model | `04-business-model.svg` | Consumer / Account-based / Both |
| 3 | Your data | `05-connect-first-source.svg`, `06-source-connected.svg` | connect one source, see it mapped |
| 4 | Your agents | `07-meet-your-agents.svg` | readiness of the 13 specialists — clean, no blockers |
| 5 | Your team | *(see below — not actually a wizard screen)* | |

`08-invite-team-and-roles.svg` is drawn with the full permanent app sidebar and "Invite"/"Send
invite" buttons, not the wizard's stepper header and "Continue" button that every other screen
in this batch has. It's the regular **Team settings page**, not a wizard overlay — step 5
probably just links out to it rather than embedding it. Will confirm this reading again once we
reach that screen; treat as a normal in-app page, not part of the `/onboarding/*` route tree.

## Route shape (proposed)

`/onboarding/*`, authenticated but **outside** `AppLayout`'s sidebar shell (own header/stepper,
matches every screen 03-07's own chrome) — same pattern as `/auth/*` being outside it for the
opposite reason. Steps are route segments, not a `?step=` param, since each has its own URL-worthy
identity and "Save and finish later" needs a real link back in:

```
/onboarding/start             (the missing pre-workspace screen — POST /workspace, no stepper dot)
/onboarding/workspace         (step 1, screen 03)
/onboarding/business-model    (step 2, screen 04)
/onboarding/data              (step 3, screens 05/06 — sub-states, not sub-routes, mirrors every
                                other section's index-branching pattern)
/onboarding/agents            (step 4, screen 07)
```

## The missing pre-workspace screen (no Figma source — designed this session)

`POST /workspace` needs 11 fields no screen in the export collects. Since `PUT /identity` and
`PUT /markets` are **edits** (`PUT`, not `POST` — neither takes a `workspaceId`, the backend
resolves "which workspace" from the session), something has to create the workspace record before
screen 03 can even load. Building a short "tell us about your business" screen for this, reached
right after sign-in when `onboardingRequired: true` and no workspace exists yet.

**Fields, and where each value ends up:**

| Field | Maps to | How |
|---|---|---|
| Business name | `POST /workspace` → `name` | typed here — the only place it's collected, since 2026-08-26 (see "Decisions made so far" below) |
| *(new field, added 2026-08-26)* Workspace address | `slug` | typed here, paired with Business name; live `GET /slug-available` check under it |
| What your business does | `description` | typed here |
| Work email | `email` | **display-only**, pre-filled from the signed-in account, not editable |
| Your role | `jobRole` | plain text — no enum in the doc |
| Company size | `employeeCountRange` | dropdown, buckets guessed (1-10 / 11-50 / 51-200 / 201-1000 / 1000+) — not from any doc, verify once seen |
| Country | `country` | plain static world-country list (own picker, unrelated to Flolyt's supported-markets list) |
| Business address | `location` | guessed reading of this field — treating as a street-address line since city/state/country are separate fields already |
| City, State | `city`, `state` | typed here |
| Zip code, Phone, Website | `zipCode`, `phoneNumber`, `webSite` | all optional per the doc's own `(nullable)` markers |
| *(not asked — silently defaulted)* | `currency` | `GET /currency/default?countryCode=` once country is picked (see `currency.md`) |
| *(not asked — silently defaulted)* | `timeZoneId` | the browser's own detected timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`) — no backend call, no country-mapping table to maintain |

**Data sources, resolved this session:**
- **Country picker (plain list):** no endpoint needed — ordinary static world-country reference
  data, unrelated to Flolyt's own supported-markets list.
- **Currency auto-default:** `GET /currency/default` (see [`currency.md`](../endpoints/currency.md)),
  found and documented this session — resolves what was originally an assumption-risk into a real
  endpoint call.
- **Screen 03's "Reporting currency" dropdown:** `GET /currency/supported`'s `currencies` array —
  the actual list Flolyt can report in, not a static guess.
- **Screen 03's "Primary market" / "Markets you sell in":** `GET /workspace/proposed-markets`
  (already fully documented in `workspace.md`) — not the currency endpoints above, which only
  cover currency codes, no country data at all.
- **Search UX for the country/timezone pickers:** no combobox/typeahead component exists in this
  app yet (only a plain, non-searchable Radix `Select`), and no combobox library is installed.
  Hand-rolling a filter-as-you-type list on the existing `Popover` primitive rather than adding a
  new dependency (e.g. `cmdk`) — this app has a real history of new Radix-ecosystem libraries
  breaking under its Preact setup ([[preact_radix_dialog_crash]]).
- **Timezone list for screen 03's editable dropdown:** `Intl.supportedValuesOf("timeZone")` — a
  built-in JS API (ES2022), no library or endpoint needed.

## Decisions made so far

- **Step-up confirmation flow: build it now.** It's fully specified in
  `flolyt-extras/auth-frontend-handoff.md` (lines 80-112) — two endpoints
  (`POST /step-up/request-code`, `POST /step-up/verify-code`), same emailed-code shape as sign-in,
  not a password. `change_workspace_markets` and `change_revenue_model` are **always** gated, so
  both step 1 and step 2 need this regardless — no avoiding it. Reuses the OTP-entry UI pattern
  already built for sign-in.
- **Slug field: lives on `/onboarding/start` (the pre-workspace screen), not screen 03.**
  Originally added to screen 03 since neither SVG drew one and `PUT /identity` required it. Moved
  2026-08-26 after `PUT /identity` was narrowed to slug-only in an API update: since Business
  name and Time zone are already collected on the pre-workspace screen, and `POST /workspace`
  itself accepts an optional `slug`, splitting workspace *identity* (name+address+timezone)
  across two screens and two-then-three API calls had no product reason once name/timezone no
  longer needed re-entry on screen 03. All three now go in one place, at creation. Still a
  one-time-accepted DNS label — the user picks it deliberately, no auto-generation from the name.
  `workspaceIdentitySchema` in `src/validators/workspace.ts` still validates the shape, now
  shared by both the create-workspace schema and the (currently onboarding-unused) identity
  schema.
- **Screen 03 is markets-only.** `PUT /identity` and `PUT /profile` are not called from onboarding
  at all as of 2026-08-26 — only `PUT /markets`, step-up gated.

## Onboarding gate — re-checked on every protected page load, not just at login

Found mid-session: the login-time redirect only fires once. A user with an existing session
cookie could refresh or deep-link straight past onboarding, since `ProtectedRoute` only checked
"is there a valid token," never "has this person actually finished setting up."

**Fixed in `src/route/protected-route.tsx`.** Two layers, since `GET /workspace/onboarding` can't
be asked about a workspace that doesn't exist yet:
- **No workspace** (`user.companyId` unset) → trust the login-time flag, send to
  `/onboarding/start`.
- **Workspace exists** → ask `GET /workspace/onboarding` live instead of trusting the cached
  `hasCompletedOnboarding` flag, which goes stale the instant a step finishes mid-session (the JWT
  itself doesn't refresh until next login/token-refresh).

**The missing piece this depended on:** the JWT doesn't self-update when `/onboarding/start`
creates a workspace mid-session, so "does a workspace exist" wasn't trackable at all beyond the
login snapshot. Fixed by having `/onboarding/start`'s success handler save the new `companyId`
into the cached user object (`setUser` + the `user_data` cookie) the moment `POST /workspace`
succeeds — see that screen's `onSuccess` handler.

Routes already under `/onboarding` are exempt from this guard — it only redirects a user *into*
onboarding, never blocks movement within the wizard's own screens. A network error checking
onboarding status fails open (lets the request through, logs a warning) rather than trapping
someone in a redirect loop.

**Fixed 2026-08-27:** the guard now honors `GET /workspace/onboarding`'s `resumeAt` field via a
`RESUME_STEP_ROUTES` map in `protected-route.tsx`, instead of always hardcoding
`/onboarding/workspace`. Falls back to the furthest **built** step (`LAST_BUILT_STEP_ROUTE`) for
any `resumeAt` value that doesn't have a screen yet (`data`/`agents`/`team` today) — update both
constants together as steps 3-5 land. Verified live: completing markets moved a test account's
`resumeAt` to `"business_model"`, and a fresh reload from `/` correctly landed on
`/onboarding/business-model` instead of bouncing back to step 1.

## Open question: `POST /workspace`'s `createSeparately` field

Added to the API doc 2026-08-26 with no explanation — the doc's own curl example sends `true`.
Neither the user nor this session knows what it controls. Code sends `true` to match the example
(`use-create-workspace.ts`), but this is an unconfirmed guess — check with the backend team before
relying on it, and correct the default here once it's known.

## Resolved: what calls `POST /workspace`

Was an open question — resolved by building a dedicated pre-workspace screen for it (see above)
rather than assuming a hidden auto-stub or a missing sign-up field. That screen calls
`POST /workspace` alone now — as of 2026-08-26, it's the only workspace-identity write in the
whole onboarding flow (name, address, and timezone all set there); screen 03 no longer edits any
of what it created.

## Per-screen status

| Step | Endpoint(s) | Status | Notes |
|---|---|---|---|
| Step-up flow | `POST /step-up/request-code`, `POST /step-up/verify-code` (see handoff doc) | [x] built, **working** | Reusable hook + modal, not workspace-specific — see `docs/endpoints/auth.md`. First real call (2026-08-26) 500'd on a missing backend config (`FLOLYT_STEP_UP_CODE_TEMPLATE_ID`) — the user's backend team fixed it 2026-08-27, confirmed working end to end since on the markets save (request-code → email → verify-code → `PUT /markets`, all 200s). Revenue-model's step-up submit hasn't been live-tested yet — only its card-selection UI has (see step 2's row below). |
| 0 — Pre-workspace (no Figma source) | `POST /workspace`, `GET /currency/default`, `GET /slug-available` | [x] built | `/onboarding/start`, `src/pages/onboarding/start/index.tsx`; verified with `tsc --noEmit` + a Playwright pass (country search, Nigeria→states cascade, no console errors). **Updated 2026-08-26:** gained a "Workspace address" field (paired with Business name) — the whole workspace identity is now set here in one call, not split across two screens. Submit itself not tested against a real API yet since the address field was added. |
| 1 — Workspace (03) | `PUT /markets`, `GET /currency/supported`, `GET /proposed-markets` | [x] built, **verified live end to end** | `/onboarding/workspace`, `src/pages/onboarding/workspace/index.tsx`; markets-only, heading "Where you sell" (identity moved to screen 0, see "Decisions made so far"). 2026-08-27: fully completed live on the test account — request-code → email → verify-code → `PUT /markets`, all 200s, `GET /onboarding` afterward correctly showed `completedSteps: 1, resumeAt: "business_model"`. Navigates to `/onboarding/business-model` on success. |
| 2 — Business model (04) | `PUT /revenue-model` | [x] built, **UI verified, submit not yet tested** | `/onboarding/business-model`, `src/pages/onboarding/business-model/index.tsx`. Card selection, dynamic "what changes" panel, and dynamic button label all confirmed live in the browser. **The actual `PUT /revenue-model` step-up submit has NOT been exercised live** — only clicked between cards, never completed the confirm-code flow through to a real save. Do that before treating this step as fully proven. Defaults to Consumer pre-selected, matching the SVG's own drawn state. "What changes" copy for Account-based/Both is written to match Consumer's — the SVG only draws one state. No `/onboarding/data` yet, so Continue's success handler has nowhere further to send anyone (same TODO pattern step 1 had before step 2 existed). |
| 3 — Your data (05/06) | none documented yet | [ ] not started | connector list (Snowflake/Postgres/Stripe/...) isn't in `workspace.md` at all — likely belongs to the already-built Data Sources domain (`DATASOURCES` in `apiConfig.ts`) rather than a new onboarding-specific endpoint; screen 06's mapping table doesn't match `GET /mapping-quality`'s documented shape either. **Will ask before building** |
| 4 — Your agents (07) | `GET /agents` | [ ] not started | clean, no blockers |
| 5 — Team settings (08) | `GET /members`, `GET /roles`, `PUT /members/roles`, etc. | [ ] not started | not a wizard screen (see above); also no "send invite" endpoint documented anywhere yet — **will ask before building** |
