/**
 * Mock content for the Churn stage — screens CH01-CH12 in
 * flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/ (CH13 "the whole
 * lifecycle, closed" lives at chain/index.tsx, not here). Numbers and copy
 * are transcribed directly from those SVGs (each one's footer states its
 * id, e.g. "CH06 · Churn · cohorts").
 */

import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";
import type { AssignOwnerPreset } from "@/pages/everyday/lifecycle/stage/modals/assign-an-owner-modal";

// ---- Shared across Definition/Overview/Agents (CH01/CH02/CH09) -----------

export const CHURN_ASSIGN_OWNER_PRESET: AssignOwnerPreset = {
  description: "Four breached thresholds route somewhere the moment somebody's name is on this",
  unownedTitle: "Unowned since 12 January",
  statsLine: "22 agent findings · 0 rooms · 4 breached thresholds · 31 unopened weekly lists",
  candidatesEyebrow: "Who should own it",
  candidates: [
    { id: "ngozi-bello", initials: "NB", color: "#2E8B7F", name: "Ngozi Bello", reason: "Already owns Renew, the stage every churned customer passed through last", selected: true },
    { id: "zainab-yusuf", initials: "ZY", color: "#7A5AA8", name: "Zainab Yusuf", reason: "Owns Activate · 51.8% of churn is attributed there" },
    { id: "amara-obi", initials: "AO", color: "#C56A2E", name: "Amara Obi", reason: "Owns Support · silent failures are the second-largest unowned reason" },
  ],
  consequencesEyebrow: "What happens the moment you assign",
  consequences: [
    { label: "Four breached thresholds route somewhere", value: "and open four rooms tonight", tone: "amber" },
    { label: "22 agent findings are delivered", value: "in tomorrow's 06:00 digest", tone: "teal" },
    { label: "The prediction model gets a first action", value: "₦31M · one approval, one wave", tone: "teal" },
    { label: "31 weekly lists stop going unopened", value: "starting with this week's", tone: "teal" },
    { label: "Their load", value: "Ngozi already owns Renew and 1 open room", tone: "amber" },
  ],
  closingTitle: "Assigning this is the cheapest action available in the workspace today",
  closingBody:
    "No engineering, no budget, no customer contact. One name against the stage every other stage empties into, and 31 weekly prediction lists stop being generated for nobody. It has been available since 12 January.",
  confirmLabel: "Assign Ngozi",
};

// ---- Definition (CH01) is now the shared DefinitionRoute template — see
// stage/definition/definition-route.tsx. GET .../definition has no field for the definition-
// window comparison below (30/60/90/120/180 days), so it isn't reproducible from live data;
// dropped.

// ---- Overview (CH02) --------------------------------------------------------

export const CHURN_OVERVIEW_LEAD = {
  title: "The second stage with no owner, and the one every other stage empties into",
  body: "1.02M customers left in twelve months. Nothing here is a cause — every reason on this screen was decided in one of the nine stages before it.",
};

// KPI row and leak table are both wired to the shared GET /lifecycle/stages/{stageKey} — see
// overview-tab.tsx's buildStageKpis and its `departures[]`-driven table.

export const CHURN_OVERVIEW_INSIGHT = {
  title: "Four of five rows point at another stage, and that is the correct answer",
  body: "Churn is not a problem to be solved in Churn. It is where nine stages' unresolved problems arrive, counted honestly, several months late. The only work that belongs here is measuring what left, naming why, and getting the reason back to the stage that can act on it.",
};

export const CHURN_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Never activated, left inside 90 days",
  carriedIn: [
    { label: "Stage", value: "Churn" },
    { label: "Entered", value: "last 12 months" },
    { label: "Never activated", value: "true" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "528,000 customers · ₦61M at stake",
  countedNote: "Counted 6 minutes ago · 58.5% of post-March cohorts",
  participants: [{ initials: "CH", kind: "agent" }],
  participantsNote: "Churn Reason leads · no owner assigned since 12 January",
};

export const CHURN_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Churn · overview · Nigeria",
  snapshotLabel: "Churn · overview · Nigeria · as of 13 Aug 08:12",
  shareOptions: [
    { id: "workspace", title: "Anyone at Lagos Foods with lifecycle access", note: "412 people · the default" },
    { id: "link", title: "This link, for anyone who has it", note: "expires in 7 days · no customer-level data ever travels" },
    { id: "snapshot", title: "A dated snapshot instead", note: "frozen at today's figures · for a board pack" },
  ],
  exportFormats: [
    { id: "csv", label: "CSV", note: "the tables" },
    { id: "pdf", label: "PDF", note: "board-ready" },
    { id: "png", label: "PNG", note: "one chart" },
  ],
  caveatTitle: "Every export carries its own asterisks",
  caveatBody:
    "19.2% of churn has no reason found and Ghana's reason data is unavailable entirely. Both travel with the file rather than being dropped from it — an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Send the reason upstream (CH12, churn-only modal) ----------------------
// Declared ahead of the Reasons rows below so the "Never activated" row can
// reference it directly.

// ---- Reasons (CH03, unique tab) is now wired to GET /lifecycle/churn/reasons — see
// reasons-tab.tsx. That endpoint has no "vs Feb" trend field and no per-row "send upstream" action
// (the send-reason-upstream-modal.tsx preset below was seeded with a specific mock finding, not
// real data), so those aren't reproducible from live data; dropped, and the now-orphaned modal
// deleted.

// ---- Prediction (CH04, unique tab) is now wired to GET /lifecycle/churn/prediction — see
// prediction-tab.tsx. That endpoint has no risk-score "weight", "available?" chip, or per-signal
// stage attribution — there is deliberately no fused score at all, per the endpoint's own note —
// so the old mock's KPIs, table and insight cards above aren't reproducible from live data;
// dropped.

export const CHURN_PREDICTION_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Predicted to churn in 30 days",
  carriedIn: [
    { label: "Stage", value: "Churn" },
    { label: "Entered", value: "this week's list" },
    { label: "Predicted", value: "true" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "118,000 customers · ₦188M at stake",
  countedNote: "Counted 6 minutes ago · 71% precision, 0 currently contacted",
  participants: [{ initials: "CH", kind: "agent" }],
  participantsNote: "Churn Reason leads · no owner assigned since 12 January",
};

// ---- Win-back (CH05, unique tab) is now wired to GET /lifecycle/churn/win-back — see
// win-back-tab.tsx. That endpoint has no days-since-last-order, offer description, or per-wave
// cost-per-recovery/verdict — waves are recognised by who they reached, not by offer or campaign
// metadata — so the old mock's KPIs, table and closing narrative above aren't reproducible from
// live data; dropped.

export const CHURN_WINBACK_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Annual “we miss you” campaign underperforming",
  carriedIn: [
    { label: "Stage", value: "Churn" },
    { label: "Entered", value: "last 12 months" },
    { label: "Campaign", value: "annual “we miss you”" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "61,000 sent · 2.1% won back",
  countedNote: "Counted 6 minutes ago · costs 4.4× more than the best-performing campaign",
  participants: [{ initials: "CH", kind: "agent" }],
  participantsNote: "Churn Reason leads · no owner assigned since 12 January",
};

// ---- Cohorts (CH06) is wired to the shared GET /lifecycle/stages/{stageKey}/cohorts — see
// acquire/data.ts's Cohorts note and cohorts-tab.tsx. Its "Open a war room" header button is
// dropped along with it, same reason as its Markets tab's — seeded with a hardcoded March-cohort
// finding tied to the old fabricated mock, not a generic affordance.

// ---- Markets (CH07) is wired to the shared GET /lifecycle/stages/{stageKey}/markets — see
// acquire/data.ts's Markets note and markets-tab.tsx. Churn's bespoke "Ghana across all ten
// stages" cross-stage table and its "Open a war room" header button are both dropped along with
// it — neither is backed by this (or any) endpoint; both were hand-authored narrative built
// entirely around the old mock's fabricated Ghana story.

// ---- What changed (CH08) -----------------------------------------------------
// Wired live (see stage/changes/changes-tab.tsx, GET /lifecycle/stages/{stageKey}/change-registry)
// — no mock export here anymore.

// ---- Agents (CH09) is wired to the shared GET /lifecycle/stages/{stageKey}/agents — see
// acquire/data.ts's Agents note and agents-tab.tsx.

export const CHURN_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "Predicted churn exceeds a threshold", note: "30-day prediction model output" },
  byMoreThan: { label: "By more than", value: "50,000 customers", note: "against the trailing weekly list" },
  sustainedFor: { label: "Sustained for", value: "0 days", note: "opens immediately once the weekly list is produced" },
  segmentedBy: { label: "Segmented by", value: "market, reason", note: "so Ghana's blind spot is findable, not averaged away" },
  routesTo: {
    name: "The Churn stage owner",
    note: "This rule currently has no destination — the stage has no owner",
  },
  simulation: {
    title: "Against the last twelve months, this would have fired thirty-one times",
    body: "Every week since 12 January, when the prediction model went live. It has never opened a room because the rule routes to a stage owner and that condition has no owner assigned.",
  },
};

// ---- History (CH10) is wired to the shared GET /lifecycle/stages/{stageKey}/history — see
// acquire/data.ts's History note and history-tab.tsx.

// ---- Compare periods (CH11) is wired to the shared GET /lifecycle/stages/{stageKey}/compare —
// see acquire/data.ts's Compare note and compare-route.tsx.
