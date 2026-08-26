# Workspace endpoints

Part of the onboarding flow. See [docs/endpoints/README.md](README.md) for the entry format
and workflow.

Base path: `/api/flolyt/workspace` → `WORKSPACE_BASE_URL` / `API_ENDPOINTS.WORKSPACE` in
[`src/config/apiConfig.ts`](../../src/config/apiConfig.ts).

Status legend: **documented** (recorded here, not wired) → **wired** (service/hook built, no UI
yet) → **verified working** (tested against real API from a screen).

All endpoints require `Authorization: Bearer` unless noted. Envelope is the standard
`{ data, messages, succeeded }` shape.

Zod validators for the ones with a body live in
[`src/validators/workspace.ts`](../../src/validators/workspace.ts).

## Endpoints

### POST /api/flolyt/workspace

- **Purpose:** Creates the workspace during onboarding (the registration step).
- **Auth:** Authenticated (caller already signed in; login returns `onboardingRequired: true`
  when a user has no workspace yet). Owner comes from the token, **not** the body — no `userId`
  field, deliberately, since a body-supplied owner on an anonymous endpoint would let anyone
  create a workspace owned by any known user id.
- **Request:** `name`, `description`, `phoneNumber` (nullable), `email`, `jobRole`,
  `employeeCountRange`, `location`, `city`, `state`, `zipCode` (nullable), `country`,
  `timeZoneId`, `currency`, `webSite` (nullable).
- **Response:** `data` = workspace id (uuid string).
- **Used by:** `services/api/workspace/create-workspace.ts`, `features/workspace/use-create-workspace.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** Frame 006's actual setup step 1 is `PUT /identity` (naming + claiming the
  address) — this endpoint is the earlier registration-time create.

### PUT /api/flolyt/workspace/identity

- **Purpose:** Names the workspace and claims its address — frame 006's identity panel, setup
  step 1.
- **Auth:** Administrator only.
- **Request:** `name` (string, required), `slug` (string, required), `timeZoneId` (string,
  required).
- **Response:** `data`: `{ workspaceId, name, slug, timeZoneId }`.
- **Used by:** `services/api/workspace/update-workspace-identity.ts`, `features/workspace/use-update-workspace-identity.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** `slug` is a DNS label — lowercase letters/digits/hyphens, 3–63 chars — and is
  accepted **once**. Changing it later breaks every link already sent, so re-addressing must be
  a separate operation with a redirect behind it; a second call with a different slug is
  refused, not silently ignored. Reserved addresses are refused (`api`, `www`, `cdn` because
  Flolyt routes them; others because `{slug}.flolyt.com`-style addresses could send mail that
  reads as us). Markets + reporting currency are on the same setup screen visually but are set
  through `PUT /markets` instead (step-up gated — see that entry).

### GET /api/flolyt/workspace/slug-available

- **Purpose:** Live availability check under frame 006's URL field.
- **Auth:** authenticated.
- **Request:** query param `slug` (string, required).
- **Response:** `data`: `{ slug, isAvailable, reason (nullable), suggestion (nullable) }`.
- **Used by:** `services/api/workspace/get-slug-available.ts`, `features/workspace/use-slug-available.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** Returns *why not* when unavailable — "taken" vs "too short" send the user to
  different next actions. Suggests a numbered variant when the slug is taken and one's free
  nearby. **Advisory only** — two callers can both get `isAvailable: true` in the same second;
  the unique index behind `PUT /identity` is the actual arbiter, so still handle a 400 from that
  call.

### PATCH /api/flolyt/workspace/analyze

- **Purpose:** Runs the AI website analysis that pre-fills setup, against the caller's **own**
  workspace only.
- **Auth:** authenticated.
- **Request:** no body (deliberately — it used to take `companyId`, which let any caller point
  it at any workspace and spend AI credit writing a profile onto it).
- **Response:** `data` = the workspace profile object: `companyId`, `name`, `website`
  (nullable), `industry`, `businessModel`, `monetizationModel`, `targetAudience`,
  `geographicFocus`, `companySize`, `brandTone`, `primaryProduct` (nullable),
  `missionStatement` (nullable), `primaryUserActions` (string[]), `revenueDriver`, `currency`
  (nullable).
- **Used by:** `services/api/workspace/analyze-workspace.ts`, `features/workspace/use-analyze-workspace.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** The profile this writes is what `GET /proposed-markets` reads to suggest markets,
  and what grounds campaign generation downstream. The hook invalidates both the profile and
  proposed-markets query caches on success.

### GET /api/flolyt/workspace/profile

- **Purpose:** Reads the AI-analysed workspace profile used to ground campaign generation.
- **Auth:** authenticated.
- **Response:** same shape as `PATCH /analyze`'s response `data`.
- **Used by:** `services/api/workspace/get-workspace-profile.ts`, `features/workspace/use-get-workspace-profile.ts`. No screen wired yet.
- **Status:** wired

### PUT /api/flolyt/workspace/profile

- **Purpose:** Updates the workspace profile — free-text descriptive fields.
- **Auth:** authenticated (role unspecified in doc).
- **Request:** `name` (required), plus nullable: `city`, `state`, `country`, `timeZoneId`,
  `brandTone`, `website`, `industry`, `businessModel`, `monetizationModel`, `revenueDriver`,
  `missionStatement`, `primaryProduct`, `primaryUserActions` (string[]), `targetAudience`,
  `geographicFocus`, `companySize`, `currency`.
- **Response:** `data` = boolean.
- **Used by:** `services/api/workspace/update-workspace-profile.ts`, `features/workspace/use-update-workspace-profile.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** Distinct from `PUT /revenue-model` — that one is a closed vocabulary the product
  branches on; this is free text, never branched on.

### GET /api/flolyt/workspace/proposed-markets

- **Purpose:** Markets to pre-tick on the setup screen — proposed, never applied.
- **Auth:** authenticated.
- **Response:** `data`: `{ proposals: [{ countryCode, currencyCode, source, isCertain }],
  primaryMarketCountry, reportingCurrency, declared, analysisAvailable, geographicFocus
  (nullable) }`.
- **Used by:** `services/api/workspace/get-proposed-markets.ts`, `features/workspace/use-get-proposed-markets.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** Nothing here changes the workspace — `PUT /markets` is what declares them. The
  workspace's own country is always proposed and always first (the one certain market, so this
  step works with no website / a failed or slow scrape). `analysisAvailable: false` just means
  no site has been analysed yet — analysis is an accelerant, never a prerequisite. `source` is
  `workspace_country` | `website_analysis` | `declared`; `isCertain` is true **only** for the
  workspace's own country, since everything read from AI prose is a guess about where a
  business *sells*, inferred from where it *markets* — render both so the UI can distinguish an
  inference from a fact the user already gave. `declared: true` means markets already exist, so
  proposals become a *comparison*, not a starting point — must not overwrite existing choices
  with a fresh scrape. Countries whose currency Flolyt can't report in are **omitted**, not
  offered disabled.

### PUT /api/flolyt/workspace/markets

- **Purpose:** Declares where this workspace sells — frame 03's markets panel.
- **Auth:** Administrator only, **step-up gated** (`stepUpChallengeId`).
- **Request:** `markets` (array of `{ countryCode, currencyCode (nullable) }`, required, or
  null), `primaryMarketCountry` (string, required), `reportingCurrency` (nullable string,
  required key — pass `null` explicitly), `stepUpChallengeId` (nullable uuid).
- **Response:** `data` = integer (count, presumably markets saved).
- **Used by:** `services/api/workspace/update-workspace-markets.ts`, `features/workspace/use-update-workspace-markets.ts`. No screen wired yet.
- **Status:** wired (service/hook only — ⚠️ **cannot actually be called successfully yet**, see notes)
- **Notes:** ⚠️ This is one of the [[flolyt_governance_stepup_reminder]] step-up endpoints —
  needs the step-up confirmation flow that was deliberately skipped during the auth rebuild. The
  hook accepts a `stepUpChallengeId` but nothing in this codebase produces one yet — a UI can't
  actually complete this call until that flow exists. Replaces the **whole set** every call
  (primary market must be one of the set; dropping a market that's still primary would strand
  the fallback — the zod schema also refuses this client-side). A market's currency is validated
  against what Flolyt can *report* in — a superset of what it can *bill* in (e.g. NGN-billed
  tenant selling to GHS customers, no Flolyt payment rail for that). Omit a market's currency
  and the country's usual currency is used. `reportingCurrency` may be `null`, independent of
  billing currency, to keep roll-ups in the tenant's billing currency. Figures are never
  blended across markets anywhere in the product (leakage map, workspace home, lifecycle map
  all report per-currency).

### PUT /api/flolyt/workspace/revenue-model

- **Purpose:** Sets how the workspace makes money — `consumer` | `account_based` | `both` —
  frame 007.
- **Auth:** step-up gated (`stepUpChallengeId`).
- **Request:** `revenueModel` (string, required), `stepUpChallengeId` (nullable uuid).
- **Response:** `data` = uuid string.
- **Used by:** `services/api/workspace/update-revenue-model.ts`, `features/workspace/use-update-revenue-model.ts`. No screen wired yet.
- **Status:** wired (service/hook only — ⚠️ **cannot actually be called successfully yet**, see notes)
- **Notes:** ⚠️ Another [[flolyt_governance_stepup_reminder]] step-up endpoint — same
  no-step-up-flow-yet caveat as `PUT /markets` above. Selects the entire leakage vocabulary
  (rows/conditions/agent questions) — changing it **discards** the grid built under the old
  model rather than converting it. Distinct from the AI-derived `businessModel` free-text field
  on the profile, which can't be branched on.

### GET /api/flolyt/workspace/lifecycle-thresholds

- **Purpose:** The workspace's lifecycle windows — frame 008. Single source of truth every
  "slipping"/"active"/"lapsed" label across the product reads from.
- **Auth:** authenticated.
- **Response:** `data`: `{ activeWithinDays, slippingWithinDays, reactivationDormantDays,
  repeatCustomerOrders, repeatCustomerWindowDays, isDefault, updatedAtUtc (nullable) }` — all
  ints except the bool/date.
- **Used by:** `services/api/workspace/get-lifecycle-thresholds.ts`, `features/workspace/use-get-lifecycle-thresholds.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** `isDefault` distinguishes a workspace that deliberately configured these from one
  that never has.

### PUT /api/flolyt/workspace/lifecycle-thresholds

- **Purpose:** Sets the definitions frame 008 collects.
- **Auth:** authenticated (role unspecified).
- **Request:** `activeWithinDays` (int/string, required), `slippingWithinDays` (required),
  `reactivationDormantDays`, `repeatCustomerOrders`, `repeatCustomerWindowDays` — last three
  nullable/optional.
- **Response:** `data` = uuid string.
- **Used by:** `services/api/workspace/update-lifecycle-thresholds.ts`, `features/workspace/use-update-lifecycle-thresholds.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** `activeWithinDays` doubles as both "Active within" AND "Slipping after" (one
  boundary read from either side). `slippingWithinDays` is "Lapsed after". `reactivationDormantDays`
  is how long someone must be quiet before a new order reads as a *return* rather than ordinary
  activity. `repeatCustomerOrders` + `repeatCustomerWindowDays` express "N+ orders in M days".
  **The last three optional fields: `null` means "keep current value"** — the hook always sends
  all three keys (defaulting unset ones to `null`), never omits them, so an older client can't
  accidentally blank a threshold. Changing any of these reclassifies the whole customer base on
  next refresh. Server refuses the write if: lapsed boundary ≤ active window (would make
  "slipping" unreachable), reactivation dormancy ≤ active window (every repeat purchase would
  read as a return), or repeat-customer count < 2 — the zod schema in
  `validators/workspace.ts` mirrors all three rules so the form can show the real problem
  instead of round-tripping a 400.

### GET /api/flolyt/workspace/members

- **Purpose:** Unified roster — people and agents in one list, each addressed as
  `human:{id}` or `agent:{key}`.
- **Auth:** authenticated.
- **Response:** `data` = array of `{ ref, kind (Human/...), id, key (nullable), displayName,
  email (nullable), avatarUrl (nullable), accentColor (nullable), domain (nullable),
  functionalRoles: [{value, description}], spendCeiling (nullable), canAdminister (nullable),
  accessLevel, writeModes (map), isActive }`.
- **Used by:** `services/api/workspace/get-workspace-members.ts`, `features/workspace/use-get-workspace-members.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** Deactivated members are included, flagged `isActive: false` — so historical
  attributions still resolve. Don't filter them out client-side by default.

### GET /api/flolyt/workspace/roles

- **Purpose:** The functional roles assignable in this workspace — frame 016's role ladder.
- **Auth:** authenticated.
- **Response:** `data` = array of `{ value, description }`.
- **Used by:** `services/api/workspace/get-workspace-roles.ts`, `features/workspace/use-get-workspace-roles.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** This is just the vocabulary. What each role may *approve* is separate governance
  policy, not returned here.

### GET /api/flolyt/workspace/members/me/roles

- **Purpose:** Functional roles assigned to the calling user.
- **Auth:** authenticated.
- **Response:** `data`: `{ userId, userName, roles: [{value, description}] }`.
- **Used by:** `services/api/workspace/get-my-roles.ts`, `features/workspace/use-get-my-roles.ts`. No screen wired yet.
- **Status:** wired

### GET /api/flolyt/workspace/members/{userId}/roles

- **Purpose:** Functional roles assigned to a specific member.
- **Auth:** authenticated.
- **Request:** path param `userId` (uuid, required).
- **Response:** same shape as `/members/me/roles`.
- **Used by:** `services/api/workspace/get-member-roles.ts`, `features/workspace/use-get-member-roles.ts`. No screen wired yet.
- **Status:** wired

### PUT /api/flolyt/workspace/members/roles

- **Purpose:** Assign functional roles to a member.
- **Auth:** admin-only.
- **Request:** `functionalRoles` (string[], required), `userId` (uuid, required).
- **Response:** `data` = uuid string.
- **Used by:** `services/api/workspace/assign-member-roles.ts`, `features/workspace/use-assign-member-roles.ts`. No screen wired yet.
- **Status:** wired

### DELETE /api/flolyt/workspace/members/roles

- **Purpose:** Remove a single functional role from a member.
- **Auth:** admin-only.
- **Request:** `functionalRole` (string, required), `userId` (uuid, required).
- **Response:** `data` = boolean.
- **Used by:** `services/api/workspace/remove-member-role.ts`, `features/workspace/use-remove-member-role.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** Same path as the PUT above but singular `functionalRole` (not the array) — easy to
  mix up; kept as two separate service files/hooks on purpose to keep the payload shapes distinct.

### GET /api/flolyt/workspace/agents

- **Purpose:** The 13 specialist agents and what each can answer today — frame 014.
- **Auth:** authenticated.
- **Response:** `data`: `{ totalCount, readyCount, readingCount, notReadyCount, agents: [{
  key, initials, name, description, state, reads (string[]), needs (nullable),
  wouldUnlock (nullable), moreDaysNeeded (nullable), persona }] }`.
- **Used by:** `services/api/workspace/get-workspace-agents.ts`, `features/workspace/use-get-workspace-agents.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** Readiness is computed from the **entities** a specialist reads, not named
  connectors — e.g. Support Signal needs "tickets", which could live in the workspace's own
  Postgres, so a connector-based check would wrongly say `not_ready`. `needs` is phrased in
  entity terms ("a helpdesk", "product events"), not connector names. A specialist needs **all**
  its entities, not any — "half answer" still reads `not_ready`. `reads` is empty when not
  ready (listing what it *would* read implies an ability it doesn't have yet). Some
  requirements are column-level, not table-level (e.g. Involuntary Churn needs a
  payment-status column; Acquisition Quality needs a UTM/referrer/signup-channel column, since
  campaign-results tables describe Flolyt's own sends, not where a customer came from). Three
  states: `not_ready`, `reading` (nothing missing/wrong, just not enough history yet —
  `moreDaysNeeded` counts down; history is measured in **business time**, so 5 years of
  backfilled customers imported yesterday still counts as 5 years), `ready`. **Advocacy** and
  **Release Impact** are always `not_ready` on every workspace — they need referral/deploy
  sources this product doesn't model at all; no connection fixes them, don't build a "connect
  to unlock" CTA for those two.

### GET /api/flolyt/workspace/onboarding

- **Purpose:** Where workspace setup stands — frame 017's checklist, and what "save and finish
  later" resumes into.
- **Auth:** authenticated.
- **Response:** `data`: `{ started, finished, completedSteps, totalSteps, resumeAt,
  lastTouchedAtUtc (nullable), stalledForDays (nullable), steps: [{ step, isComplete,
  satisfiedAtUtc (nullable), outstanding (string[]) }] }`.
- **Used by:** `services/api/workspace/get-onboarding-status.ts`, `features/workspace/use-get-onboarding-status.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** Steps are **derived from real state** wherever possible (workspace step complete
  because markets exist; business-model step complete because a revenue model was chosen) —
  only two acts that leave no other trace are recorded as flags: checking the mapping, meeting
  the agents (see `POST /onboarding/progress`). No stored flag for the rest, so e.g. deleting a
  workspace's markets correctly un-ticks that step. `resumeAt`: the last-opened step if it's
  still outstanding, else the first incomplete one (never resumes into finished work).
  `stalledForDays`: gap since onboarding last touched, `null` once finished. Finishing does
  **not** hide what's still outstanding — don't treat `finished: true` as "nothing left to
  show". This query's key (`workspace-onboarding-status`) is what every mutation hook above
  invalidates when it changes something the checklist derives from.

### GET /api/flolyt/workspace/mapping-quality

- **Purpose:** What's wrong with the data mapping — frame 012, behind onboarding's "check the
  mapping" step.
- **Auth:** authenticated.
- **Response:** `data`: `{ state, flags: [{ key, mapping, consequence, fix (nullable), entity,
  isMeasured }], contributingSourceCount, analysedSourceCount, reviewedAtUtc (nullable) }`.
- **Used by:** `services/api/workspace/get-mapping-quality.ts`, `features/workspace/use-get-mapping-quality.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** `state` is computed server-side, not left for the client to infer from an empty
  flags list — 4 distinct states that need 4 distinct screens: `nothing_connected` (no sources
  to inspect), `awaiting_analysis` (sources exist, none analysed yet), `clean` (analysed,
  sound), `flagged` (analysed, something's wrong). **Only `clean` is good news** — don't treat
  an empty `flags` array alone as "all good", check `state` first. Render a flag's
  `consequence`, not its `key` — "your data is imperfect" is noise the user already knows.
  `isMeasured` separates a counted rate from the warehouse's own nullable declaration — don't
  present both with equal confidence in UI. `fix` is `null` when nothing the tenant can do would
  clear it (don't render an empty "fix" CTA in that case). `analysedSourceCount <
  contributingSourceCount` means the flags list is known-incomplete — surface that. `reviewedAtUtc`
  is `null` while the onboarding step is still outstanding.

### POST /api/flolyt/workspace/onboarding/progress

- **Purpose:** Saves onboarding progress (the "acts that leave no other trace" from
  `GET /onboarding`).
- **Auth:** authenticated.
- **Request:** `kind` (enum, required): `ViewedStep` | `ReviewedMapping` | `AcknowledgedAgents` |
  `Finished`; `step` (nullable string, required key).
- **Response:** `data` = null.
- **Used by:** `services/api/workspace/save-onboarding-progress.ts`, `features/workspace/use-save-onboarding-progress.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** Only call this for what nothing else can tell the server — naming the workspace,
  declaring markets, choosing a revenue model, connecting a source are all visible in real
  state and must **never** be posted here as progress events. `ViewedStep` doubles as the resume
  hint and the activity clock (drives `resumeAt`/`stalledForDays`). Record is created on first
  contact — a workspace that never opens setup reports `started: false` rather than an empty
  record. The hook is silent by design (no toast) — it's meant to fire on step views, not
  user-initiated submits.

## Wiring notes (2026-08-26)

All 21 service files (`src/services/api/workspace/`) and hook files (`src/features/workspace/`)
are built and typecheck clean (`npx tsc --noEmit -p tsconfig.app.json`). Zod schemas are in
`src/validators/workspace.ts`. `API_ENDPOINTS.WORKSPACE` added to `src/config/apiConfig.ts`.

**No screen wires any of this in yet** — the onboarding UI itself doesn't exist (per the comment
in `src/features/auth/use-verify-login-code.ts`: "No onboarding UI exists yet — everyone lands
on the dashboard for now"). This is API-layer-first: hooks are ready for whichever screen gets
built against them next.

**Known gap, not a bug:** `PUT /markets` and `PUT /revenue-model` are step-up gated
(`stepUpChallengeId`), and the step-up challenge flow was deliberately skipped during the auth
rebuild ([[flolyt_governance_stepup_reminder]]). Their hooks exist and typecheck, but nothing in
this codebase can produce a valid `stepUpChallengeId` yet, so a UI built against them today would
get a 400 on submit. Build the step-up flow before wiring a screen to either of these.

## Missing

_None flagged yet — this batch covered all 21 endpoints listed in the Workspace group's index._
