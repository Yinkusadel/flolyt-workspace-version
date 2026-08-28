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
  `timeZoneId`, `currency`, `webSite` (documented nullable, **actually required — see note**),
  `slug` (nullable), `createSeparately` (boolean).
- **Response:** `data` = workspace id (uuid string). `409` on a taken/reserved `slug` — the whole
  request fails and writes nothing.
- **Used by:** `services/api/workspace/create-workspace.ts`, `features/workspace/use-create-workspace.ts`, wired to `/onboarding/start` (the missing pre-workspace screen — see `docs/onboarding/build-plan.md`).
- **Status:** wired
- **Notes:** Frame 006's actual setup step 1 is `PUT /identity` (claiming the address) — this
  endpoint is the earlier registration-time create. **Updated 2026-08-26:** `slug` is now
  optional here too — supply it to create and address the workspace in one call, or omit it
  (send `null`) and claim an address later via `PUT /identity`. **This app does the former as of
  the same day** — the "Workspace address" field lives on this pre-workspace screen, paired with
  Business name, with its own live `GET /slug-available` check — rather than on a later
  onboarding screen. `createSeparately` **meaning not confirmed** — the API doc's own curl
  example sends `true` with no explanation; this app matches that but flag to the backend team
  before trusting it. **`webSite` — 2026-08-27:** the API doc marks this nullable, but the
  backend team confirmed that's a documentation mistake and it's actually required. Enforced
  client-side (`validators/workspace.ts`'s `websiteSchema` — required, must be a full URL
  including protocol) ahead of the doc being corrected upstream.

### PUT /api/flolyt/workspace/identity

- **Purpose:** Claims the workspace's address — frame 006's identity panel, setup step 1.
- **Auth:** Administrator only.
- **Request:** `slug` (string, required). **Updated 2026-08-26 — `name` and `timeZoneId` no
  longer accepted here.** They used to be settable on this same call; the API doc now says
  they're "creation's and `PUT /profile`'s" instead, since three writers for one field made this
  endpoint hard to tell apart from creation.
- **Response:** `data`: `{ workspaceId, name, slug, timeZoneId }`.
- **Used by:** `services/api/workspace/update-workspace-identity.ts`, `features/workspace/use-update-workspace-identity.ts`. **Not used by onboarding as of 2026-08-26** — the address is now collected on `/onboarding/start` and sent through `POST /workspace`'s own `slug` field instead, since re-collecting name/timezone/address a second time on screen 03 (this endpoint's original onboarding use) had no product reason once name+timezone were already captured at creation. Kept wired for a future settings screen that needs to re-address an existing workspace (workspaces created before addresses existed have no other route to getting one).
- **Status:** wired
- **Notes:** `slug` is a DNS label — lowercase letters/digits/hyphens, 3–63 chars — and is
  accepted **once**. Changing it later breaks every link already sent, so re-addressing must be
  a separate operation with a redirect behind it; a second call with a different slug is
  refused, not silently ignored. Reserved addresses are refused (`api`, `www`, `cdn` because
  Flolyt routes them; others because `{slug}.flolyt.com`-style addresses could send mail that
  reads as us).

### GET /api/flolyt/workspace/slug-available

- **Purpose:** Live availability check under the address field.
- **Auth:** authenticated.
- **Request:** query param `slug` (string, required).
- **Response:** `data`: `{ slug, isAvailable, reason (nullable), suggestion (nullable) }`.
- **Used by:** `services/api/workspace/get-slug-available.ts`, `features/workspace/use-slug-available.ts`, wired to `/onboarding/start` (the "Workspace address" field) as of 2026-08-26 — moved from screen 03 when the address field itself moved.
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
- **Used by:** `services/api/workspace/update-workspace-profile.ts`, `features/workspace/use-update-workspace-profile.ts`. No screen wired yet — briefly wired into onboarding screen 03 for name/timezone re-entry, then removed the same day once we realized name and timeZoneId are already captured at creation (`POST /workspace`) and don't need asking for again mid-onboarding. Still useful for a later, real settings screen.
- **Status:** wired
- **Notes:** Distinct from `PUT /revenue-model` — that one is a closed vocabulary the product
  branches on; this is free text, never branched on.

### GET /api/flolyt/workspace/proposed-markets

- **Purpose:** Markets to pre-tick on the setup screen — proposed, never applied.
- **Auth:** authenticated.
- **Response:** `data`: `{ proposals: [{ countryCode, currencyCode, source, isCertain }],
  primaryMarketCountry, reportingCurrency, declared, analysisAvailable, geographicFocus
  (nullable) }`.
- **Used by:** `services/api/workspace/get-proposed-markets.ts`, `features/workspace/use-get-proposed-markets.ts`, wired to `/onboarding/workspace` (onboarding step 1, screen 03).
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
- **Used by:** `services/api/workspace/update-workspace-markets.ts`, `features/workspace/use-update-workspace-markets.ts`, wired to `/onboarding/workspace` (onboarding step 1, screen 03), gated behind `src/components/step-up-confirm-modal.tsx` + `use-step-up-confirmation`.
- **Status:** verified working — full step-up round trip (request-code → email → verify-code →
  this call) confirmed live 2026-08-27 on the test account, all 200s
- **Notes:** This is one of the [[flolyt_governance_stepup_reminder]] step-up endpoints. The
  step-up confirmation flow (request/verify emailed code) that was deliberately skipped during the
  auth rebuild is now built and confirmed working end to end — see
  `src/features/auth/use-step-up-confirmation.ts` and `flolyt-extras/auth-frontend-handoff.md`'s
  "Step-up confirmation" section. Replaces the **whole set** every call
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
- **Used by:** `services/api/workspace/update-revenue-model.ts`, `features/workspace/use-update-revenue-model.ts`, wired to `/onboarding/business-model` (onboarding step 2, screen 04) as of 2026-08-27.
- **Status:** wired
- **Notes:** Selects the entire leakage vocabulary (rows/conditions/agent questions) — changing it
  **discards** the grid built under the old model rather than converting it. Distinct from the
  AI-derived `businessModel` free-text field on the profile, which can't be branched on. No
  discard-confirmation UI on the onboarding screen — that only matters for an *existing* workspace
  changing an already-set model, never a first-time pick with nothing built yet to discard; add
  one if this endpoint is ever reused on a real settings page. Step-up flow itself is now
  confirmed working end to end (see [[flolyt_governance_stepup_reminder]] and
  `docs/endpoints/auth.md`), so this was buildable for the first time this session.

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
  key, initials, name, description, state, reads (string[]), needs (string, nullable),
  wouldUnlock (string, nullable), moreDaysNeeded (nullable), persona }] }`.
- **Used by:** `services/api/workspace/get-workspace-agents.ts`,
  `features/workspace/use-get-workspace-agents.ts`, `/onboarding/agents`
  (`src/pages/onboarding/agents/`).
- **Status:** verified working
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
  to unlock" CTA for those two. **Corrected 2026-08-28, live-verified against the test
  account:** `needs` and `wouldUnlock` are single free-text sentences (e.g. `"payments or
  orders"`, `"a sentiment source — NPS, CSAT or survey responses over time are not modelled"`),
  **not** `string[]` as originally guessed — render directly, don't `.join()`. Master
  Orchestrator comes back `ready` with `reads: []` and `needs: null` (it doesn't read entities,
  it's ready by definition) — the UI shows "always on" for that case rather than an empty
  string. A fresh workspace with no datasources connected returns 12 of 13 agents `not_ready`
  and only Master Orchestrator `ready`, confirming the whole-entity gating described above.

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
  invalidates when it changes something the checklist derives from. **Confirmed live
  2026-08-29:** a 5th step, `team`, exists in `steps` (key confirmed as the plain string
  `"team"`, not `"your_team"`) — derived from real state like the others (`isComplete: false`
  with `outstanding: ["Invite someone"]` until an invitation is actually sent), **not** flipped
  by posting `kind: "Finished"`. That progress event only sets the top-level `finished` flag —
  observed going `true` while `team`'s own `isComplete` stayed `false`, exactly per this note's
  own "don't treat finished as nothing outstanding" warning. `ProtectedRoute` only reads
  `finished`, so this doesn't block app entry; it's the mechanism a future in-app "invite your
  team" nudge would read from, if one gets built.

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

### GET /api/flolyt/workspace/data-map

- **Purpose:** Everything the onboarding "Your data" step renders in one call: each connected
  source, the tables it found, what each was mapped to and from which columns, the confidence,
  a summary, and the same `flags`/`state` `/mapping-quality` returns. Assembled server-side
  because it was three call shapes across two prefixes with a per-source fan-out, to fill one
  table and one callout.
- **Auth:** authenticated.
- **Response:** `data`: `{ state, sources: [{ datasourceId, name, type, connectionStatus,
  isReading, lastSyncedAt (nullable), tables: [{ tableName, rowCount, mappedTo (nullable),
  mappedColumns, confidence, confidenceBand (nullable: high/medium/low), countsTowardCapability
  }] }], summary: { sourceCount, analysedSourceCount, tableCount, mappedTableCount,
  unmappedTableCount, lowConfidenceTableCount, uncountedTableCount, totalRows, entitiesCovered,
  entitiesMissing }, flags: [{ key, mapping, consequence, fix (nullable), entity, isMeasured }],
  reviewedAtUtc (nullable) }`.
- **Used by:** `services/api/workspace/get-data-map.ts`, `features/workspace/use-get-data-map.ts`,
  `pages/onboarding/data/mapping-view.tsx` (onboarding step 3's "mapping" sub-state, behind the
  "Show mapping" button on 05).
- **Status:** wired, screen built
- **Notes:** `mappedTo: null` means the table was not mapped — render the row, don't hide it: an
  ignored table is what tells a reader whether the mapping missed something that matters.
  `mappedColumns` is only the columns carrying the mapping (the subtitle under the entity name).
  `confidenceBand` is banded server-side so two surfaces can't draw the line differently;
  `confidence` carries the raw score for anything that wants its own threshold. A `low` band
  means the mapping was made but not counted toward capability, so a table can show
  `mappedTo: "Subscription"` while `summary.entitiesMissing` also lists `Subscription` —
  `countsTowardCapability` says which, `summary.lowConfidenceTableCount` totals them. `rowCount`
  is a total, **not** a rate (no row-count-per-day history exists) and is the warehouse's own
  ESTIMATE (Postgres `reltuples`), not a count — render it rounded, it will move between page
  loads. `rowCount: 0` means empty OR never counted, upstream can't tell them apart — treat
  `summary.totalRows` as a floor and check `summary.uncountedTableCount`. `state` and `flags`
  are read from the same capability `/mapping-quality` reads, so the two can never disagree
  about whether a mapping is sound — see that endpoint's notes above for the 4 `state` values.
  `flags` (the "fix the join" callout on 06) is intentionally not rendered yet — per the user, the
  backend may never have a real fix behind a given flag, so that surface waits until there's a
  confirmed action to put behind it.

### POST /api/flolyt/workspace/onboarding/progress

- **Purpose:** Saves onboarding progress (the "acts that leave no other trace" from
  `GET /onboarding`).
- **Auth:** authenticated.
- **Request:** `kind` (enum, required): `ViewedStep` | `ReviewedMapping` | `AcknowledgedAgents` |
  `Finished`; `step` (nullable string, required key).
- **Response:** `data` = null (typed shape — the live response actually returns a plain string,
  e.g. `"workspace"`, not null; unused by the app either way, see Notes).
- **Used by:** `services/api/workspace/save-onboarding-progress.ts`,
  `features/workspace/use-save-onboarding-progress.ts`, `/onboarding/data` (`ReviewedMapping`),
  `/onboarding/agents` (`AcknowledgedAgents`).
- **Status:** verified working
- **Notes:** Only call this for what nothing else can tell the server — naming the workspace,
  declaring markets, choosing a revenue model, connecting a source are all visible in real
  state and must **never** be posted here as progress events. `ViewedStep` doubles as the resume
  hint and the activity clock (drives `resumeAt`/`stalledForDays`). Record is created on first
  contact — a workspace that never opens setup reports `started: false` rather than an empty
  record. The hook is silent by design (no toast) — it's meant to fire on step views, not
  user-initiated submits. **Verified live 2026-08-28:** `AcknowledgedAgents` returns `200
  {"data":"workspace","messages":["Progress saved."],"succeeded":true}` — response `data` isn't
  actually `null` on the wire, but nothing reads it, so the typed shape is left as-is rather than
  chasing an unused field.

## Wiring notes (2026-08-26)

All 21 service files (`src/services/api/workspace/`) and hook files (`src/features/workspace/`)
are built and typecheck clean (`npx tsc --noEmit -p tsconfig.app.json`). Zod schemas are in
`src/validators/workspace.ts`. `API_ENDPOINTS.WORKSPACE` added to `src/config/apiConfig.ts`.

**Update, same day:** onboarding step 1 is now wired — `/onboarding/start` (the missing
pre-workspace screen, `POST /workspace`) and `/onboarding/workspace` (screen 03: `PUT /identity`,
`PUT /markets`, `GET /slug-available`, `GET /proposed-markets`) both exist and typecheck clean.
See `docs/onboarding/build-plan.md` for the full architecture. The post-login redirect in
`use-verify-login-code.ts` still isn't flipped on `onboardingRequired` — do that only once the
whole 5-step wizard is buildable end to end, not after step 1 alone.

**Update, later same day:** `PUT /identity` was narrowed to `slug`-only per an updated API doc
(name/timeZoneId moved to `POST /workspace` + `PUT /profile`). Rather than replacing the bundled
`PUT /identity` call on screen 03 with a `PUT /profile` + `PUT /identity` chain, the address field
moved to `/onboarding/start` instead — name and timezone are already collected there, so the
whole workspace identity (name, address, timezone) is now set in one place, at creation. Screen 03
is markets-only now (`PUT /markets`, step-up gated) and no longer calls `PUT /identity` or
`PUT /profile` at all. See the per-endpoint entries above for the full reasoning.

**Known gap, not a bug:** `PUT /markets` and `PUT /revenue-model` are step-up gated
(`stepUpChallengeId`), and the step-up challenge flow was deliberately skipped during the auth
rebuild ([[flolyt_governance_stepup_reminder]]). Their hooks exist and typecheck, but nothing in
this codebase can produce a valid `stepUpChallengeId` yet, so a UI built against them today would
get a 400 on submit. Build the step-up flow before wiring a screen to either of these.

## Bugs found testing against the real API (2026-08-26)

Both `GET /proposed-markets` and `GET /onboarding` return `500` with an identical body when called
for real:

```
{
  "title": "Server Failure",
  "status": 500,
  "detail": "The input does not contain any JSON tokens. Expected the input to start with a
    valid JSON token, when isFinalBlock is true. Path: $ | LineNumber: 0 | BytePositionInLine: 0."
}
```

This is a .NET JSON-deserialization error that fires when the server tries to parse a request
body that was never sent. Both calls are plain bodyless `GET`s — same shape as `GET
/currency/default` and `GET /currency/supported`, which both succeed. Points at a backend bug on
these two specific endpoints (perhaps a `[FromBody]` binding on an action that shouldn't have
one), not a frontend request-shape issue. Not something fixable from this codebase — flag to
whoever owns the backend. The frontend hooks (`use-get-onboarding-status.ts`,
`use-get-proposed-markets.ts`) fail gracefully either way (`/onboarding/workspace` shows "No
proposed markets yet.", the `ProtectedRoute` gate fails open) and their retry count was dropped
from the app-wide default of 5 to 1 so a broken backend doesn't spam the network.

## Missing

_None flagged yet — this batch covered all 21 endpoints listed in the Workspace group's index._
