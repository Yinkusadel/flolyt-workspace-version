# Frontend handoff — passwordless auth, and the lifecycle surfaces

**As of 2026-08-19, branch `live-workspace-synth-impl`.**

Two things the frontend can start on now: the auth contract, which **breaks** every existing sign-in
screen, and the lifecycle surfaces, which are additive.

> **Build from this document, not `design-kit-audit.md`.** That one is a point-in-time audit from
> 2026-08-06 and is no longer maintained; its rows have been wrong about four consecutive frames,
> always understating what exists. Frames 06 and 07 are corrected there now, but 01/02 still describe
> a password login that no longer exists. Its §2–§4 reasoning still holds and is worth reading — the
> per-frame status is not.

---

## Part 1 — Auth

### Endpoints that are gone

Deleted, not deprecated. Screens calling them will 404.

| Endpoint | Replaced by |
|---|---|
| `POST api/users/auth/login` | The two-step code flow below |
| `POST api/users/auth/forgot-password` | Nothing — there is no password to recover |
| `POST api/users/auth/recover-password` | Nothing |
| `POST api/users/registration/{userId}/password` | Nothing — confirm, then request a code |

Session handling is untouched. `token/refresh`, `logout`, `logout-all`, `sessions` and the admin
revoke endpoints behave exactly as before — only the credential check changed.

### Signing in

```
POST api/users/auth/login/request-code
{ "email": "ada@acme.com" }

200 OK — always
{ "succeeded": true,
  "messages": ["If that email has an account, a sign-in code is on its way."],
  "data": { "challengeId": "0198f2c1-..." } }
```

```
POST api/users/auth/login/verify-code
{ "challengeId": "0198f2c1-...", "code": "418320" }

200 OK
{ "isAuthenticated": true, "token": "eyJ...", "refreshToken": "wR3k...",
  "onboardingRequired": false, "isPlatformAdmin": false }

400 Bad Request
{ "isAuthenticated": false,
  "authenticationError": "That code is not valid. Request a new one and try again." }
```

Codes live **10 minutes**. Five wrong attempts kill the challenge — the sixth try fails even with the
right code. Requesting again within **60 seconds** returns the *same* `challengeId` and sends no
second email.

### Signing up

```
POST  api/users/registration/register         { firstName, lastName, email }
PATCH api/users/registration/{userId}/confirm { "otp": "418320" }
PATCH api/users/registration/resend-otp       { "email": "ada@acme.com" }
```

**Changed shape:** `confirm` used to return a `setupToken` for the password screen. It now returns
`Result<Guid>` — the registration id only. Send the user to `login/request-code` from there.

Confirmation codes live hours rather than minutes, deliberately: "confirm your email when you get
round to it" and "let me in" are different questions. Same attempt cap and resend cooldown.

### Accepting an invitation

```
POST api/teams/invitations/accept
{ "token": "...", "firstName": "Ada", "lastName": "Lovelace" }
```

No password. Accepting does **not** sign them in — it creates the account and the membership. Route
them to `login/request-code` afterwards like anyone else.

### Who is signed in

```
GET api/users/auth/me            (authenticated)

200 OK
{ "succeeded": true, "data": {
    "id": "0198f2c1-...", "email": "ada@acme.com",
    "firstName": "Ada", "lastName": "Lovelace", "phoneNumber": null,
    "isActive": true, "role": "Member",
    "companyId": null, "companyName": null, "onboardingRequired": true } }
```

**Use this after `verify-code`, not `GET api/users/registration/{email}`.** The registration lookup
reads self-signup registrations only. Somebody who joined by accepting a team invitation has a `User`
and no registration, so that call answers 404 for every invitee — which is what "user not found after
accepting an invite" was.

`companyId` is null and `onboardingRequired` true until the workspace association lands. For a fresh
invitee that is a few seconds after they accept, so a client that sees null straight after sign-in
should re-ask before sending them to create a workspace.

### Step-up confirmation

Sensitive changes can need a fresh emailed code even from a signed-in user. Same two-step shape, but
authenticated and bound to one action.

```
POST api/users/auth/step-up/request-code   { "action": "raise_agent_spend_limit" }
→ { "succeeded": true, "data": "0198f2d4-..." }

POST api/users/auth/step-up/verify-code    { "challengeId": "0198f2d4-...", "code": "662104" }
→ { "succeeded": true }

PUT api/flolyt/governance/agents/spend-limit
{ "agentKey": "flolyt", "maxSpendPerRun": 500, "stepUpChallengeId": "0198f2d4-..." }
```

Verified challenges must be spent within **2 minutes**, are single-use, and authorise only the action
they name.

| Action key | Request | Required when |
|---|---|---|
| `raise_agent_spend_limit` | `PUT .../governance/agents/spend-limit` | **Conditional** — raising the ceiling or clearing it to unlimited. Lowering needs nothing |
| `override_send_stop_line` | `PUT .../governance/send-stop-lines` | **Conditional** — switching guardrails off or raising any threshold. Tightening needs nothing |
| `change_administrators` | `POST api/teams/{teamId}/invitations`<br>`PUT api/teams/members/{id}/roles`<br>`DELETE api/teams/members/{id}` | **Conditional** — only when Administrator is granted or revoked |
| `change_workspace_markets` | `PUT api/flolyt/workspace/markets` | Actual changes after initial configuration; first declaration, initial setup corrections and unchanged retries need no code |
| `change_revenue_model` | `PUT api/flolyt/workspace/revenue-model` | Actual changes after initial configuration; first answer, initial setup corrections and unchanged retries need no code |

On the member `DELETE` the id goes on the query string (`?stepUpChallengeId=…`); everywhere else it
is a body field.

**Suggested UX:** attempt without a challenge id first. If the reply is *"Confirm this change with
the code we emailed you."*, request a step-up code and retry with the id attached. That avoids
prompting on the conditional cases where it isn't needed.

**Onboarding correction (2026-10-21):** Do not open the email-code dialog automatically on the
markets/currencies or business-model screens. Their V3 routes are `PUT /api/v3/workspace/markets`
and `PUT /api/v3/workspace/revenue-model`. Submit without `stepUpChallengeId` during initial setup.
Workspace creation may already have saved `revenueModel`; that prefill is still correctable without
a code during initial configuration.

The backend recognizes an unfinished onboarding record with an initial markets/model choice and
no completed data/agent review. It closes this exemption when setup finishes, any datasource has
been connected (including subsequently disconnected sources), a leakage grid exists, or a revenue
ledger has been built. An unfinished wizard or changing its resume cursor alone cannot exempt an
established workspace. Legacy settings without a qualifying setup record remain protected.

`GET /api/v3/workspace/revenue-model` returns `requiresStepUpToChange` using the same condition as
the write. It applies only when the selected value actually changes. Re-sending the same model or
the same market configuration never requires a code; market ordering, casing, default currencies
and the billing-currency reporting fallback do not turn a retry into a change. If an actual later
change is rejected with the confirmation message, start the existing request-code/verify-code flow
and retry once with its verified challenge ID. Authentication and administrator permissions still
apply; login email verification and other step-up-protected actions are unchanged.

Onboarding API acceptance:

1. Create a fresh workspace, including a prefilled `revenueModel` if the creation form supplies it.
   The model read must report `requiresStepUpToChange: false` during initial configuration.
2. Save markets, retry the same configuration, then correct markets/model before connecting data.
   All should succeed without requesting or verifying an email code.
3. Finish setup or connect a datasource. The model flag becomes true for actual changes; changing
   either setting without a verified challenge is refused. Disconnecting the datasource does not
   reopen the exemption. Unchanged submissions still succeed without a code.
4. Repeat an actual protected change with an authorised challenge; it succeeds. A non-administrator
   cannot change either setting, including during initial setup.

Local verification (2026-10-21): 96 targeted PostgreSQL integration cases and V3 OpenAPI generation
passed. This covers the backend; browser dialog behavior still needs verification in the frontend repo.

**Approving an agent proposal is deliberately not on this list** (decided 2026-09-04). It used to be:
`approve_room_play` asked for a code on every accept. An agent proposal is the agent asking
permission, and the person reading the card and approving it is the permission. Send nothing but the
proposal id — see *Plays and agent proposals* under Part 2. A client that still sends
`stepUpChallengeId` on accept is not refused, since unknown body fields are ignored, but the field does
nothing now and should be dropped.

### Response envelopes

```
Result<T>              { "succeeded": bool, "messages": string[], "data": T }
AuthenticationResult   { "isAuthenticated": bool, "authenticationError": string?,
                         "token": string, "refreshToken": string,
                         "onboardingRequired": bool, "isPlatformAdmin": bool }
```

`AuthenticationResult` is returned only by `login/verify-code` and `token/refresh`. Everything else
is `Result<T>`.

### Behaviour that will surprise you

- **Requesting a login code always returns 200** with a `challengeId` — for a real account, a
  disabled one, or an address never seen. A reply that varied would let anyone test a mailing list
  against the customer roster. Never render "no account found" on that screen.
- **Every code failure has one message.** Wrong, expired, spent, out of attempts, no such challenge —
  all identical. Don't branch on it; "request a new code" is the only recovery.
- **Resending inside 60 seconds is a no-op** and returns the same `challengeId`. A countdown reads
  better than a silent nothing.
- **Codes are six digits including leading zeros.** `000042` is valid — text input, not number input.

---

## Part 2 — Lifecycle

### Two axes, deliberately

The product carries **ten business stages** (where is the business leaking?) and **five customer
lifecycle states** (where is this person?). They answer different questions; a narrow bridge
populates three of the ten from customer state and returns null for the rest.

Business stages, in spine order: `acquire`, `activate`, `price`, `adopt`, `retain`, `expand`,
`support`, `renew`, `advocate`, `churn`.

### `Measured<T>` — read this before rendering any number

Every quantity in the lifecycle surfaces is wrapped. **Never render `value` without checking
`state`.**

```json
{ "value": [...], "state": "measured",
  "missingSource": null, "wouldUnlock": null }

{ "value": null, "state": "unavailable",
  "missingSource": "a helpdesk connector",
  "wouldUnlock": "ticket volume and first-response time per stage" }
```

An `unavailable` figure is not zero and must not render as zero. Show `wouldUnlock` — it is written
as the sentence to put on screen, naming what connecting the source would buy.

### The stage map

```
GET api/flolyt/lifecycle/map
```

Returns all ten stages, including ones with nothing behind them yet:

```json
{ "stages": [
  { "key": "retain", "name": "Retain", "position": 5,
    "owningTeam": "Lifecycle", "owner": { ... }, "leadAgentKey": "flolyt",
    "leadAgentName": "Flolyt", "reviewCadence": "weekly",
    "atStake": { "value": [ { "currency": "NGN", "amount": 4200000 } ],
                 "state": "measured" },
    "openRoomCount": 2 } ] }
```

Only three stages have real at-stake figures today; the other seven come back `unavailable` with a
`wouldUnlock` string. That is the honest state, not a bug — render it.

```
PUT api/flolyt/lifecycle/map/{stageKey}/owner    assign a human owner
```

### Stage definitions — LC03

**A new workspace has ten stages and zero definitions.** That is not a loading state and not a bug:
what a stage *means* is a claim about the tenant's own data, and Flolyt never authors one on their
behalf. `LC01` is the specified screen for it. Build the empty state first — you will see it more
than any other.

```
GET  api/flolyt/lifecycle/stages/{stageKey}/definition
POST api/flolyt/lifecycle/stages/{stageKey}/definition/preview
PUT  api/flolyt/lifecycle/stages/{stageKey}/definition
POST api/flolyt/lifecycle/entry-events/measure
```

`GET` returns the current definition (nullable), every version it has had, and the candidate entry
events:

```json
{ "stageKey": "adopt", "stageName": "Adopt", "canEdit": true,
  "isDefined": false, "fallbackInUse": false, "fallbackNote": null,
  "current": null, "history": [],
  "candidates": [
    { "eventKey": "page_views", "datasourceId": "…", "estimatedRows": 4000000,
      "population": { "value": 90000, "state": "available" } },
    { "eventKey": "orders", "datasourceId": "…", "estimatedRows": 120000,
      "population": { "value": null, "state": "unavailable",
                      "missingSource": "a count of this event's customers, which has not been run yet",
                      "wouldUnlock": "how many customers defining the stage on this event would admit" } } ] }
```

**`estimatedRows` is not a population** — it counts rows, and a page-view table with four million of
them may hold ninety thousand people. Never render it in the population slot, and never fall back to
it when `population` is unavailable. Call `entry-events/measure` to fill the counts in; it is bounded
and may legitimately leave some candidates unavailable.

**`entry-events/measure` is gated and rate-limited**, because it spends the tenant's warehouse budget.
A stage owner or administrator may call it; `?force=true` is administrators only, and even then a
count taken within the last hour is not re-run. Reading the resulting figures is open to everyone —
only causing them is restricted. Expect a plain failure `Result`, not a 403, when the caller lacks it;
use `canEdit` on the `GET` to decide whether to offer the button.

**`fallbackInUse`** is true for `activate`, `retain` and `churn` while they are undefined. Those three
produce figures today from the customer-lifecycle classifier's recency thresholds. Show
`fallbackNote` — defining the stage will move the numbers, and without the warning that reads as
something breaking.

**The preview is mandatory and there is no override.** `PUT` without a token is refused, and so is a
`PUT` whose body differs in any way from the one previewed:

```json
POST …/definition/preview
{ "entryEventKey": "orders",
  "exitRules": [ { "kind": "Event", "eventKey": "cancelled", "movesToStageKey": "churn" } ],
  "exclusions": [ { "kind": "InternalAccount" } ] }

→ { "previewToken": "…", "expiresAtUtc": "…", "wouldBeVersion": 1,
    "customersAdded":   { "value": 90000, "state": "available" },
    "customersRemoved": { "value": 0, "state": "available" },
    "figuresAffected":  { "measured": true, "items": ["Adopt on the lifecycle map — …"] },
    "cohortsBroken":    { "measured": false, "items": [],
                          "unmeasuredReason": "entry cohorts for this stage, which arrive with stage membership" } }
```

Each blast-radius section carries `measured`. **An empty `items` with `measured: true` means nothing
breaks; `measured: false` means we could not tell.** Those are opposite statements and must not
render the same way — the second is a reason to hesitate. Today `figuresAffected` and
`learningsScoped` are measured; `cohortsBroken` and `goalsInvalidated` are not.

Tokens are single-use and last 30 minutes. A refused token comes back **409**, not 400 — the body was
fine, the state moved. The message says which of the five refusals it was; the one to handle carefully
is *"changed since it was previewed"*, which means the user edited the form after reading the impact.
Re-preview automatically on any edit and you will never show it.

A **409** also comes back when somebody else saved this stage's next version first — *"Somebody else
changed this stage's definition a moment ago."* Re-fetch the definition, re-preview, and let the user
decide; do not retry silently, because the impact they read described the older definition.

**The entry event must be one this workspace emits.** A preview naming an unknown event is refused, so
build the entry field as a picker over `candidates` rather than free text. A workspace with no
connected source therefore cannot define any stage — that is LC01's "waiting on a source", not an error.

**Three more refusals come back from preview, all structural** — the definition could never be
evaluated as written, so they are worth surfacing against the field that caused them:

- every event in one definition must come from the **same connection** as the entry event (warehouses
  cannot join across connections);
- an **elapsed** exit rule needs a date on the entry event;
- every event needs a customer identifier, on the way out as well as in.

Excluding *internal accounts* or *re-registrations* is accepted and not yet honoured — the stage saves
and reports an unavailable population naming what is missing. Excluding *duplicate identities* works,
and folds on the merge key you supply — but **every event in the definition has to carry that column**,
exits included, or the preview refuses. Folding the entry on `email` while matching exits on an
account id would compare two different things and report that nobody ever leaves.

### The rail now carries a population

`GET /api/flolyt/lifecycle/map` gained five fields per stage:

- `population` — a measured value, same envelope as `atStake`.
- `populationSource` — `"definition"`, `"lifecycle-fallback"`, or `null`.
- `definitionVersion` — present only when the figure came from a definition.
- `populationComputedAtUtc` — when the figure was taken, not when it was read. Null for a stand-in
  figure, which is computed on read. **Show it.** The refresh is six-hourly, so without it the rail
  presents a number up to a quarter of a day old as current.
- `populationCaveat` — set when the figure is real but worth less than it looks; today, when the date
  an elapsed exit rule counts from is sparse, which makes the population an upper bound. Render it
  next to the number, not in a tooltip.

### A third measurement state

**`state` can now be `"restating"`**, alongside `available` and `unavailable`. It means the stage's
figures are being recomputed because its definition changed — `value` is null and there is no
`missingSource`, because there is nothing for the reader to go and fix. Do not render it as
unavailable: that would send somebody to check a connection that is working. Do not fall back to the
last number you had, either — it was computed under a meaning the workspace has already replaced.

It appears within a second of saving a definition and clears when the rebuild finishes, typically
within a minute or two. Anything parsing `state` needs to handle it; a client that only knows two
states will treat it as an error.

### The stage overview — `GET /api/flolyt/lifecycle/stages/{stage}`

The headline is `population`, and below it `departures` — the population that did **not** stay,
grouped by the exit rule that caught them.

**Grouped by cause, not by destination.** Two rules can both send people to Churn — "they cancelled"
and "they went quiet for ninety days" — and those are different things to know about the same number
of people. They stay two groups. Render the `cause`, not just the `toStageName`. Groups arrive
largest first.

Each group carries:

- `size` — measured.
- `reachability` — measured **where the entry event carries an email or phone column**, unavailable
  otherwise. When it is measured, `reachabilityCaveat` is set and **you must render it beside the
  number**: this counts addresses on the event, before anyone unsubscribed or suppressed is taken off,
  so it is an upper bound. A qualified figure read as an exact one is the risk of showing it at all.
- `conditionKey` — `exit:cancellations`. What a room or a claim about this group attaches to. Stable
  across a redefinition; a room carries the definition version instead.
- `claim` — `{statement, grade, confidence}`, or **null meaning nobody has looked**, which is not the
  same as there being no cause. `grade` is `InsufficientEvidence` / `Hypothesis` / … — *not* the
  contract's causal / association / constraint vocabulary, which the product does not model.
- `roomOpen` — a true false. The query ran.
- `observedValue` — measured **where the entry event carries an amount column**, unavailable
  otherwise. **The value is an array, one entry per currency — never a total across them:**

  ```json
  "observedValue": { "value": [ { "currency": "GBP", "amount": 9000 },
                                { "currency": "NGN", "amount": 412000 } ],
                     "state": "available" }
  ```

  Render each currency on its own line. **Do not sum them, and do not sort the list by amount** —
  ₦412,000 above £9,000 is a ranking on magnitude between things that have no common scale, which is
  the same category error as adding them. The array arrives ordered by currency code; keep that order.

  It replaces the old `value` field, which was unavailable everywhere. The rename is deliberate and
  the meaning is narrow: this is what the group **has been worth** on the entry event — what they
  paid — and *not* what losing them costs. Label it accordingly; "value at risk" or "revenue at
  stake" would be a different figure that nothing here computes.
- `observedValueCaveat` — set when the totals are worth less than they look, null otherwise. **Render
  it beside the figures whenever it is present**, the same rule `reachabilityCaveat` follows. Two
  things can put it there: the event carries no currency column so the workspace's single declared
  currency was assumed, or some amounts carried no currency at all and were left out of the totals.

`primaryConversion` is unavailable throughout. A conversion is a second condition on top of the
definition — what counts as *succeeding* in a stage — and nothing models one yet.

`rateOfChange` is month-over-month from the stage's own history, unavailable when either month is.

**While the stage is restating**, `population` and `rateOfChange` carry that state and `departures` is
empty — the figures behind the breakdown describe a meaning the workspace has already replaced. An
empty `departures` on a *measured* stage means nobody is leaving, which is a true and good statement;
read `population` first to tell the two apart.

### What changed — `GET /api/flolyt/lifecycle/stages/{stage}/changes`

The stage's population month by month, newest first.

- `population` and `delta` — both measured values. **`delta` is unavailable rather than zero whenever
  either month is**, and for the first month of the series. Plotting an unavailable delta as zero
  draws a cliff the business never had.
- `isDefinitionChange` — the single month that first ran under a different definition. This is the row
  the contract calls the most dangerous on the screen: a measure that moved because the measure
  changed. Mark it on the chart.
- `isRestated` — this month's answer was rewritten under a definition chosen later. Most restated
  months are not changeovers, so do not draw them the same way.
- `restating` (top level) — the series below is the old one until the rebuild finishes.

**`?from` and `?to`** bound the window. Both default to the twelve months a restatement covers — the
range these figures are comparable across, since older months keep whichever definition they were
computed under. Pass them explicitly to reach further back; expect the oldest visible month in the
default window to be the changeover fairly often, for exactly that reason.

`lifecycle-fallback` means the number comes from the customer-lifecycle classifier's recency
thresholds, which is a stand-in nobody chose; only Activate, Retain and Churn ever show it, and only
while undefined. Worth labelling in the UI, because defining one of those stages **will move its
number** and it should not read as a regression.

A stage whose definition could not be evaluated shows `population` unavailable with
`populationSource: "definition"` — it does not fall back. Populations refresh every six hours, not on
read, so a definition saved a moment ago shows unavailable until the next pass.

**Exit rules are ordered — first match wins.** Reordering them is a different definition and
invalidates a preview. Reordering exclusions is not, and does not.

**Who may edit:** the stage's owner, or any workspace administrator. `canEdit` on the `GET` tells you
which. Churn has no owner by design, so it is administrator-only.

### The leakage map

```
GET api/flolyt/lifecycle/leakage-map
```

```json
{ "revenueModel": "consumer",
  "revenueModelAssumed": false,
  "computedAtUtc": "2026-08-19T08:45:00Z",
  "grids": [ { "rows": [...], "cells": [
    { "rowKey": "at_risk", "rowLabel": "At risk",
      "conditionKey": "repeat_decay", "conditionLabel": "Repeat decay",
      "currency": "NGN", "amount": 850000, "customerCount": 214,
      "method": "…", "windowStartUtc": "…", "windowEndUtc": "…" },
    { "rowKey": "at_risk", "conditionKey": "involuntary_churn",
      "amount": null, "missingSource": "a payments connector",
      "wouldUnlock": "failed-payment recovery value" } ] } ] }
```

Recomputed on a 15-minute job, so `computedAtUtc` is worth showing. A cell carries **either** an
amount **or** a `missingSource`/`wouldUnlock` pair — never both.

**`revenueModel` decides the vocabulary.** A consumer workspace is measured across lifecycle stages
against repeat decay and abandonment; an account-based one across its own segments against spoilage
and expansion gap. The two grids share no rows and no conditions. Changing the model **discards** the
grid built under the old one rather than converting it — which is why that change is step-up guarded.

**`revenueModel` is never null any more; read `revenueModelAssumed` instead.** A workspace that has
not chosen used to get `null` and no grid. It now gets the model inferred from its connected customer
table (organisations → `account_based`, people → `consumer`), or `consumer` when nothing is connected,
with `revenueModelAssumed: true`. Show the grid, and ask the question beside it — "Measured as a
consumer business. Is that right?" — rather than in place of it. The same flag is on the leakage page,
the home page, the workspace home and the conditions list. Choosing a model the first time needs no
step-up; the settings read (`GET …/workspace/revenue-model`) still returns `null` until a person
answers, which is what onboarding's checklist reads.

Figures are never blended across currencies. Expect multiple `{ currency, amount }` entries and
render them separately.

### Rooms

A room is opened at a `(stage, condition)` coordinate — usually from a leakage cell. **Nobody opens
one by hand.** There is no POST to create a room: a person asks the agent in chat, the agent proposes,
and they approve the card (see *Room proposals* below); the convening sweep and stage governance open
the rest on their own. The "New room" button and the five-screen wizard are gone with the route.

```
GET  api/flolyt/rooms                              ?includeArchived=false&state=open|recovering|stale|archived
PUT  api/flolyt/rooms/{roomId}/owner
GET  api/flolyt/rooms/{roomId}/close-preview       what closing would record, before anybody closes
POST api/flolyt/rooms/{roomId}/close               { kind, note?, dissent?, measurement?, supersededByRoomId?, unmeasuredReason? }
POST api/flolyt/rooms/{roomId}/falsifiers          what would change the recommendation
POST api/flolyt/rooms/{roomId}/falsifiers/{index}/met
GET  api/flolyt/rooms/{roomId}/evidence            includes self-flagged gaps
GET  api/flolyt/rooms/{roomId}/log                 append-only, records dissent
GET  api/flolyt/rooms/{roomId}/log/export
```

The evidence query reports what it could **not** find alongside what it did — render both. Falsifiers
are the stated conditions under which the room's recommendation stops holding.

**Each row of the rooms list carries what the list draws**, so it needs no per-row calls: `ownerName`
(null when unowned), `agents` (key, display name, role), `pendingDecisions`, and `needsYou` — true
when a pending play in that room waits on the caller, which is the amber badge. On a restricted room
the caller is outside, those four are null, empty, 0 and false. Do not infer anything from that.

**The close preview** is the close screen before the button. `outcomes` lists the five endings with
`available` and the close's own refusal where one applies — render the unavailable one greyed with
its `whyNot`, never hidden. `delta` is the leak cell now against the opening figure and is **not** a
recovery claim.

`measurementMustBeSupplied` decides the measurement panel. **False** when the room's plays produced
campaigns: `computedMeasurement` holds contacted, held back, converted in each group, recovered, and
the window, counted from those campaigns' cohorts, and `linkedCampaigns` lists them with each one's
cohorts. Render it as *measured* and make the close call with **no** `measurement` — a supplied one
is refused. Show `incrementalRevenue` when it is negative, `holdoutHonoured` when false, and
`conversionsOutsideMarket` when non-zero; each is a finding. `measurementWindowElapsed` false means
the figures are so far, not final. **True** when no play made a campaign: the counts are entered on
the close screen as before, and `measurementMustBeSuppliedBecause` says why. `computedMeasurement`
null with `measurementUnavailableBecause` set means the campaigns held nobody back — money recovered
is greyed, and the room closes as unmeasurable.

### The briefing — what to render when somebody opens a room

```
GET api/flolyt/rooms/{roomId}/briefing
```

**Render `readThisFirst` as the header and mean it.** It is one sentence saying where the room
stands and what it wants from this reader, and it is the whole reason the endpoint exists: a room
that has been investigated holds thirty messages between four agents, which is a log, not a
briefing. Everything below it is support.

The body carries `investigation` (the same shape as the investigation endpoint, null before one
starts with `investigationNote` saying why), `conclusion` once the arbiter has finished,
`observations` and `hypotheses` (causal findings and strong associations in the first, hypotheses in
the second, each with source, window and sample), `gaps` (a missing source, how many claims it
blocks, and the questions it is blocking), `whatWouldChangeThis`, `recommendedActions` (pending
plays with reach and effect), `decision`, and `waitingOnYou`.

**`waitingOnYou` is the action list.** Each row has a `kind` to route on — `conflict`, `decision`,
`play`, `obligation` — the sentence to show, and an `id` where one applies. It is empty for a reader
with nothing to answer, and `readThisFirst` says so rather than inventing urgency. When exactly one
thing waits, `readThisFirst` already folds it in as a clause, so do not print the header and then
the single row's sentence as well.

**Findings are capped at five a kind.** `totalObservations` and `totalHypotheses` carry the real
counts, so link out to the evidence tab rather than paginating here. `decision` is null when nobody
has drafted one — render nothing, not an empty decision panel.

### The investigation — agents working the room on their own

Every open room with a lead agent is investigated without anybody asking. Within a minute of
opening, the lead reads; after every finished turn the orchestrator reads the thread as arbiter and
does one thing: asks an agent in the room, brings in a specialist, raises a conflict, or concludes.
Agents ask each other by name in the thread. **People decide; agents draft, record and propose.**

```
GET  api/flolyt/rooms/{roomId}/investigation            where it stands
POST api/flolyt/rooms/{roomId}/investigation/pause      owner or administrator
POST api/flolyt/rooms/{roomId}/investigation/resume     owner or administrator
GET  api/flolyt/settings/investigations                 the workspace's turn budget
PUT  api/flolyt/settings/investigations                 { turnBudget: 2–50 }  administrators
```

The read carries `status` (`working`, `paused`, `concluded`, `stopped`), `turnBudget`, `turnsUsed`,
`turnsLeft`, `now` (one sentence: who is doing what — render it as the room header's live line),
`summary` once concluded, `stoppedBecause` once stopped, `canPause`, and `steps`. Each step is a run:
`runId` (links to the runs panel), `agentKey`, `agentLabel`, `kind` (`lead`, `coordinate`, `ask`,
`bring-in`), `question`, `askedByAgentKey`, start, end, `outcome`. It is 404 before the first sweep
and the message says why: no lead agent, or not yet.

**Stopped is not concluded.** Concluded means the arbiter said the thread holds what a person
needs; render the summary first, and there is no resume — reopening the room starts a new
investigation. Stopped carries a reason in plain words — the budget, the room closing, two
failures in a row, the arbiter finding no next step, no owner — and the room log line beside it
says what to do about that particular one. **Render the reason and the resume control, never a
spinner.** Resume works from stopped as well as paused, so a person who fixes the cause carries on
in the same investigation with its thread intact.

Two exceptions to that. A stop on **the room closing** cannot be resumed at all; the room has to be
reopened. A stop on **the budget** is refused until the budget moves: resume re-reads
`api/flolyt/settings/investigations` and raises this investigation's ceiling to the workspace's, so
the sequence is an administrator raising the budget and then the owner resuming. Resuming before
that returns 400 saying there are no turns left. **Paused** shows who paused it; the run that was
in flight still finishes.

Everything the agents do lands in the room log by the agent's name, not the owner's: an agent
that records a claim, drafts the decision, asks another agent, or brings one in is the actor on
that line. The draft decision shows `draftedByLabel` as the agent and stays undecided until the
owner decides it. A specialist brought in by an agent has `addedBy` empty on the roster, the same
as one the orchestrator assembled, and the owner can remove it.

### The value ledger

```
GET api/flolyt/value/ledger            ?since=2026-01-12T00:00:00Z   (optional)
```

Every closed room opening as a line, and per-market columns over them. **There is no total across
markets and no field for one** — do not compute one on the client; four figures is the design.
`markets[]` carries each currency's `recovered` split into `recoveredByHoldout` and `recoveredAsStated`,
the money that moved on unmeasurable rows and the money closes excluded (both listed, both outside
every causal figure), at risk across closed openings and still open, shared at-risk between linked
rooms (stated, not subtracted), sending cost where recorded, and `withheldRecovery` — what the
market's holdouts were denied so the rest could be measured, null when nothing here was measured
against a holdout. `rows[]` carries `withheldRecovery` too, on causal rows only: the recovery per
contacted customer applied to those held back, never derived from a stated figure. Both are costs of
measuring; show them beside the recovery and never net them off it. `rows[]` also carries `strength`
(`causal`, `stated`, `unmeasurable`, `none`) and `howMeasured` beside every figure — render both,
never the figure alone — and `creditedTo`, which is a condition and never a person. `endings[]`
groups rows by how they ended with a sentence each; `timing` names the fastest and slowest and says
`closedAutomatically` is zero; `costs[]` is a list with `known` per line and no net.
`restrictedRoomsExcluded` and `mergedRoomsFolded` are counts of what the figures leave out.

### Plays and agent proposals

A play is an action an agent wants to take on real customers, held until one named person decides.

```
GET  api/flolyt/rooms/{roomId}/plays               the board for one room
GET  api/flolyt/plays                              every room's board, same columns
GET  api/flolyt/plays/{proposalId}                 one play in full — the approval screen
POST api/flolyt/ai/proposals/{id}/accept           { "editedArgumentsJson": "..." }   body optional
POST api/flolyt/ai/proposals/{id}/reject
POST api/flolyt/ai/proposals/{id}/defer            { "because": "..." }               reason required
```

**Accept takes no step-up code.** Reviewing the card is the approval. Send the proposal id alone, or
with `editedArgumentsJson` for approve-with-edits; the original arguments are kept beside the edited
ones and the detail read returns both. Accept runs the tool under the approver's identity.

Accept can still refuse, and every refusal is a sentence to show, not a code to map:

- **Not yours to decide.** Only the person the play waits on, a member of its room, or a workspace
  administrator may accept, reject or defer it. Everybody else is told so. Render the decide buttons
  only for those three, and treat the refusal as a stale card if it arrives anyway.
- **Drift.** A send whose audience or send time has moved since the card was written is refused with
  what moved (*"the audience is now 4 people, not 1,000"*). The detail read carries the same text as
  `drift` while the play is pending, so show it before the button rather than after.
- **Over the approver's ceiling.** A play above what the person may approve names the ceiling.
- **Already decided.** Somebody else got there first; reload the card.
- **Reaches nobody.** A play whose resolved audience is empty cannot be approved. Fix the audience
  or reject it.

**`campaignId`** on a board row and the detail is the campaign the play produced when it ran, or null
before it ran or where the tool made none. Link it to the campaign; it is what the room's close is
measured through.

**Render `figuresAreStated`.** Reach and effect are asserted by whoever proposed the play and
verified by nothing when this is true. A stated reach shown as a checked one is how a play meant for
100,000 people reaches five times that. `reachesCustomers` means a sent message cannot be recalled
after delivery — say so on the screen.

There is no bulk approve, and there will not be one: each decision is one card, one person, one
record.

### Room proposals — opening a room from chat

The front door to a room is moving into chat (`rooms-via-orchestrator-plan.md`). Phase one is in:
when somebody asks the agent to open a room on a leak, the agent proposes it and the person approves
the card. Same proposal document, same accept, reject and defer routes as a play — with two
differences the client has to render:

- **It is not a play.** `toolName` is `open_room_on_leak`, `open_room_on_cohort` or `join_room`. The inbox lists it under
  needs-you as *"asked to open a room: {title}"* and the home queue as *"Open a room: {title}"*; the
  plays board never lists it. Give it a room-shaped card: title, condition and market, the cohort and
  the money (in `play.summary`, `play.reach`, `play.effect`, `play.currency`, resolved off the leakage
  cell), and the arguments JSON for who is in it and what settles it.
- **Nothing reaches a customer.** `reachesCustomers` is false and there is no drift. Accept opens the
  room under the approver's identity, with the workspace agent joining as arbiter, and returns the
  room id; if a room is already open on that cell, accept joins it instead and says so.

**Where the card is, and how it arrives.** On a streaming reply the card arrives as a `proposal`
event carrying `proposalId`, `toolName`, `argumentsJson` and `conversationId`. On a JSON reply, or
after the fact, `GET api/flolyt/ai/proposals?conversationId=` lists what is pending. Approval is
`POST api/flolyt/ai/proposals/{id}/accept`, beside reject and defer. It is deliberately not on the
rooms routes: nothing is a room until the card is accepted. The agent now says this in its reply.

**Owner and people.** The person talking to the agent owns the room unless they name somebody else,
and the agent no longer asks "who should own this" as an open question. When somebody else should,
the agent calls `list_workspace_people` and offers from the roster — stage owner first, then team
leads — using the ids the list gives. This is the roster, not the suggested-people ranking, which
still has no source.

**Rooms the orchestrator opens come staffed** (2026-09-09, `rooms-autonomous-investigation-plan.md`
phase 1). Whether from chat or from the convening sweep, the orchestrator fills whatever the person
did not name: the stage's lead agent (or the condition's first specialist where the stage names
none), up to three supporting specialists the condition cues, itself as arbiter, and the lead of
the team that owns the stage as a participant. Every addition is a log line, actor kind `agent`,
action "Added … to the room", with the reason in `consequence` and the words "the owner can remove
it"; agents and members a rule added carry `addedBy` of the empty guid. A "Left agents out of the
room" line names any specialist the workspace could not seat and why. Render the roster with its
reasons; the people screen's remove controls already apply to these rows.

**Every workspace now holds an identity per specialist.** The members and agents reads that list
`AgentIdentity` rows return the default agent plus one row per specialist (twelve today), each
with its persona, readiness, spend ceiling and write modes. Nothing else about those reads changed.

**The agent may offer a room unprompted** (2026-09-08). When a person describes a group of
customers in a costly condition without asking for anything, the agent may check the map and offer
a room in one sentence with the figure, once per conversation, as a question. Nothing changes on
the client: no card exists until the person says yes and the asked-for path runs. If a visible
room already covers what they described, the agent points to it instead of offering a new one.

`POST api/flolyt/rooms`, `POST api/flolyt/rooms/new` and the two `rooms/new/*` helpers are gone
(phase three, 2026-09-04). A client still calling them gets a 404. The rooms list needs a single
entry point that opens the chat with a room-shaped prompt — "open a room on…" — so the feature reads
as moved rather than removed.

### Claims

```
GET  api/flolyt/claims
POST api/flolyt/claims
POST api/flolyt/claims/cite
POST api/flolyt/claims/{claimId}/review        observed → validated
```

Claims carry a graded confidence and a review state. Retrieval orders by confidence × recency, and a
stale high-confidence claim never outranks fresh evidence.

### The agent roster — frame 07

```
GET api/flolyt/workspace/agents
```

```json
{ "totalCount": 13, "readyCount": 6, "readingCount": 2, "notReadyCount": 5,
  "agents": [
    { "key": "repeat-and-decay", "initials": "RD", "name": "Repeat & Decay",
      "description": "…",
      "state": "ready",
      "reads": ["orders", "customers"],
      "needs": null, "wouldUnlock": null, "moreDaysNeeded": null,
      "persona": "LifecycleIntelligence" },

    { "key": "support-signal", "initials": "SS", "name": "Support Signal",
      "state": "not_ready",
      "reads": [],
      "needs": "a helpdesk connector",
      "wouldUnlock": "ticket volume and first-response time per stage",
      "moreDaysNeeded": null, "persona": "SupportIntelligence" },

    { "key": "winback", "initials": "WB", "name": "Win-back",
      "state": "reading",
      "reads": ["orders"],
      "needs": "more history", "moreDaysNeeded": 47,
      "persona": "LifecycleIntelligence" } ] }
```

**`reading` is not a softer `not_ready`.** Nothing is missing and nothing needs fixing — only that
not enough time has passed. `moreDaysNeeded` is frame 07's "needs 90 days" and is set only in this
state. Style it as progress, not as a problem.

**The counts are the sentence the screen leads with**, which is why they're computed server-side
rather than left to you: `notReadyCount` counts genuine gaps only. A specialist merely waiting on
history sits in `readingCount`, because telling somebody five agents are not ready when three of them
need nothing but a fortnight misreads the workspace as broken.

**`reads` is populated for `ready` and `reading` alike** — a reading specialist genuinely is reading
it — and empty for `not_ready`, where listing sources would imply an ability the specialist doesn't
have.

**`persona` will repeat across rows.** Thirteen specialists share seven personas; the three lifecycle
specialists reach for the same tools. That's the shape, not a data problem. It's exposed because it's
the only thing connecting this screen to what actually happens when the question is asked in chat.

### Mapping quality — frame 06's flagged panel

```
GET api/flolyt/workspace/mapping-quality
```

```json
{ "state": "flagged",
  "contributingSourceCount": 2,
  "analysedSourceCount": 2,
  "reviewedAtUtc": null,
  "flags": [
    { "key": "join-key-nullable",
      "mapping": "customer_id on events",
      "consequence": "8% of rows in events have no customer, and those rows vanish when the table is joined to a person — per-customer totals are short by whatever those 8% carry",
      "fix": "make the column required at source, or accept that per-customer figures are a floor",
      "entity": "Engagement",
      "isMeasured": true } ] }
```

**Render `consequence`, not `key`.** The flag names what it does to an answer, not what is wrong with
a column. A warning nobody can act on is noise, and "your data is imperfect" is something every
workspace already knows.

**`state` has four values and only one is good news.** An empty `flags` array is ambiguous on its own,
which is why the state is computed server-side rather than left to you to infer:

| State | Means | Screen |
|---|---|---|
| `nothing_connected` | No sources. Nothing could be inspected | Connect a source |
| `awaiting_analysis` | Sources exist, none analysed yet | Inference is still running — say so, don't reassure |
| `clean` | Analysed, nothing wrong found | The only "all good" state |
| `flagged` | Analysed, something is wrong | Render the flags |

Never treat an empty `flags` array as `clean` on its own — the two unanalysed states also carry zero
flags, and telling somebody their mapping is sound when nobody has looked at it is the failure this
whole surface exists to avoid.

**`isMeasured` separates a counted fact from a schema inference.** True means a probe counted rows and
the consequence quotes a real rate. False means the warehouse merely declares the column nullable, and
the wording hedges accordingly — a join *may* break. Worth weighting differently in the UI rather than
presenting both with the same confidence.

`analysedSourceCount` below `contributingSourceCount` means some sources have not been looked at, so
the flag list is incomplete — worth saying on screen when the numbers differ.

`reviewedAtUtc` is the onboarding "Check the mapping" step; null means it is still outstanding. Record
a review with `POST api/flolyt/workspace/onboarding/progress` and kind `ReviewedMapping`.

### Onboarding status

```
GET  api/flolyt/workspace/onboarding
POST api/flolyt/workspace/onboarding/progress    { kind, step? }
```

```json
{ "started": true, "finished": false,
  "completedSteps": 3, "totalSteps": 5, "resumeAt": "data",
  "lastTouchedAtUtc": "2026-08-19T09:00:00Z", "stalledForDays": 2,
  "steps": [ { "step": "workspace", "isComplete": true,
               "satisfiedAtUtc": "2026-08-17T…", "outstanding": [] },
             { "step": "team", "isComplete": false,
               "satisfiedAtUtc": null, "outstanding": ["Invite someone"] } ] }
```

Read `isComplete` for truth; `satisfiedAtUtc` is detail and is null for steps completed before
timestamps existed. `resumeAt` is a hint, already corrected server-side if the cursor points at
finished work. Render `outstanding` verbatim — the strings are phrased as the thing to do.

Other workspace reads:
`GET api/flolyt/lifecycle/distribution`, `GET|PUT api/flolyt/workspace/lifecycle-thresholds`.

---

### Handoffs — obligations between people

`docs/handoffs-plan.md`, phase 1. An obligation is something one person owes another as a result
of a decision, with a date. Person to person, always: `toUserId` is a user and a team is only ever
a label. The full history travels with it, including a previous owner who did not do it.

**Reads**

| Route | What it is |
|---|---|
| `GET /api/flolyt/handoff?owner=me\|to-me&state=overdue\|unaccepted` | The index: one row per chain the caller can see inside, plus three cards — `owedByYou`, `owedToYou`, `unaccepted` — and `standalone`, the count of obligations typed with no chain |
| `GET /api/flolyt/handoff/mine` | `owedByMe` and `owedToMe`: everything open plus anything done in the last fortnight |
| `GET /api/flolyt/handoff/{chainId}` | A decision and every obligation from it, with `accepted` and `medianHoursToAccept`. The id is the decision doc's, `roomId:opening` |
| `GET /api/flolyt/handoff/o/{obligationId}` | One obligation with its history |

**Writes.** `POST /api/flolyt/rooms/{roomId}/decision/handoffs` creates from a decided decision (the
room's owner or an administrator). `POST /api/flolyt/handoff` creates one by hand, to anyone.
Then, on `/api/flolyt/handoff/o/{id}/…`: `accept` (optional `dueAtUtc`), `dispute` (reason
required), `reissue` (the originator's `response` to a dispute, asking the same person again),
`start`, `done` (optional `evidenceNote`, `evidenceReference`), `reassign` (`toUserId`, reason),
`cancel` (reason), and `read`. The two with optional bodies, `accept` and `done`, take `{}` when
there is nothing to say; send that rather than no body if your HTTP layer minds.

**Things that will surprise you**

- **`state` is `unaccepted` until the person says yes.** Render it as that word. Never "assigned",
  never "pending": in every tool that is not this one, read-and-not-accepted is indistinguishable
  from done, and that is the failure the section exists to make visible.
- **Two dates.** `proposedDueAtUtc` is what was asked for and is always present. `dueAtUtc` is what
  binds and is null until accepted; the acceptor sets it, and a re-date shows in the history as
  "accepted, re-dated". Show "asked for by …" until it binds.
- **Overdue is derived, and there are two kinds of late.** `isOverdue` means accepted and past
  `dueAtUtc`; `isPastAskedDate` means unaccepted and past `proposedDueAtUtc`. The chain row's
  `overdue` counts both; the owed cards' `overdue` counts only the first, because only a binding
  obligation is a broken commitment.
- **Disputed returns it to the originator.** It stays open and stays theirs to `reissue` to the
  same person with an answer, `reassign` to somebody else, or `cancel`; it never becomes nobody's.
  The originator's inbox gets a `NeedsYou` item.
- **`origin` says where it came from.** `decision`, `typed`, `close` or `instrumentation`. A chain
  page's `fromDecision` counts the first kind, so "seven from the decision, one added by hand" is
  sayable. The same ask of the same person, already open on a room, **attaches** to the open
  obligation rather than doubling it: creation returns `created` and `attached` separately, the
  row's `repeatCount` climbs, and its date and age are kept.
- **Blocks carry a figure or nothing.** `amount` is null when there is no figure; zero is refused
  at the write, so never render "₦0 blocked".
- **Two people acting at once.** The obligation is versioned; the loser gets a refusal asking them
  to reload, not an error page.
- **Reassignment resets acceptance, not age.** The new person gets an `unaccepted` obligation;
  `firstCreatedAtUtc` is unchanged and `originalToUserId` still names who was first asked. The
  history line carries the previous owner in `aboutUserId`.
- **`roomTitle` can be null on an obligation you can see.** The recipient of a handoff from a
  restricted room sees the ask and not the room; `roomId` is still given, and the room refuses
  them itself. Chains from restricted rooms are absent from the index for anyone who cannot see
  inside, administrators included.
- **Reads are counted by a call, not by reading.** `POST …/read` when the recipient opens the
  obligation; it counts at most once a day and returns whether it counted. `readCount` on the
  unaccepted card is what lets it say "read four times, accepted zero".
- **A chain's `state` is derived**: `live`, `closed` (nothing open), `recovering` (the room is), or
  `unowned` (the room is). Nothing stores it.

**Phase 2 — the ladder, the overdue and load views, settings**

| Route | What it is |
|---|---|
| `GET /api/flolyt/handoff/overdue` | Everything past its date, with `escalatedToName` / `escalatedOnDay` or `escalatedToNobody`, and `concentration` |
| `GET /api/flolyt/handoff/load` | Open obligations by team, by person and by class, with `largestSameRequest`. Counts and days only |
| `GET`/`PUT /api/flolyt/settings/handoff-escalation` | The ladder, rung by rung, and the two switches an administrator may flip |
| `GET /api/flolyt/settings/handoff/teams` · `PUT …/teams/{teamId}/lead` | The mirrored teams, their members, and who each escalates to |
| `POST /api/flolyt/handoff/o/{id}/redate` | The recipient moves the binding date (`dueAtUtc`, optional `reason`) |

- **Rows now carry `toTeam`.** Null when the person is on no team; the load view groups those
  under "No team", which is a real group and not an error.
- **The ladder's `delivery` has three values.** `delivered`; `recorded-not-delivered` for the
  day-three pin (daily list), whose surface does not exist yet; and `unavailable` for the
  day-seven "one level up", because nothing knows who is above a team lead. The reminder rung is
  now `delivered`: it goes into the owner's morning digest (see *The digest* below).
  Render all eight rungs. A ladder shown shorter than intended is the wrong promise.
- **"Confirm or re-date" arrives in the inbox** as a `NeedsYou` item with actor `Handoff` on the
  due date and stays while the obligation is overdue; `redate` answers it. The chain owner (day
  one) and the team lead (day three) get `Systems` items from `AppNotification`s under category
  `Handoff`, with an `actionUrl` to the obligation.
- **`escalatedToNobody` is a finding, and it can sit beside a name.** `escalatedToName` and
  `escalatedOnDay` are the highest rung that reached a person; `escalatedToNobody` says the
  ladder's latest attempt reached nobody. "Ifeoma · day 1" with `escalatedToNobody` true means the
  chain owner was told and then day three found no lead. An unaccepted obligation with nothing
  fired is nobody with no name. The teams settings page is where a missing lead is fixed.
- **A person the ladder told can open the obligation.** The chain owner and the team lead see it
  from the moment they are notified, so the link in their notification resolves. They still do not
  see inside a restricted room.
- **Returned obligations sit on the plays board** as `returnedObligations`: unaccepted for seven
  days, still owed by the person named, still unaccepted. Escalation never reassigns.
- **Team leads are chosen here, not in UserAccess.** The teams page lists what the workspace's
  teams look like from Campaigns; an administrator picks a lead from each team's members.
- **The load view shows, never scores.** There is no rate anywhere in the shape. Do not compute one.

**Phase 3 — the seams**

- **A decision names its recipients.** `POST /rooms/{id}/decision` takes `recipients`
  (`userId`, `what`, `class`); the decision read returns them. Once the decision is decided each
  becomes an unaccepted obligation on its chain, asked for by the policy's `defaultProposedDays`
  (editable on `PUT /settings/handoff-escalation`, 1 to 90). A name added later is asked at once.
- **A close names what is outstanding.** `POST /rooms/{id}/close` takes `outstanding`
  (`toUserId`, `description`, `class`, optional `proposedDueAtUtc`). Each becomes an obligation on
  the chain, or beside the room when nothing was decided.
- **Instrumentation requests are obligations too.** A request with an owner carries an
  obligation of class `instrumentation` and origin `instrumentation`, on the owner's list and the
  load view. Closing either closes both. The Adopt screen's request queue changes nothing.
- **The agent drafts.** A `draft_handoffs` proposal arrives in the inbox as "drafted obligations:
  N obligations from the decision in …" with reach as people asked and no money. It is not a play
  and never appears on the plays board. Accepting it creates the obligations under the decision
  owner's name. The guardrails screen has a new surface, "Drafting handoffs", Suggest by default.
- **The chain page has a `timeline`**: the room's log, oldest first. Render it as the story
  before the obligations table.
- **Share a chain** with the existing share-link flow, subject type `HandoffChain` and the
  room id as subject. Only the room's owner or an administrator may mint one. The shared view is
  `chain`: room title, decision statement, and each obligation's description, who owes it by
  name, class, state and dates. No ids, no customer data.
- **Share a room** the same way, subject type `Room` and the room id as subject. This is R29's
  "share a read-only view" alternative to adding somebody. Same minters as the chain. The link
  lives at most seven days: omit `expiresAtUtc` and it gets them; ask for longer and the request
  is refused with the rule. The shared view is `room`: title, `state` (`open`, `recovering`,
  `archived`), stage and condition labels, currency, population and amount at risk, opened date,
  opening number, owner by name, counts of people and agents inside, `decision` (statement,
  guardrails, `decided`, drafted-by and decided-by labels), `whatWouldChangeThis`, `dissent`
  (wording, name, withdrawn, borne out), `evidence` (statement, grade, source, window, n) and
  `outcome` once archived (kind, closed date, recovered, how measured, exclusion, revisit
  condition). No thread, no log, no plays, no cohort, no ids. A room restricted after the link
  was minted answers like any dead link until the restriction lifts.
- **Creation returns two lists.** `POST /rooms/{id}/decision/handoffs` and the draft's accept
  return `created` and `attached`; an attached id is an open obligation the ask joined.

**Phase 4 — departures**

| Route | What it is |
|---|---|
| `GET /api/flolyt/settings/departures` | Every announced departure, open first, with `holds` (what is still theirs) and `reassigned` |
| `GET /api/flolyt/settings/departures/{id}` | One departure: `rows`, `items`, `handoverComplete` |
| `POST /api/flolyt/settings/departures` | Announce: `userId`, `lastDayUtc`. Administrators only |
| `POST …/departures/{id}/reassign` | `kind` (`room`, `obligation`, `stage`), `subjectId` (room id, obligation id, or stage key), `toUserId` |
| `POST …/departures/{id}/cancel` | `reason` required. What was already handed over stays where it went |

- **Rows are the screen.** Each has `kind`, `label`, `count` (what is still theirs), `behind`
  (money per market, never summed across markets), `ifNothingIsDone`, `reassigned`, and a `state`:
  `pending`, `chosen`, `kept`, `not-tracked`, or `nothing`. The three that transfer are rooms,
  obligations and stages. Decisions and dissent are `kept` with the count and a note. Approvals,
  goals and a standing authority are `not-tracked`, each with a note saying why; render the note,
  never a zero as if it were measured.
- **Items are what to hand over**, one per room, obligation and stage, with `goesToUserId` and
  `goesToName` once chosen. A thing handed over drops out of `items` and its row's `count`, and
  the row's `reassigned` climbs.
- **`handoverComplete`** is true when nothing that transfers is still theirs.
- **After the last day**, when the membership actually ends, the departure's `state` is `left`.
  Rooms not handed over become unowned and say so in their log; obligations keep their person and
  every row shows `toHasLeft: true`. Reassign those through the ordinary obligation reassign, not
  the departure, which is closed.
- **Obligation rows everywhere now carry `toHasLeft`.** Render a person who has left as such,
  by name; do not hide the name.

**Not yet**, so nothing should wait for it: "a play is blocked by another team's work" as a
trigger.

### The digest — what moved, what needs you, what could not be said

All three phases of `docs/digest-plan.md` (spec 15, D02/D04/D05/D06/D09/D10/D12/D14). A digest is
**built once and never changed**: at 06:00 where the person is, one per person per local date, stored as sent. Every
read here is of a stored run. There is nothing to act on from a digest; it is a summary of work,
never a queue.

```
GET  /api/flolyt/digest?date=yyyy-MM-dd      today's when omitted; 404 before the day's build
GET  /api/flolyt/digest/archive
GET  /api/flolyt/digest/excluded?date=
```

- **`sections[]`** in order: `needs-you`, `resolved`, `new`. Each item carries `ruleKey` (which
  of the rules admitted it), `refType`/`refId`, `summary`, `context` (the room), `atStake` and
  `currency` where money is involved, and `occurredAtUtc`. Render `summary` as written; it is
  frozen at build time and will not match a live read later, which is the point.
- **The rules.** Fixed on: a play in a room you own needs approval; an obligation you owe is
  overdue, due today or inside the reminder window; a room in your stage has no owner (to the
  stage's owner, else the workspace administrator); a guardrail stopped a send in a room you are
  in. Editable in phase 2, on by default: a room opens at or above the threshold for its currency
  (the workspace default is 25M in its own currency; a currency with no threshold is always
  admitted and the summary says so); a room you own closes. Never sent: an agent finishing a run,
  a campaign sending on schedule, comments in rooms you are not in.
- **`quietDay`** is a real state: every section empty and `headline` "Nothing needed you". Render
  it as the day's digest, not as an absence.
- **Restricted rooms** follow R31 here as everywhere: a reader who cannot see inside gets the room's
  title with `restricted` in the summary and null `context`, `atStake` and `currency`. The weekly
  leaves such rooms' money out and counts them in `restrictedRoomsExcluded`; the archive says a
  restricted room `closed · restricted` without what it recovered.
- **`complete` and `degradedSources[]`.** A source that is degraded or not connected marks the
  run incomplete and appears with its `status`, `lastDeliveredAtUtc` and `unknown[]` (what the
  digest consequently cannot say). `sources[]` is the whole panel as it stood. Nothing is carried
  forward or filled.
- **`counts`**: `happened`, `inDigest`, `logOnly`, `suppressedByThreshold`, for D14's headline
  figures. **`/excluded`** returns `rules[]` (each never-sent kind with its count, `whyLeftOut`,
  `whereItIs` and `changeable`) and `items[]` (the individual rooms left out, each with
  `exclusionReason`).
- **The archive** lists every run newest first: `date`, `headline`, `neededYou`, `atStake` per
  currency, `quietDay`, `complete`, with `daily`, `quietDays` and `neededYou` totals.
- **`howThisArrives`** is read from the delivery record: one row per channel with `state` as
  `sent`, `skipped · why` or `failed · why`. In product always sends. Email sends when the person
  has it on, a template is configured and they have an address; otherwise the row says which.
- **A notification per digest.** Category `Digest`, one per run, titled with the headline and
  linking to `/digest?date=`. It says a digest arrived, never what needs acting on.

**Settings** (D09, D10):

```
GET  /api/flolyt/settings/digest            the rules with yesterday's counts; thresholds; what the threshold hides
PUT  /api/flolyt/settings/digest            {thresholds: {NGN: 100000000}, includeClosures}   yours
PUT  /api/flolyt/settings/digest/rules      {thresholds, includeClosures}                     administrators
GET  /api/flolyt/settings/digest/channels
PUT  /api/flolyt/settings/digest/channels   {emailEnabled, timeZoneId}
```

- **`rules[]`** is the D09 table: `key`, `label`, `threshold` (`always`, `never`, or the per-currency
  figures), `yesterday` (how many the rule admitted or counted), `changeable`, `state` (`on`, `off`,
  `off by design`). Render every row; the four fixed ones have no control.
- **Quieter, never louder.** A person can raise a currency's threshold above the workspace's
  (a value below it is refused with the floor in the message; zero clears the raise) and switch
  their own closures off. `thresholds[]` shows the workspace's, theirs, and the effective one.
  Only an administrator changes the workspace's through `/rules`.
- **`whatTheThresholdHides[]`**, per currency with a threshold: rooms the person owns below it and
  their combined amount, and what yesterday's digest would have held at a fifth of the threshold
  and at four times it, computed over yesterday's stored items. Flolyt's suggestion line is not
  built; it needs response times, which are phase 3.
- **Channels.** In product and email carry state, health and `lastDeliveredAtUtc` (the last
  success, not the last attempt). Slack, Teams and push say `not connected`; the weekly roll-up
  says `not built`. `timeZoneIsYours` says whether the person set a zone or inherits the
  workspace's; `builtAt` on the settings read is their "06:00 Lagos".
- **Whose morning.** A person who sets `timeZoneId` is built at 06:00 there; everyone else at the
  workspace's. Quiet hours are not built: the digest is the quiet channel, and there is no
  out-of-band channel yet for them to hold.

**The archive learns** (D04, D05):

- **`whatHappenedAfter[]`** on every digest read: one row per included line with `youDid`
  (`approved`, `approved with edits`, `rejected`, `done`, `withdrawn`, `disputed`, `owned`,
  `closed`, `resumed`, `read it`, or `nothing`), `whenUtc` where the act is dated, and `outcome`
  (where the thing stands now: `still waiting`, `still unowned`, `still open · due 9 Sep`, the
  close's kind and what it recovered). Looked up live; the digest itself does not change. "Read it"
  is derived from the reference, not from a read receipt, because nothing records when a digest was
  opened.
- **The archive covers the last ninety mornings.** Older runs are kept and readable by date; the
  archive list and its panels stop at ninety days so the live look-ups behind them stay bounded.
- **Archive rows** now carry `actedWithinHours` (from the build to the first act on a needs-you
  line; null when nothing was acted on) and `outcome` (`quiet day`, `nothing needed you`, `not
  acted on`, the single act's name, `all acted on`, or `2 of 3 acted on`).
- **`patterns[]`**: a reference that sat in needs-you three or more consecutive mornings, with
  `appearances`, `firstDate`, `lastDate` and `stillOpen`. Render the prototype's "three digests in a
  row named the Ghana room" from this.
- **`responseTime`**: `neededYou`, `actedOn`, `actedSameDay`, `medianHours` (null until something
  was acted on) and `outstanding`.

**The weekly roll-up** (D06):

```
GET  /api/flolyt/digest/weekly?date=yyyy-MM-dd     the last completed Mon–Sun week, or the week containing date
```

Computed on request in the person's clock, not stored. `roomsOpened` and `roomsOpenedByAgents`,
`roomsClosed` with `recovered[]` per currency, `decisionsMade`, `playsStillWaiting`, `goalsMoved`
(a string, `unavailable · goals are not built`), a `paragraph`, and `whatMoved[]` with
`startOfWeek`, `endOfWeek`, `change`, `comment` and `known`. Render a `known:false` row as a row,
with its comment, not as a blank: ownership keeps no history, and sources at the start of the week
exist only if a digest was built for the person that week.

**Notification rules** (D12):

```
GET  /api/flolyt/settings/notifications
```

`rules[]` with `when`, `whoItReaches`, `channel`, `urgency`, `firedThisWeek`, `state` and
`changeable` (always false: these are the product's rules, not switches). `quietHours` is a
sentence saying there is no setting and why. There is no `PUT`; D13 has nothing to edit yet.

## Not built — so nobody waits

- **SSO / SAML.** Deferred until a specific deal names an identity provider. No `AddOpenIdConnect`,
  no SAML.
- **Owner and Viewer roles.** Frame 08's ladder is Owner / Approver / Member / Viewer. Owner is not
  derivable for a person today; Viewer cannot be expressed at all. Build against Member / Lead /
  Administrator.
- **Removal propagation.** Removing a team member does not reach the workspace roster, so removed
  people still appear in mentions and stage-owner pickers.
- **Definitions do not yet change any figure.** Saving one records what a stage means and nothing
  reads it back — the bridge still produces Activate, Retain and Churn, and the other seven stages
  still read `unavailable`. So a stage can be `isDefined: true` and still have no numbers. Build the
  definition screen fully; do not wire it to expect the map to move.
