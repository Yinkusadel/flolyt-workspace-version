/**
 * Mock content for the Support stage — screens SU01-SU13 in
 * flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/. Numbers and copy
 * are transcribed directly from those SVGs (each one's footer states its
 * id, e.g. "SU06 · Support · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { DefinitionCandidate } from "@/pages/everyday/lifecycle/stage/definition/definition-route";
import type { InsightCard } from "@/pages/everyday/lifecycle/stage/activate/data";
import type { ActionCard } from "@/pages/everyday/lifecycle/stage/detail/detail-drilldown";
import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";

// ---- Definition (SU01) -----------------------------------------------

export type SupportOutcomeRow = {
  id: string;
  whatHappened: string;
  customersPerMo: string;
  contactedUs: string;
  contactedUsTone: "teal" | "rose";
  repeatRateAfter: string;
  repeatRateAfterTone: "teal" | "amber" | "rose";
  vsBase: string;
  vsBaseTone: "teal" | "amber" | "rose";
  verdict: string;
  verdictTone: ChipTone;
};

export type SupportDefinitionData = {
  title: string;
  subtitle: string;
  insightTitle: string;
  insightBody: string;
  candidatesEyebrow: string;
  candidates: DefinitionCandidate[];
  tableEyebrow: string;
  rows: SupportOutcomeRow[];
  closingTitle: string;
  closingBody: string;
};

export const SUPPORT_DEFINITION: SupportDefinitionData = {
  title: "What counts as support",
  subtitle: "Support · owned by Support · last changed 12 January by Amara Okeke",
  insightTitle: "Support is in the lifecycle because contacting us is a revenue event",
  insightBody:
    "Every other tool in this company measures support as a cost — tickets, handle time, cost per contact. This stage measures the only thing the rest of the lifecycle cares about: what happens to a customer's revenue after they get in touch, and whether the reason they got in touch was our fault.",
  candidatesEyebrow: "A customer is in support when",
  candidates: [
    {
      id: "opens-a-ticket",
      label: "They open a ticket",
      description: "The support team's own definition. Excludes everyone who had a problem and did not bother.",
      field: "helpdesk · 12,800 / month",
    },
    {
      id: "contact-any-channel",
      label: "They contact us by any channel",
      description: "Truer to reality. Still only counts people who spoke.",
      field: "helpdesk + chat + social · 21,400 / month",
    },
    {
      id: "something-went-wrong",
      label: "Something went wrong for them, whether or not they told us",
      description: "Includes the 39,600 who had a failed or late delivery and never contacted anyone.",
      field: "delivery + orders + helpdesk · 61,000 / month",
      selected: true,
    },
  ],
  tableEyebrow: "The 39,600 who never said anything",
  rows: [
    { id: "delivery-late-complained", whatHappened: "Delivery late, complained", customersPerMo: "12,100", contactedUs: "100%", contactedUsTone: "teal", repeatRateAfter: "24.1%", repeatRateAfterTone: "amber", vsBase: "−3.1", vsBaseTone: "amber", verdict: "recoverable", verdictTone: "amber" },
    { id: "delivery-late-silent", whatHappened: "Delivery late, said nothing", customersPerMo: "31,400", contactedUs: "0%", contactedUsTone: "rose", repeatRateAfter: "18.4%", repeatRateAfterTone: "rose", vsBase: "−8.8", vsBaseTone: "rose", verdict: "silent and worse", verdictTone: "rose" },
    { id: "delivery-failed-complained", whatHappened: "Delivery failed, complained", customersPerMo: "1,200", contactedUs: "100%", contactedUsTone: "teal", repeatRateAfter: "31.4%", repeatRateAfterTone: "teal", vsBase: "+4.2", vsBaseTone: "teal", verdict: "we fixed it", verdictTone: "teal" },
    { id: "delivery-failed-silent", whatHappened: "Delivery failed, said nothing", customersPerMo: "8,200", contactedUs: "0%", contactedUsTone: "rose", repeatRateAfter: "0.4%", repeatRateAfterTone: "rose", vsBase: "−26.8", vsBaseTone: "rose", verdict: "total loss", verdictTone: "rose" },
  ],
  closingTitle: "A customer who complains is worth more than one who does not, and by a lot",
  closingBody:
    "Failed delivery plus a complaint retains at 31.4%, above the base rate — because we refunded and apologised. Failed delivery in silence retains at 0.4%. The 8,200 people who did not bother to tell us are the most expensive group in this stage and they are invisible to every support tool in the building.",
};

// ---- Overview (SU02) is wired to the shared GET /lifecycle/stages/{stageKey} — see
// overview-tab.tsx's buildStageKpis. The mock 4-card set below is kept only for the
// silent-failures drilldown (SU03b), which still reuses it — renamed since it's no longer the
// Overview tab's own data.

export const SUPPORT_SILENT_FAILURES_KPIS: Kpi[] = [
  { eyebrow: "Something went wrong", value: "61,000 / mo", note: "5.5% of active customers" },
  { eyebrow: "Told us about it", value: "21,400 / mo", tone: "amber", note: "35% · the rest stay silent" },
  { eyebrow: "At stake", value: "₦9M", tone: "amber", note: "smallest figure, largest early signal" },
  { eyebrow: "Revenue behind silent failures", value: "₦38M", tone: "rose", note: "not counted in the ₦9M", href: "/lifecycle/support/silent" },
];

// Overview (SU02) leak table is wired to GET /lifecycle/stages/{stageKey}'s `departures[]` —
// see overview-tab.tsx.

export const SUPPORT_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Late delivery, no acknowledgement",
  carriedIn: [
    { label: "Stage", value: "Support" },
    { label: "Entered", value: "last 30 days" },
    { label: "Contacted us", value: "false" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "31,400 customers · ₦3M at stake",
  countedNote: "Counted 6 minutes ago · worsening since 4 March",
  participants: [
    { initials: "AO", kind: "human", color: "#C56A2E" },
    { initials: "SS", kind: "agent" },
  ],
  participantsNote: "Support Signal leads · Amara owns the stage, so she owns this",
};

export const SUPPORT_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Support · overview · Nigeria",
  snapshotLabel: "Support · overview · Nigeria · as of 13 Aug 08:12",
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
    "The ₦38M behind silent failures is not on any support dashboard — it travels with the file rather than being dropped from it, an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Contact drivers (SU03, route path "drivers") --------------------------

export type ContactDriverRow = {
  id: string;
  driver: string;
  ticketsPerMo: string;
  share: string;
  shareTone: "teal" | "amber" | "rose" | "neutral";
  vsFeb: string;
  vsFebTone: "teal" | "amber" | "rose" | "neutral";
  handleTime: string;
  handleTimeTone: "teal" | "amber";
  repeatRateAfter: string;
  repeatRateAfterTone: "teal" | "amber" | "rose";
  reallyA: string;
  reallyATone: ChipTone;
};

export const SUPPORT_CONTACT_DRIVER_ROWS: ContactDriverRow[] = [
  { id: "where-is-my-order", driver: "Where is my order", ticketsPerMo: "18,400", share: "36.1%", shareTone: "rose", vsFeb: "+41%", vsFebTone: "rose", handleTime: "4.1 min", handleTimeTone: "teal", repeatRateAfter: "21.1%", repeatRateAfterTone: "rose", reallyA: "revenue signal", reallyATone: "ultra" },
  { id: "delivery-fee-question", driver: "Delivery fee question", ticketsPerMo: "6,100", share: "12.0%", shareTone: "amber", vsFeb: "new", vsFebTone: "rose", handleTime: "2.8 min", handleTimeTone: "teal", repeatRateAfter: "19.4%", repeatRateAfterTone: "rose", reallyA: "revenue signal", reallyATone: "ultra" },
  { id: "refund-request", driver: "Refund request", ticketsPerMo: "5,400", share: "10.6%", shareTone: "amber", vsFeb: "+11%", vsFebTone: "amber", handleTime: "6.9 min", handleTimeTone: "amber", repeatRateAfter: "28.1%", repeatRateAfterTone: "amber", reallyA: "support issue", reallyATone: "neutral" },
  { id: "wrong-or-missing-item", driver: "Wrong or missing item", ticketsPerMo: "4,900", share: "9.6%", shareTone: "amber", vsFeb: "−2%", vsFebTone: "teal", handleTime: "8.1 min", handleTimeTone: "amber", repeatRateAfter: "26.4%", repeatRateAfterTone: "amber", reallyA: "supplier issue", reallyATone: "amber" },
  { id: "payment-failed", driver: "Payment failed", ticketsPerMo: "4,100", share: "8.0%", shareTone: "amber", vsFeb: "+22%", vsFebTone: "rose", handleTime: "3.1 min", handleTimeTone: "teal", repeatRateAfter: "11.4%", repeatRateAfterTone: "rose", reallyA: "belongs in Renew", reallyATone: "ultra" },
  { id: "account-or-password", driver: "Account or password", ticketsPerMo: "3,800", share: "7.5%", shareTone: "neutral", vsFeb: "+4%", vsFebTone: "neutral", handleTime: "2.1 min", handleTimeTone: "teal", repeatRateAfter: "29.1%", repeatRateAfterTone: "teal", reallyA: "support issue", reallyATone: "neutral" },
  { id: "everything-else", driver: "Everything else", ticketsPerMo: "8,300", share: "16.2%", shareTone: "neutral", vsFeb: "+3%", vsFebTone: "neutral", handleTime: "5.4 min", handleTimeTone: "amber", repeatRateAfter: "28.4%", repeatRateAfterTone: "teal", reallyA: "mixed", reallyATone: "neutral" },
];

export const SUPPORT_DRIVER_TIMELINE_CARDS: InsightCard[] = [
  {
    id: "support-signal-flagged",
    agentTag: "SS",
    meta: "11 March",
    title: "Support Signal flagged it",
    body: "“Where is my order” rose 41% in one week with no change in delivery performance. The agent labelled it a revenue driver, not a volume problem, and wrote it to the log.",
    footnote: "correct on day seven",
    tone: "teal",
  },
  {
    id: "nobody-read-the-log",
    meta: "March to July",
    title: "Nobody read the log",
    body: "There was no rule that sent a reclassified contact driver anywhere. Support's own dashboards showed volume and handle time, both of which looked manageable because handle time is 4.1 minutes.",
    footnote: "the signal existed, unrouted",
    tone: "amber",
  },
  {
    id: "room-connected-it",
    agentTag: "RD",
    meta: "2 August",
    title: "A room connected it",
    body: "Repeat & Decay pulled the support reclassification in as evidence when it built the delivery-fee case. It is cited in room 8f2c as the first signal, dated 11 March.",
    footnote: "144 days late",
    tone: "teal",
  },
];

export type ReclassifyOption = { id: string; title: string; body: string; selected?: boolean };

export type ReclassifyPreset = {
  driverSummary: string;
  driverDetail: string;
  optionsEyebrow: string;
  options: ReclassifyOption[];
  effectsEyebrow: string;
  effects: { label: string; value: string; tone: "teal" | "amber" | "neutral" }[];
  closingTitle: string;
  closingBody: string;
};

export const SUPPORT_RECLASSIFY_PRESET: ReclassifyPreset = {
  driverSummary: "Payment failed · 4,100 tickets a month",
  driverDetail: "Handle time 3.1 min · repeat rate after 11.4% · lowest of any driver",
  optionsEyebrow: "Reclassify it as",
  options: [
    { id: "support-issue", title: "A support issue", body: "stays here · measured on cost per contact" },
    { id: "revenue-signal", title: "A revenue signal in this stage", body: "stays here · measured on what happens next" },
    { id: "renew-symptom", title: "A symptom owned by Renew", body: "the cause is involuntary churn · 61,400 cards fail monthly", selected: true },
  ],
  effectsEyebrow: "What reclassifying does",
  effects: [
    { label: "Opens a room", value: "immediately · in Renew, owned by Ravi Mehta", tone: "teal" },
    { label: "Moves the value", value: "₦4M leaves Support's figure and enters Renew's", tone: "amber" },
    { label: "Keeps the tickets here", value: "Support still handles them · only the cause moves", tone: "neutral" },
    { label: "Is logged and reversible", value: "with your name, the date and the reason", tone: "neutral" },
  ],
  closingTitle: "This is the control that did not exist on 11 March",
  closingBody:
    "Support Signal reclassified “where is my order” as a revenue driver in week one and had no way to send it anywhere. This screen is that missing action — and it is deliberately a person's decision, because moving a number out of one team's stage and into another's is not something an agent should do alone.",
};

// ---- Resolution (SU04) -----------------------------------------------------

export const SUPPORT_RESOLUTION_KPIS: Kpi[] = [
  { eyebrow: "Resolved first contact", value: "78.1%", tone: "teal", note: "up from 71.4%" },
  { eyebrow: "Median resolution", value: "41 min", tone: "teal", note: "down from 2.1 hrs" },
  { eyebrow: "Customer still here at 90 days", value: "22.4%", tone: "rose", note: "against 27.2% base" },
  { eyebrow: "Resolution that changed the outcome", value: "31.4%", tone: "teal", note: "failed deliveries only" },
];

export type ResolutionRow = {
  id: string;
  resolutionType: string;
  ticketsPerMo: string;
  resolvedFast: string;
  resolvedFastTone: "teal" | "amber";
  customerSatisfied: string;
  customerSatisfiedTone: "teal" | "amber";
  repeatRateAfter: string;
  repeatRateAfterTone: "teal" | "amber" | "rose";
  verdict: string;
  verdictTone: ChipTone;
};

export const SUPPORT_RESOLUTION_ROWS: ResolutionRow[] = [
  { id: "refund-apology-failed-delivery", resolutionType: "Refund and apology · failed delivery", ticketsPerMo: "1,200", resolvedFast: "94%", resolvedFastTone: "teal", customerSatisfied: "81%", customerSatisfiedTone: "teal", repeatRateAfter: "31.4%", repeatRateAfterTone: "teal", verdict: "genuinely worked", verdictTone: "teal" },
  { id: "explained-delivery-fee", resolutionType: "Explained the delivery fee", ticketsPerMo: "6,100", resolvedFast: "98%", resolvedFastTone: "teal", customerSatisfied: "74%", customerSatisfiedTone: "teal", repeatRateAfter: "19.4%", repeatRateAfterTone: "rose", verdict: "satisfied and gone", verdictTone: "rose" },
  { id: "located-the-order", resolutionType: "Located the order", ticketsPerMo: "18,400", resolvedFast: "91%", resolvedFastTone: "teal", customerSatisfied: "77%", customerSatisfiedTone: "teal", repeatRateAfter: "21.1%", repeatRateAfterTone: "rose", verdict: "satisfied and gone", verdictTone: "rose" },
  { id: "reset-a-password", resolutionType: "Reset a password", ticketsPerMo: "3,800", resolvedFast: "99%", resolvedFastTone: "teal", customerSatisfied: "88%", customerSatisfiedTone: "teal", repeatRateAfter: "29.1%", repeatRateAfterTone: "teal", verdict: "genuinely worked", verdictTone: "teal" },
  { id: "retried-a-payment", resolutionType: "Retried a payment", ticketsPerMo: "4,100", resolvedFast: "62%", resolvedFastTone: "amber", customerSatisfied: "51%", customerSatisfiedTone: "amber", repeatRateAfter: "11.4%", repeatRateAfterTone: "rose", verdict: "belongs in Renew", verdictTone: "amber" },
];

// ---- Deflection (SU05) ------------------------------------------------------

export const SUPPORT_DEFLECTION_KPIS: Kpi[] = [
  { eyebrow: "Deflected by self-serve", value: "31,400 / mo", tone: "teal", note: "59% of attempted contacts" },
  { eyebrow: "Cost saved", value: "₦18M / yr", tone: "teal", note: "at ₦48 per contact" },
  { eyebrow: "Deflected and still left", value: "9,100 / mo", tone: "rose", note: "29% of deflections" },
  { eyebrow: "Revenue behind those", value: "₦12M", tone: "rose", note: "not on any support dashboard" },
];

export type DeflectionRow = {
  id: string;
  deflectedBy: string;
  contactsPerMo: string;
  costSaved: string;
  repeatRateAfter: string;
  repeatRateAfterTone: "teal" | "amber" | "rose";
  vsHuman: string;
  vsHumanTone: "teal" | "rose";
  verdict: string;
  verdictTone: ChipTone;
};

export const SUPPORT_DEFLECTION_ROWS: DeflectionRow[] = [
  { id: "order-tracking-page", deflectedBy: "Order tracking page", contactsPerMo: "14,100", costSaved: "₦8.1M/yr", repeatRateAfter: "22.4%", repeatRateAfterTone: "amber", vsHuman: "+1.3 pts", vsHumanTone: "teal", verdict: "good deflection", verdictTone: "teal" },
  { id: "help-centre-fee-article", deflectedBy: "Help centre · delivery fee article", contactsPerMo: "6,900", costSaved: "₦4.0M/yr", repeatRateAfter: "14.1%", repeatRateAfterTone: "rose", vsHuman: "−5.3 pts", vsHumanTone: "rose", verdict: "bad deflection", verdictTone: "rose" },
  { id: "chatbot-refund-flow", deflectedBy: "Chatbot · refund flow", contactsPerMo: "4,200", costSaved: "₦2.4M/yr", repeatRateAfter: "19.1%", repeatRateAfterTone: "rose", vsHuman: "−9.0 pts", vsHumanTone: "rose", verdict: "bad deflection", verdictTone: "rose" },
  { id: "password-self-reset", deflectedBy: "Password self-reset", contactsPerMo: "3,900", costSaved: "₦2.2M/yr", repeatRateAfter: "29.4%", repeatRateAfterTone: "teal", vsHuman: "+0.3 pts", vsHumanTone: "teal", verdict: "good deflection", verdictTone: "teal" },
  { id: "abandoned-before-reaching-anyone", deflectedBy: "Abandoned before reaching anyone", contactsPerMo: "2,300", costSaved: "₦1.3M/yr", repeatRateAfter: "8.1%", repeatRateAfterTone: "rose", vsHuman: "−20.0 pts", vsHumanTone: "rose", verdict: "not deflection", verdictTone: "rose" },
];

// ---- Silent failures (SU13, route path "silent", linked from Overview) -----

export type SilentFailureRow = {
  id: string;
  whatHappened: string;
  totalPerMo: string;
  toldUs: string;
  stayedSilent: string;
  stayedSilentTone: "teal" | "amber" | "rose";
  repeatVocal: string;
  repeatVocalTone: "teal" | "amber" | "rose";
  repeatSilent: string;
  repeatSilentTone: "teal" | "amber" | "rose";
  gap: string;
  gapTone: "teal" | "amber" | "rose";
};

export const SUPPORT_SILENT_FAILURE_ROWS: SilentFailureRow[] = [
  { id: "delivery-late", whatHappened: "Delivery late", totalPerMo: "43,500", toldUs: "12,100", stayedSilent: "31,400", stayedSilentTone: "rose", repeatVocal: "24.1%", repeatVocalTone: "amber", repeatSilent: "18.4%", repeatSilentTone: "rose", gap: "−5.7", gapTone: "rose" },
  { id: "delivery-failed", whatHappened: "Delivery failed", totalPerMo: "9,400", toldUs: "1,200", stayedSilent: "8,200", stayedSilentTone: "rose", repeatVocal: "31.4%", repeatVocalTone: "teal", repeatSilent: "0.4%", repeatSilentTone: "rose", gap: "−31.0", gapTone: "rose" },
  { id: "wrong-item", whatHappened: "Wrong item", totalPerMo: "6,100", toldUs: "4,900", stayedSilent: "1,200", stayedSilentTone: "amber", repeatVocal: "26.4%", repeatVocalTone: "amber", repeatSilent: "14.1%", repeatSilentTone: "rose", gap: "−12.3", gapTone: "rose" },
  { id: "payment-failed", whatHappened: "Payment failed", totalPerMo: "61,400", toldUs: "4,100", stayedSilent: "57,300", stayedSilentTone: "rose", repeatVocal: "11.4%", repeatVocalTone: "rose", repeatSilent: "8.1%", repeatSilentTone: "rose", gap: "−3.3", gapTone: "amber" },
];

export const SUPPORT_SILENT_CLOSING_CARDS: ActionCard[] = [
  {
    id: "proactive-outreach-running",
    eyebrow: "Running since March",
    tone: "teal",
    title: "Proactive outreach on failed deliveries",
    body: "Amara's team contacts the 1,200 who complain. Retention 31.4%, +22 points against a holdout. It is the best measured intervention in the lifecycle.",
    footnote: "1,200 of 9,400 reached",
  },
  {
    id: "obvious-extension",
    eyebrow: "The obvious extension",
    tone: "rose",
    title: "Contact the 8,200 who did not complain",
    body: "The delivery feed knows the order failed. Nobody has to wait for a ticket. At even half the measured lift this is worth ₦4M a month and it has never been proposed.",
    footnote: "₦48M a year, untried",
  },
  {
    id: "why-it-never-was",
    eyebrow: "Why it never was",
    tone: "amber",
    title: "It raises cost per contact",
    body: "Reaching out to 8,200 people who did not ask creates 8,200 contacts. On Amara's goal that is a 16% increase in volume and a worse number. She would be penalised for the highest-return action available to her.",
    footnote: "the goal, again",
  },
];

// ---- Cohorts (SU06) is wired to the shared GET /lifecycle/stages/{stageKey}/cohorts — see
// acquire/data.ts's Cohorts note and cohorts-tab.tsx.

// ---- Markets (SU07) is wired to the shared GET /lifecycle/stages/{stageKey}/markets — see
// acquire/data.ts's Markets note and markets-tab.tsx.

// ---- What changed (SU08) ---------------------------------------------------
// Wired live (see stage/changes/changes-tab.tsx, GET /lifecycle/stages/{stageKey}/change-registry)
// — no mock export here anymore.

// ---- Agents (SU09) is wired to the shared GET /lifecycle/stages/{stageKey}/agents — see
// acquire/data.ts's Agents note and agents-tab.tsx.

export const SUPPORT_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "A contact driver is reclassified as revenue", note: "Support Signal's own classification changes" },
  byMoreThan: { label: "By more than", value: "any", note: "any reclassification is worth a look" },
  sustainedFor: { label: "Sustained for", value: "0 days", note: "opens immediately · this is the one rule that fires on day one" },
  segmentedBy: { label: "Segmented by", value: "driver, market", note: "so a single driver's reclassification is findable, not averaged away" },
  routesTo: { name: "The Support stage owner · Amara Okeke" },
  simulation: {
    title: "Against the last twelve months, this would have fired twice",
    body: "Once on 11 March, when “where is my order” was reclassified — 144 days before anyone acted. Once this month, on the payment-failed driver, which is why it opens now instead of waiting.",
  },
};

// ---- History (SU10) is wired to the shared GET /lifecycle/stages/{stageKey}/history — see
// acquire/data.ts's History note and history-tab.tsx.

// ---- Compare periods (SU11) is wired to the shared GET /lifecycle/stages/{stageKey}/compare —
// see acquire/data.ts's Compare note and compare-route.tsx.
