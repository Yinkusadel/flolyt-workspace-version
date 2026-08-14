# Flolyt build tracker

Source of truth for design: `flolyt-kit-122/README.md` (kit overview + section table) and
`flolyt-kit-122/{nn}-{slug}.svg` (one SVG per screen, numbered to match the `#` column
below).

Update this file as we go: flip `Status` when a screen's implementation starts/lands, fill
`Endpoint(s)` with the service/hook file(s) built for it, and use `Notes` for corrections
the user makes to the Figma/kit so we don't lose them between sessions.

**Status legend:** `[ ]` not started · `[~]` in progress · `[x]` built · `[!]` needs
correction (see Notes)

---

## 1. Getting started (01–09)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 01 | sign up | [ ] | | |
| 02 | sign in | [x] | `services/api/auth/sign-in.ts`, `features/auth/use-sign-in.ts` | Built email+password (matches existing hook), not the SVG's magic-link/SSO flow — see user decision in session |
| 03 | create workspace | [ ] | | |
| 04 | business model | [ ] | | |
| 05 | connect first source | [ ] | | |
| 06 | source connected | [ ] | | |
| 07 | meet your agents | [ ] | | |
| 08 | invite team and roles | [ ] | | |
| 09 | workspace first run | [ ] | | |

## 2. Every day (10–14)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 10 | command bar | [ ] | | |
| 11 | workspace home consumer | [ ] | | |
| 12 | workspace home accounts | [ ] | | |
| 13 | inbox | [ ] | | |
| 14 | search | [ ] | | |

## 3. The lifecycle (15–26)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 15 | lifecycle map | [x] | | Static mock data (`src/pages/lifecycle/data.ts`); no lifecycle-overview endpoint wired yet |
| 16 | stage acquire | [x] | | `/lifecycle/acquire`. Static mock data in `src/pages/lifecycle-stage/acquire.tsx` |
| 17 | stage activate | [x] | | `/lifecycle/activate` |
| 18 | stage price | [x] | | `/lifecycle/price` |
| 19 | stage adopt | [x] | | `/lifecycle/adopt` |
| 20 | stage retain cohorts | [x] | | `/lifecycle/retain` — SVG header reads "Cohort retention", kept as page title |
| 21 | stage expand | [x] | | `/lifecycle/expand` |
| 22 | stage support | [x] | | `/lifecycle/support` |
| 23 | stage renew | [x] | | `/lifecycle/renew` |
| 24 | stage advocate | [x] | | `/lifecycle/advocate` |
| 25 | stage churn | [x] | | `/lifecycle/churn` |
| 26 | stage release impact | [x] | | `/lifecycle/release-impact` — no card links here in the kit; reachable via a "View release history" link on the Churn page |

## 4. Rooms and decisions (27–35)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 27 | room cohort war room | [x] | | `/rooms/second-order-never-happened`. Static mock data in `src/pages/rooms/data.ts` |
| 28 | room account war room | [x] | | `/rooms/northwind-retail` — not linked from the Rooms index (see note below) |
| 29 | room evidence tab | [x] | | `/rooms/:roomId/evidence`, shared across war-room and persistent kinds |
| 30 | room log tab | [x] | | `/rooms/:roomId/log` |
| 31 | room account persistent | [x] | | `/rooms/northwind-retail-persistent` — not linked from the Rooms index |
| 32 | room empty/recovering/archived | [x] | | Implemented as three real rooms' Decision-tab states, not a single spec sheet — see `lagos-delivery-failures` (empty), `cards-failing-on-renewal-night` (recovering), `discount-only-buyers` (archived) |
| 33 | proposal review states | [x] | | Implemented as `ProposalCard`'s pending/editing/decided states inside the Decision-tab play board |
| 34 | run status states | [x] | | Implemented as `RunStatusBar`'s state machine; only queued/running/cancelRequested/cancelled are reachable from the UI, failed/reconnect are defined but not demo-wired |
| 35 | plays at scale | [x] | | Per user: this is the room's own Plays tab, not a separate cross-room surface — built as `PlaysTab`, `/rooms/:roomId/plays` |
| — | Rooms index | [x] | | `/rooms` — screen supplied directly by the user (not in the 122-frame kit). Lists cohort war rooms only, per its own subtitle ("about a cohort, not a customer"); the two Northwind Retail rooms (account war room + persistent) are reachable by direct link only |
| 115 | approve with re-auth | [x] | | `ApproveReauthModal`, opens from a play's Approve button when `reauthAmount` is set |
| 121 | pause an agent | [x] | | `src/pages/ai-teammates/pause-agent-modal.tsx` — reachable from the room header's agent chip and from the new `/ai-teammates` stub page |

## 5. Audiences and campaigns (36–43)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 36 | segments | [ ] | | |
| 37 | audience builder | [ ] | | |
| 38 | audience at scale | [ ] | | |
| 39 | campaign studio | [ ] | | |
| 40 | campaigns index | [ ] | | |
| 41 | campaign send monitor | [ ] | | |
| 42 | campaign performance/lift | [ ] | | |
| 43 | experiment detail | [ ] | | |

## 6. Revenue surfaces (44–50)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 44 | leakage map consumer | [ ] | | |
| 45 | leakage map accounts | [ ] | | |
| 46 | involuntary churn/dunning | [ ] | | |
| 47 | revenue forecast | [ ] | | |
| 48 | business memory | [ ] | | |
| 49 | customer profile consumer | [ ] | | |
| 50 | customer profile account | [ ] | | |

## 7. Teams (51–58)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 51 | team marketing | [ ] | | |
| 52 | team product | [ ] | | |
| 53 | team sales | [ ] | | |
| 54 | team customer success | [ ] | | |
| 55 | team engineering | [ ] | | |
| 56 | executive unit economics | [ ] | | |
| 57 | cross-functional handoff | [ ] | | |
| 58 | routing | [ ] | | |

## 8. Governance and infrastructure (59–66)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 59 | agent autonomy | [ ] | | |
| 60 | frequency and fatigue | [ ] | | |
| 61 | compliance consent | [ ] | | |
| 62 | consent at scale | [ ] | | |
| 63 | delivery mesh | [ ] | | |
| 64 | data sources | [ ] | | |
| 65 | markets and currency | [ ] | | |
| 66 | ai teammates directory | [ ] | | `/ai-teammates` currently has only a minimal stub (agent list + Pause action) built to host screen 121 — the real directory screen isn't built |

## 9. Mobile (67–69)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 67 | mobile home | [ ] | | |
| 68 | mobile room | [ ] | | |
| 69 | mobile approvals | [ ] | | |

## 10. System (70–74)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 70 | failure states | [ ] | | |
| 71 | design system core | [ ] | | |
| 72 | design system multiplayer | [ ] | | |
| 73 | design system vocabulary | [ ] | | |
| 74 | design system lifecycle/teams | [ ] | | |

## 11. Goals and daily prioritisation (75–79)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 75 | set goals | [ ] | | |
| 76 | goal tracker | [ ] | | |
| 77 | recommendations feed | [ ] | | |
| 78 | value and roi | [ ] | | |
| 79 | daily digest | [ ] | | |

## 12. Analysis surfaces (80–84)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 80 | funnel explorer | [ ] | | |
| 81 | scenario simulator | [ ] | | |
| 82 | attribution | [ ] | | |
| 83 | benchmarking | [ ] | | |
| 84 | health scoring | [ ] | | |

## 13. Playbooks, experiments, agents (85–90)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 85 | playbook library | [ ] | | |
| 86 | playbook activation | [ ] | | |
| 87 | experiments | [ ] | | |
| 88 | agent builder | [ ] | | |
| 89 | agent detail | [ ] | | |
| 90 | agent marketplace | [ ] | | |

## 14. Data and identity (91–94)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 91 | data health | [ ] | | |
| 92 | entity resolution | [ ] | | |
| 93 | schema mapping | [ ] | | |
| 94 | reply inbox | [ ] | | |

## 15. Admin and security (95–101)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 95 | members and roles | [ ] | | |
| 96 | security and sso | [ ] | | |
| 97 | audit log | [ ] | | |
| 98 | data and residency | [ ] | | |
| 99 | notification rules | [ ] | | |
| 100 | integrations | [ ] | | |
| 101 | plan and billing | [ ] | | |

## 16. Extensibility and community (102–107)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 102 | developer portal | [ ] | | |
| 103 | embedded and white label | [ ] | | |
| 104 | dashboard builder | [ ] | | |
| 105 | community | [ ] | | |
| 106 | recognition | [ ] | | |
| 107 | language and format | [ ] | | |

## 17. Mobile (108–110)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 108 | mobile leakage map | [ ] | | |
| 109 | mobile notifications | [ ] | | |
| 110 | mobile approval | [ ] | | |

## 18. Source catalogue and authorisation (111–112)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 111 | connect source catalogue (165 connectors) | [ ] | | |
| 112 | connect source authorise (read-only scopes) | [ ] | | |

## 19. Action modals (113–122)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 113 | invite people | [ ] | | |
| 114 | audience builder modal | [ ] | | |
| 115 | approve with re-auth | [ ] | | |
| 116 | export for the board | [ ] | | |
| 117 | share a view | [ ] | | |
| 118 | map a field | [ ] | | |
| 119 | notification rule | [ ] | | |
| 120 | change plan | [ ] | | |
| 121 | pause an agent | [ ] | | |
| 122 | erasure review | [ ] | | |
