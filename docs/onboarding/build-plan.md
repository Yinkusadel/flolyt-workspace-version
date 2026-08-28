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
| 5 | Your team | *(no Figma source — see below)* | |

`08-invite-team-and-roles.svg` is drawn with the full permanent app sidebar and "Invite"/"Send
invite" buttons, not the wizard's stepper header and "Continue" button that every other screen
in this batch has — an earlier pass in this build read that as evidence step 5 is just a link out
to the regular Team settings page rather than a real wizard screen. **Corrected directly by the
user:** it genuinely is step 5 (`WizardStepper`'s own `STEPS` array has always listed 5 items) —
the only thing optional about it is *inviting* someone, not creating the team. Built at
`/onboarding/team` with its own stepper+chrome like every other step, from conversation only
(there's no usable Figma source for this exact shape) — see its row in "Per-screen status" below.

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
/onboarding/team              (step 5, no Figma source — create-team page; /onboarding/team/:teamId,
                                the invite/roster page a "Invite team member" button hands off to,
                                doesn't exist yet)
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
any `resumeAt` value that doesn't have a screen yet — update both constants together as steps
land. **Updated 2026-08-28** once `/onboarding/team` shipped: `team`/`your_team` keys added
(speculative — no real `resumeAt` value for team-creation observed yet) and
`LAST_BUILT_STEP_ROUTE` moved to `/onboarding/team`. Verified live: completing markets moved a
test account's `resumeAt` to `"business_model"`, and a fresh reload from `/` correctly landed on
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

## Cross-cutting: primary CTA button convention

**2026-08-28:** every primary "Continue"-style button across `/onboarding/*` (start, workspace,
business-model, data/mapping-view, agents) was unified to one canonical class after the user
flagged them as inconsistent (different heights, different width rules, one modal button
accidentally `rounded-full`):

```
className="h-10.5 w-full rounded-card bg-ink px-6 text-[13px] font-semibold text-paper hover:bg-ink/90 sm:w-auto"
```

Full width on mobile, auto-width from `sm:` up — confirmed explicitly by the user. Any secondary
button sharing a bottom bar with a primary CTA (e.g. mapping-view's "Check again"/"Connect new
source") should also be `w-full sm:w-auto` inside a `flex-col sm:flex-row` container so they stack
on mobile instead of squeezing into one row. **Use this class verbatim for any new onboarding
step's Continue button** rather than inventing a new size — see
[[flolyt_onboarding_button_convention]] in memory for the fuller rationale.

## Per-screen status

| Step | Endpoint(s) | Status | Notes |
|---|---|---|---|
| Step-up flow | `POST /step-up/request-code`, `POST /step-up/verify-code` (see handoff doc) | [x] built, **working** | Reusable hook + modal, not workspace-specific — see `docs/endpoints/auth.md`. First real call (2026-08-26) 500'd on a missing backend config (`FLOLYT_STEP_UP_CODE_TEMPLATE_ID`) — the user's backend team fixed it 2026-08-27, confirmed working end to end since on the markets save (request-code → email → verify-code → `PUT /markets`, all 200s). Revenue-model's step-up submit hasn't been live-tested yet — only its card-selection UI has (see step 2's row below). |
| 0 — Pre-workspace (no Figma source) | `POST /workspace`, `GET /currency/default`, `GET /slug-available` | [x] built | `/onboarding/start`, `src/pages/onboarding/start/index.tsx`; verified with `tsc --noEmit` + a Playwright pass (country search, Nigeria→states cascade, no console errors). **Updated 2026-08-26:** gained a "Workspace address" field (paired with Business name) — the whole workspace identity is now set here in one call, not split across two screens. Submit itself not tested against a real API yet since the address field was added. |
| 1 — Workspace (03) | `PUT /markets`, `GET /currency/supported`, `GET /proposed-markets` | [x] built, **verified live end to end** | `/onboarding/workspace`, `src/pages/onboarding/workspace/index.tsx`; markets-only, heading "Where you sell" (identity moved to screen 0, see "Decisions made so far"). 2026-08-27: fully completed live on the test account — request-code → email → verify-code → `PUT /markets`, all 200s, `GET /onboarding` afterward correctly showed `completedSteps: 1, resumeAt: "business_model"`. Navigates to `/onboarding/business-model` on success. |
| 2 — Business model (04) | `PUT /revenue-model` | [x] built, **UI verified, submit not yet tested** | `/onboarding/business-model`, `src/pages/onboarding/business-model/index.tsx`. Card selection, dynamic "what changes" panel, and dynamic button label all confirmed live in the browser. **The actual `PUT /revenue-model` step-up submit has NOT been exercised live** — only clicked between cards, never completed the confirm-code flow through to a real save. Do that before treating this step as fully proven. Defaults to Consumer pre-selected, matching the SVG's own drawn state. "What changes" copy for Account-based/Both is written to match Consumer's — the SVG only draws one state. No `/onboarding/data` yet, so Continue's success handler has nowhere further to send anyone (same TODO pattern step 1 had before step 2 existed). |
| 3 — Your data (05/06) | `GET /datasources`, `GET /datasources/connected`, `POST /datasources/test-connection`, `POST /datasources/connect`, `GET /workspace/data-map` (see `datasources.md`, `workspace.md`) | [x] built, **not yet verified live** | `/onboarding/data`, `src/pages/onboarding/data/`. Two sub-states, not sub-routes: `sources` (05 — searchable card grid off the real 49-item catalog, a "Popular" row for Snowflake/PostgreSQL/Stripe/Shopify per the SVG, and a desktop-only "what one source unlocks" rail whose four dots light up per the categories among the user's active connections) and `mapping` (06, **rebuilt 2026-08-28** once `GET /workspace/data-map` shipped — see that endpoint's entry in `workspace.md` for the full response shape and its rendering rules). `sources` header gains a "Show mapping" button once ≥1 active connection exists; `mapping` shows every connected source's tables flattened into one list (prefixed with the source name only when >1 source), with a "Connect new source" button back to the picker and Continue in the same bottom row. **`connected`/`ConnectionDetailPlaceholder` (the old per-source detail drill-in) and disconnect/reconnect are gone** — deleted `connected-list.tsx`, `connection-detail-placeholder.tsx`, `disconnect-source-modal.tsx`; there's no way to disconnect a source from onboarding anymore (still available in the built `/data-sources` section of the main app). The "fix the join" callout from `data-map`'s `flags` is deliberately **not** rendered — per the user, the backend may never have a real fix behind a given flag, so it waits until there's a confirmed action. Continue is disabled until `dataMap.state` clears `awaiting_analysis`/`nothing_connected` **and** at least one table has come back (mapping can take a moment after connecting) — a "Check again" button next to it calls the query's own `refetch()`. Continue fires `POST /onboarding/progress` with `kind: "ReviewedMapping"` before advancing to `/onboarding/agents` (which doesn't exist yet — see step 4 row below, this will land on a blank page until that ships); there is no "Skip for now" on this screen. The right rail on `mapping` ("what you can ask now") ticks 3 product questions or 2 payment questions (or all 5) based on which categories are actually connected — a `Set` of `.category` values off the active connections, checked for `"Payments"` vs. anything else — and shows a "connect the missing category" box only when one side is outstanding; "Connect Stripe next" opens `ConnectSourceModal` inline on this same page (not a navigation), "Connect a product source" sends back to the picker since there's no single named vendor to default to. Vendor logos still render via `cdn.simpleicons.org/{slug}` with an initial-letter fallback. No step-up gating on any of this. **Lesson learned:** a Radix `Tooltip` (built at `components/ui/tooltip.tsx` to show the full column list on hover over a truncated cell) visibly flickered open-then-closed under this app's Preact setup — same family of bug as [[preact_radix_dialog_crash]] (the `@radix-ui/react-presence` patch guards the crash but the ref-instanceof mismatch still breaks Presence's animation/exit-detection state machine). Deleted that primitive and replaced it with a dependency-free CSS `group-hover:opacity-100` tooltip instead — no ref, no JS state, can't glitch. Prefer that pattern over Radix Tooltip anywhere else in this app unless the crash is re-investigated. `tsc --noEmit` and `vite build` are both clean; not yet exercised against a real API from the browser (route is auth-gated, no test account with the right connected-source categories was available this session). **Fixed 2026-08-28:** the mapping table (`mapping-view.tsx`) used a fixed-pixel-column grid (`grid-cols-[1fr_110px_1fr_100px]`) unconditionally, which overflowed horizontally on any mobile viewport (user caught this live). Now the grid only applies from `sm:` up (640px+, columns narrowed to `90px`/`90px`); below that each row renders as a stacked block with inline field labels ("ROWS", "CONFIDENCE") instead of relying on a header row. Verified with a route-mocked `GET /workspace/data-map` (real API has no connected source on the test account) at 390px — no horizontal overflow — and at 1440px — desktop grid unaffected. **Second, deeper mobile bug found and fixed same day** — the user reported the page visibly "auto-zooming out" on a real phone even after the above fix. Root cause: the mapped-columns `<p className="truncate">` (a `white-space: nowrap` element) sat inside a `w-fit max-w-full` wrapper with no ancestor giving it a *definite* width on mobile (the row is `flex flex-col` there, not the `sm:grid` it is on desktop) — nowrap text with no definite containing width forces a large intrinsic/min-content size, and mobile Chromium/Safari respond to that by silently widening the whole page's layout viewport (`window.innerWidth` measured 943 instead of 390) and scaling the visual result down to fit, which reads as the page "zooming itself." Confirmed empirically with Playwright's `devices['iPhone 13']` profile (plain `viewport:{width:390}` without `isMobile:true` does **not** reproduce this — it's specific to real mobile viewport-following behavior) by bisecting with injected CSS overrides: forcing that one `<p>` to `white-space: normal` alone fixed `innerWidth` back to 390. Fix: `truncate` (and its hover tooltip, unreachable on touch anyway) now only apply from `sm:` up, where the grid gives the cell a definite track width to truncate against; on mobile the full column list just wraps onto multiple lines. See the lesson in `flolyt_onboarding_build.md` — any other `truncate` used inside a `flex-col`/`w-fit` mobile layout elsewhere in this app should be checked against the same pattern. |
| 4 — Your agents (07) | `GET /agents`, `POST /onboarding/progress` (`AcknowledgedAgents`) | [x] built, **verified live end to end** | `/onboarding/agents`, `src/pages/onboarding/agents/`. Read-only readiness grid, no step-up gating. 2026-08-28: full live pass on the test account — 13-agent grid rendered correctly (12 `not_ready`, 1 `ready` — Master Orchestrator, which reads no entities and shows "always on" instead of an empty reads list), Continue fired `AcknowledgedAgents` (200, "Progress saved.") and navigated to `/`. **Caught and fixed a wrong type guess this pass:** `needs`/`wouldUnlock` are single free-text strings, not `string[]` — see `docs/endpoints/workspace.md`'s corrected entry. `RESUME_STEP_ROUTES`/`LAST_BUILT_STEP_ROUTE` in `protected-route.tsx` updated per the standing rule (`agents`/`your_agents` → `/onboarding/agents`, fallback then `/onboarding/agents`). **Updated 2026-08-28 (later):** now that `/onboarding/team` exists, Continue's target was changed to `/onboarding/team` (was `/`) — `ProtectedRoute`'s guard is still what actually decides where an unfinished account lands regardless of this client-side target, confirmed live pre-change that it correctly bounces an account with an *actually* unfinished earlier step (this test account's own business-model step was UI-tested but never step-up-submitted — see step 2's row) back to `/onboarding/business-model` rather than trusting client-side navigation. **Fixed same day, second pass** after the user caught it live at a wide viewport: the page had no height bound, so a 13-card grid plus the bottom callout+button pushed past the viewport with no scroll affordance — wrapped in the same `md:h-[calc(100dvh-62px)] md:overflow-hidden` + inner `md:overflow-y-auto` pattern `OnboardingDataRoute` already uses, header/footer pinned, only the grid scrolls. Also fixed the loading state showing a false "Every agent is ready" title (computed from `notReadyCount ?? 0` before data arrived) — now shows a skeleton bar instead. |
| 5 — Your team (no Figma source) | `POST /teams`, `GET /teams`, `GET /teams/{teamId}`, `POST /{teamId}/invitations`, `POST /{teamId}/invitations/resend`, `DELETE /invitations/{invitationId}` (see `docs/endpoints/teams.md`, all 13 endpoints wired 2026-08-28) | [x] both pages built 2026-08-28, **not yet live-verified** | Built step by step, per the user's own explicit instructions each time (no Figma source works for this shape). **Piece 1 — `/onboarding/team`, `src/pages/onboarding/team/index.tsx`:** header + "Create team" button (always visible, top — a workspace isn't capped at one team, so it stays even once teams exist) + a right-rail "what creating a team does" aside matching the data step's `WhatSourceUnlocks`/`WhatYouCanAskNow` pattern, a `CreateTeamModal` (name + optional description, `useCreateTeam`), and a card per existing team (name/description/created date + "Invite team member" button). **Piece 2 — `/onboarding/team/:teamId`, `team-detail-route.tsx`:** a "Back to teams" link back to `/onboarding/team`, an "Invite member" button opening `InviteMemberModal` (email + role checkboxes off `USER_ROLES`, via `useInviteTeamMember`), a Members table (name/email/role chips/joined date/active-status chip) and an Invitations table (email/role chips/status chip/invited/expires/actions) off `GET /teams/{teamId}` (members+invitations in one call, no separate paginated invitations query used). Resend/Revoke buttons render only for a `status.toLowerCase() === "pending"` invitation — accepted/expired/revoked ones show no actions. **Updated 2026-08-28 (later):** `inviteTeamMemberSchema` (`src/validators/teams.ts`) gained a work-email `.refine()` — `PERSONAL_EMAIL_DOMAINS`, a best-effort mirror of common consumer providers (Gmail, Yahoo, Outlook, iCloud, etc.), not the backend's actual disallow list, which isn't published — so the invite form now rejects an obvious personal address inline before the request fires. `resendTeamInvitationSchema` shares the same schema but resend never runs it (the hook mutates directly with the invitation's own already-accepted email, no form/resolver involved), so this only affects the invite modal. `OnboardingAgentsRoute`'s `goToNextStep` targets `/onboarding/team` (changed from `/` the same day step 5's first piece shipped). **Updated 2026-08-28 (later still):** the "Back to teams" link moved to the bottom of `team-detail-route.tsx`, styled as the canonical primary-CTA button (see "Cross-cutting: primary CTA button convention" above) instead of a small top-of-page arrow link, per the user's direct request. **Also fixed the same pass — a real bug the user caught live:** `useResendTeamInvitation`/`useRevokeTeamInvitation`'s `isPending` is one shared boolean per hook instance, so with a single hook instance driving every row in the Invitations table, clicking Resend or Revoke on any one row disabled the Resend/Revoke buttons on *every* row, not just that one. Fixed by having both hooks also return `variables` (the mutation's own last-called arguments, from React Query) — the table now computes `isThisResending`/`isThisRevoking` per row by matching `resendVariables?.email`/`revokeVariables` against that row's invitation, so only the row actually being acted on shows a disabled/"...ing" state. `tsc --noEmit` and `vite build` both clean; signed-out Playwright passes against both `localhost:3000/onboarding/team` and `.../team/:teamId` confirmed correct redirects to `/auth/sign-in` with zero console errors — the actual create/list/invite/resend/revoke flow needs a real session, which this sandbox can't reach against the live backend host (see [[flolyt_onboarding_build]] lesson 9). |
