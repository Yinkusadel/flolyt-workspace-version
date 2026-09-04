# Lifecycle domain — master reference (pasted 2026-09-04)

Source: "Flolyt · Campaigns module · Lifecycle — Flolyt Lifecycle Endpoints," pasted by the user
2026-09-04. This is the **full-surface reference doc** for everything behind the lifecycle map, the
leakage map, and the ten stage pages — 116 mapped routes across 6 files under
`API/Flolyt.API/Modules/Campaigns/Endpoints/Lifecycle/`. It supersedes prose claims in
[`lifecycle.md`](lifecycle.md) wherever the two disagree (that file's per-endpoint entries, built
from live-tested responses, still win on exact field shapes — see "How this relates to lifecycle.md"
at the bottom). The user is sharing the actual endpoint specs next, ~20 at a time, for us to confirm
service/hook/doc coverage against this reference and wire what's newly available.

**Base:** `/api/flolyt` (omitted below, every path is relative to it) · **Auth:** Bearer JWT, every
route · **Envelope:** `Result<T>` (`succeeded`, `data`, `messages`) · **Stage tabs built:** 32 of 33.

## 1. The map layer

Workspace-wide surfaces, not scoped to one stage.

- `GET /lifecycle/map` — the ten-stage spine: population, at-stake per currency, owner, open rooms,
  headline figure, narrative callouts, referral-reach banner.
- `GET /lifecycle/market/{country}` — the same map through one market's lens. Undeclared market is
  refused, not an empty map.
- `GET /lifecycle/leakage-map?stage=` — rows × conditions × market. `?stage=` narrows to one
  business stage's own leak table, crossing the two axes through the lifecycle bridge — **only
  Activate, Retain and Churn can be read this way**; the other seven return no rows plus a
  `stageUnreachable` line explaining why. The segment grid is omitted under a filter.
- `GET /lifecycle/distribution` — how the customer base spreads across the five customer states.
- `PUT /lifecycle/map/{stageKey}/owner` — names the accountable person for a stage. Admins only.

## 2. The stage page

Nine screens are shared by all ten stages — Overview, Cohorts, Compare, History, Markets, Changes,
Change registry, Definition, Agents. `{stageKey}` ∈ `acquire activate price adopt retain expand
support renew advocate churn`; anything else is refused with that list. Anything beyond these nine
is stage-specific — see the tab matrix (§3).

**Overview and tabs**
- `GET /lifecycle/stages/{stageKey}` — Overview itself: population, rate of change, YoY, primary
  conversion, at-stake per currency, departure breakdown with per-group trend, ownership standing,
  narrative callouts. Advocate additionally carries `referralReach`.
- `GET /lifecycle/stages/{stageKey}/screens` — **the tab bar, not tab content.** One entry per
  stage-specific tab (the nine shared ones aren't listed here) — key, label, the question it
  answers, and either `route` (built) or `needs`+`wouldUnlock` (gated). See §3 for the full
  `status` semantics — this is the single call a client needs to render a stage's whole tab bar,
  greyed tabs included, without 28 separate "unavailable" round-trips.

**Measurement**
- `GET /lifecycle/stages/{stageKey}/cohorts?months=6` — entry cohorts compared at equal age.
- `GET /lifecycle/stages/{stageKey}/compare?months=3` — two adjacent windows of the stage's own
  history: closing population/conversion for each, delta in customers, conversion change in points.
  Clamped 1–12.
- `GET /lifecycle/stages/{stageKey}/history` — the monthly series, restated months marked.
- `GET /lifecycle/stages/{stageKey}/markets` — the stage broken out by market, never blended across
  currencies.

**Definition and what changed**
- `GET /lifecycle/stages/{stageKey}/definition` — entry event, exit rules, exclusions, version,
  author.
- `POST /lifecycle/stages/{stageKey}/definition/preview` — what a proposed definition would count,
  before saving.
- `PUT /lifecycle/stages/{stageKey}/definition` — saves it, queues the 12-month restatement.
- `PUT /lifecycle/stages/{stageKey}/conversion` — marks one exit rule as "succeeding" in this stage.
- `GET /lifecycle/stages/{stageKey}/changes?from=&to=` — business changes recorded against this
  stage in a window.
- `GET /lifecycle/stages/{stageKey}/change-registry` — the registry view with measured effect per
  change.

**Agents and conditions**
- `GET /lifecycle/stages/{stageKey}/agents` — which agents watch this stage, on what thresholds,
  routed where. Each carries a readiness: `ready` / `reading` / `not-ready`, naming what it needs.
- `POST /lifecycle/stages/{stageKey}/conditions` — opens a watched condition on this stage.
- `POST /lifecycle/stages/{stageKey}/conditions/backtest` — how often a proposed threshold would
  have fired against real history.

## 3. The tab matrix — `/screens`' `status` semantics

`status` is resolved **per workspace**, three values:

- **`built`** — fetch `route`.
- **`source-missing`** — this workspace hasn't connected the input; `needs` names what to connect.
- **`not-built`** — the source is connected and readable, Flolyt just doesn't compute this screen
  from it yet. **Currently zero occupants** — every screen whose source a workspace *could* connect
  is now computed from it (this is new: the old doc pass called cost-of-goods "dark for everyone,"
  which was wrong — most commerce schemas already carry a cost-per-item column, the gap was a
  missing semantic-vocabulary *role* to recognise it, now closed).

`blocked` carries a one-sentence render-ready string on both unbuilt states. Tallies: `built` /
`gated` (waiting on the workspace) / `unbuilt` (waiting on us — currently always 0). The gated
callout counts **distinct sources**, not tab count, on purpose (4 tabs blocked by 1 missing
connection reads differently from 4 tabs blocked by 4).

**Advocate's Rewards is the one permanent exception (32/33 built).** Its `needs` doesn't name a
connector — the question it answers ("is the reward buying referrals, or paying for ones that would
have happened anyway?") needs a **causal test**, not a data source: a reward amount per referral,
plus a held-out group never offered the reward. Flolyt can read a reward column; it can't retroactively
manufacture the holdout a workspace never ran. This is a `source-missing`-shaped response with a
sentence instead of a schema role — **this tab will not close the way the other 32 did**, it needs
the workspace to run an actual A/B holdout on their referral reward program.

Example `/screens` payload (Advocate):

```json
{
  "stageKey": "advocate", "stageName": "Advocate",
  "screens": [
    { "key": "referrers", "name": "Referrers",
      "answers": "who refers, who stopped, and how concentrated that is",
      "isBuilt": true, "status": "built",
      "route": "api/flolyt/lifecycle/advocate/referrers",
      "needs": null, "blocked": null, "wouldUnlock": null },
    { "key": "rewards", "name": "Rewards",
      "answers": "whether the reward is buying referrals or paying for ones already coming",
      "isBuilt": false, "status": "source-missing", "route": null,
      "needs": "a reward amount on your referrals, and a group who were not offered the reward. Withhold the offer from a random slice, record which arm each customer was in, and map that column",
      "wouldUnlock": "payout against the referrals it actually caused" }
  ],
  "built": 3, "gated": 1, "unbuilt": 0,
  "callouts": [ "..." ]
}
```

### Per-stage tab list (stage-specific only — shared 9 not repeated)

| # | Stage | Built | Tabs |
| - | --- | --- | --- |
| 01 | Acquire (`acquire`) | 3/3 | Funnel `GET /lifecycle/acquire/funnel` · Channels `GET /lifecycle/acquire/channels` · Unit economics `GET /lifecycle/acquire/unit-economics` |
| 02 | Activate (`activate`) | 2/2 | Time to value `GET /lifecycle/activate/time-to-value` · Paths `GET /lifecycle/activate/paths` |
| 03 | Price (`price`) | 3/3 | Plans `GET /lifecycle/price/plans` · Margin `GET /lifecycle/price/margin` · Discounting `GET /lifecycle/price/discounting` |
| 04 | Adopt (`adopt`) | 3/3 | Features `GET /lifecycle/adopt/features` · Depth `GET /lifecycle/adopt/depth` · Not instrumented `GET /lifecycle/instrumentation` |
| 05 | Retain (`retain`) | 3/3 | Repeat curve `GET /lifecycle/retain/repeat-curve` · Segments `GET /lifecycle/retain/segments` · Reactivation `GET /lifecycle/retain/reactivation` |
| 06 | Expand (`expand`) | 3/3 | Upgrade paths `GET /lifecycle/expand/upgrade-paths` · Basket `GET /lifecycle/expand/basket` · Accounts `GET /lifecycle/expand/accounts` |
| 07 | Support (`support`) | 4/4 | Contact drivers `GET /lifecycle/support/contact-drivers` · Resolution `GET /lifecycle/support/resolution` · Deflection `GET /lifecycle/support/deflection` · Silent failures `GET /lifecycle/support/silent-failures` |
| 08 | Renew (`renew`) | 3/3 | Renewal book `GET /lifecycle/renew/renewal-book` · Dunning `GET /lifecycle/renew/dunning` · Pauses `GET /lifecycle/renew/pauses` |
| 09 | Advocate (`advocate`) | 3/4 | Referrers `GET /lifecycle/advocate/referrers` · Referral quality `GET /lifecycle/advocate/referral-quality` · **Rewards — gated, needs a holdout, see above** · Viral compounding `GET /lifecycle/advocate/viral-compounding` |
| 10 | Churn (`churn`) | 5/5 | Reasons `GET /lifecycle/churn/reasons` · Prediction `GET /lifecycle/churn/prediction` · Win-back `GET /lifecycle/churn/win-back` · Chain (whole lifecycle, one dated cause across all 10 stages) `GET /lifecycle/churn/chain` · Causes sent upstream `GET /lifecycle/churn/routings?stage=` + `POST /lifecycle/churn/route-upstream` + `POST /lifecycle/churn/routings/{routingId}/acknowledge` |

Note: `GET /lifecycle/instrumentation` is Adopt's 4th tab AND a standalone workspace-governance
route (§4) — same endpoint, two contexts.

## 4. Workspace governance

Reached from stage pages, scoped to the whole workspace:

- `GET /lifecycle/instrumentation` — what shipped that nothing measures (Adopt's 4th tab + the
  backlog behind it).
- `GET /lifecycle/watchable-metrics` — every metric a condition can legally be opened on.
- `GET /lifecycle/teams` — owning teams and leads; where an unowned stage's work falls back to.
- `POST /lifecycle/entry-events/measure` — how many customers a candidate entry event would admit,
  before a definition is written on it.

**The rest, in brief** (not yet individually documented in `lifecycle.md`):
```
GET /lifecycle/changes/{id}/impact          (already documented)
POST /lifecycle/changes                     (already documented)
POST /lifecycle/changes/from-room           (already documented)
DEL  /lifecycle/changes/{id}                (already documented)
PUT  /lifecycle/conditions/{id}
POST /lifecycle/conditions/{id}/decide
POST /lifecycle/conditions/{id}/mute
PUT  /lifecycle/teams/{team}/lead
PUT  /lifecycle/governance/room-cap
POST /lifecycle/instrumentation-requests
PUT  /lifecycle/instrumentation-requests/{id}/owner
POST /lifecycle/instrumentation-requests/{id}/close
```

## 5. Adjacent surfaces (not lifecycle, but reached from it)

A room opens on a leakage-map cell; a claim files against a departure group. ~70 routes under
`/rooms` and `/claims` — see [`rooms.md`](rooms.md) (or wherever the rooms domain doc lands) for
those, not duplicated here. Also cross-cutting, not lifecycle-scoped: `/home`, `/inbox`, `/search`,
`/command-bar`, `/sources`, `/plays`.

## 6. Reading the payloads — four conventions across every route above

1. **A figure is never a bare number.** Anything measurable is `Measured<T>`: either
   `{ isAvailable: true, value }` or `{ isAvailable: false, missingSource, wouldUnlock }`.
   Unavailable never renders as zero. **This is the same wrapper `lifecycle.md` already reverse-
   engineered from live responses as `{ value, state, missingSource?, wouldUnlock? }`** (`atStake`,
   `population`, `rateOfChange`, `primaryConversion` confirmed so far) — the two field names
   (`state: "unavailable"` vs `isAvailable: false`) describe the same contract; trust the live-
   confirmed shape in `lifecycle.md` over this doc's naming when wiring code, but treat "never a
   bare number, never a zero for unavailable" as confirmed policy everywhere in this domain now.
2. **Money is a list, never a total.** At-stake figures come back one per currency, ordered by
   currency code. Nothing sums across currencies, no exchange rate applied anywhere.
3. **A restating stage withholds rather than guesses.** While a definition change is being applied,
   figures carry a third state — `restating` — no value, no missing source. Withheld until the
   rewrite lands, so a figure that moved because the definition moved never reads as the business
   moving.
4. **Every response is wrapped** in `Result<T>` (`succeeded`, `data`, `messages`). A refusal is a
   400 with the reason in `messages` (unknown stage key → the list of ten). Room writes can also
   409 when the map moved underneath — meaning look again, then retry.

## How this relates to `lifecycle.md`

- `lifecycle.md` stays the **live-verified source of truth for exact field shapes** on the 18
  endpoints already scaffolded (services + hooks exist for all 18, only `GET /map` wired into a
  page as of 2026-08-31) — this doc doesn't replace that detail.
- This doc **adds the other ~98 routes** not yet scaffolded: all the per-stage tab-specific GETs
  (§3's table), `/screens` (the tab-bar discovery endpoint — likely the fix for `lifecycle.md`'s
  open question #2, "how does the map page know which changeId to spotlight," and definitely the
  fix for building each stage's tab bar instead of hardcoding which tabs exist per stage),
  `/conditions/*`, `/teams/*`, `/governance/*`, `/instrumentation-requests/*`.
- **Correction this doc makes to `lifecycle.md`'s own earlier text:** `lifecycle.md`'s `GET /map`
  entry still has a stale "Notes" line reading "`atStake` measured only for activate/retain/churn
  per the doc's own description" — that was already flagged wrong elsewhere in the same file (the
  coverage tracker's stage-cards row, confirmed live 2026-09-01) and should be deleted, not just
  contradicted, next time that file is touched.
- Next step per the user (2026-09-04): they're pasting the real endpoint specs for these ~98 routes
  in batches of ~20, to confirm against this reference and extend the same service/hook/doc
  treatment `lifecycle.md` already has for the first 18.
