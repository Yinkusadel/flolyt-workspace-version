/**
 * Mock content for the Support stage — screens SU01-SU13 in
 * flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/. Numbers and copy
 * are transcribed directly from those SVGs (each one's footer states its
 * id, e.g. "SU06 · Support · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";
import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { DefinitionCandidate } from "@/pages/everyday/lifecycle/stage/definition/definition-route";
import type { LeakRow, ChangeRow, AgentCard, ThresholdRow, GoalRow, TriedRow, CompareRow } from "@/pages/everyday/lifecycle/stage/acquire/data";
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

// ---- Overview (SU02) ---------------------------------------------------

export const SUPPORT_OVERVIEW_KPIS: Kpi[] = [
  { eyebrow: "Something went wrong", value: "61,000 / mo", note: "5.5% of active customers" },
  { eyebrow: "Told us about it", value: "21,400 / mo", tone: "amber", note: "35% · the rest stay silent" },
  { eyebrow: "At stake", value: "₦9M", tone: "amber", note: "smallest figure, largest early signal" },
  { eyebrow: "Revenue behind silent failures", value: "₦38M", tone: "rose", note: "not counted in the ₦9M", href: "/lifecycle/support/silent" },
];

export const SUPPORT_OVERVIEW_LEAK_ROWS: LeakRow[] = [
  {
    id: "failed-delivery-no-outreach",
    where: "Failed delivery, no proactive outreach",
    customers: "8,200",
    value: "₦5M",
    valueTone: "rose",
    trend: "improving",
    trendTone: "teal",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "closed", tone: "teal" },
  },
  {
    id: "late-delivery-no-acknowledgement",
    where: "Late delivery, no acknowledgement",
    customers: "31,400",
    value: "₦3M",
    valueTone: "amber",
    trend: "worsening",
    trendTone: "rose",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "open", tone: "amber" },
  },
  {
    id: "resolved-never-returned",
    where: "Resolved but customer never returned",
    customers: "4,100",
    value: "₦1M",
    valueTone: "amber",
    trend: "flat",
    trendTone: "neutral",
    causeKnown: { label: "no reading", tone: "amber" },
    room: { label: "none", tone: "neutral" },
  },
  {
    id: "driver-misclassified",
    where: "Contact driver misclassified as support",
    customers: "18,400",
    value: "in Retain",
    valueTone: "rose",
    trend: "worsening",
    trendTone: "rose",
    causeKnown: { label: "causal · 11 Mar", tone: "ultra" },
    room: { label: "open · 8f2c", tone: "amber" },
  },
];

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

// ---- Cohorts (SU06, stage-specific layout) --------------------------------

export type SupportCohortRow = {
  id: string;
  cohort: string;
  acquired: string;
  contactedUs: string;
  rate: string;
  rateTone: "teal" | "rose";
  topDriver: string;
  repeatAfterContact: string;
  repeatAfterContactTone: "teal" | "rose";
  vsFeb: string;
  vsFebTone: "teal" | "rose" | "neutral";
};

export const SUPPORT_COHORT_ROWS: SupportCohortRow[] = [
  { id: "january", cohort: "January", acquired: "61,200", contactedUs: "7,100", rate: "11.6%", rateTone: "teal", topDriver: "Wrong item", repeatAfterContact: "30.1%", repeatAfterContactTone: "teal", vsFeb: "+0.4", vsFebTone: "teal" },
  { id: "february", cohort: "February", acquired: "64,900", contactedUs: "7,600", rate: "11.7%", rateTone: "teal", topDriver: "Wrong item", repeatAfterContact: "29.8%", repeatAfterContactTone: "teal", vsFeb: "baseline", vsFebTone: "neutral" },
  { id: "march", cohort: "March", acquired: "82,100", contactedUs: "14,200", rate: "17.3%", rateTone: "rose", topDriver: "Where is my order", repeatAfterContact: "21.4%", repeatAfterContactTone: "rose", vsFeb: "−8.4", vsFebTone: "rose" },
  { id: "april", cohort: "April", acquired: "78,300", contactedUs: "13,900", rate: "17.8%", rateTone: "rose", topDriver: "Where is my order", repeatAfterContact: "21.1%", repeatAfterContactTone: "rose", vsFeb: "−8.7", vsFebTone: "rose" },
  { id: "may", cohort: "May", acquired: "77,600", contactedUs: "13,600", rate: "17.5%", rateTone: "rose", topDriver: "Where is my order", repeatAfterContact: "21.4%", repeatAfterContactTone: "rose", vsFeb: "−8.4", vsFebTone: "rose" },
  { id: "june", cohort: "June", acquired: "76,100", contactedUs: "13,200", rate: "17.3%", rateTone: "rose", topDriver: "Where is my order", repeatAfterContact: "Unavailable", repeatAfterContactTone: "rose", vsFeb: "—", vsFebTone: "neutral" },
];

export const SUPPORT_COHORT_CLOSING = {
  title: "Contact rate rose 6 points in the same week the fee shipped, and the top driver changed",
  body: "Two things happened at once and both were visible on 11 March: more customers contacted us, and they contacted us about something new. Either alone might be noise. Together, in the same week, with a dated release behind it, they are a causal finding — and this table existed all along.",
};

export const SUPPORT_COHORT_COST_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "Handling cost · Jan–Feb cohorts", value: "₦3.4M per cohort", percent: 34, tone: "teal" },
  { label: "Handling cost · Mar–May cohorts", value: "₦6.8M per cohort", percent: 68, tone: "amber" },
  { label: "Revenue lost after contact · Jan–Feb", value: "₦8M per cohort", percent: 8, tone: "teal" },
  { label: "Revenue lost after contact · Mar–May", value: "₦61M per cohort", percent: 61, tone: "rose" },
];

export const SUPPORT_COHORT_COST_CLOSING = {
  title: "Handling cost doubled and everyone noticed. Revenue lost went up eight times and nobody did.",
  body: "₦3.4M of extra support cost per cohort is a line item that appears in a monthly budget review. ₦53M of extra revenue loss per cohort appears nowhere, because no support system in this company has ever been connected to what the customer did next.",
};

// ---- Markets (SU07, stage-specific layout) --------------------------------

export type SupportMarketRow = {
  id: string;
  market: string;
  contactsPerMo: string;
  contactRate: string;
  contactRateTone: "teal" | "amber" | "rose";
  resolution: string;
  resolutionTone: "teal" | "rose";
  repeatAfter: string;
  repeatAfterTone: "teal" | "rose";
  silentFailures: string;
  silentFailuresTone: "teal" | "amber" | "rose" | "neutral";
  atStake: string;
  atStakeTone: "amber";
  deliveryFeed: string;
  deliveryFeedTone: "teal" | "rose";
};

export const SUPPORT_MARKET_ROWS: SupportMarketRow[] = [
  { id: "nigeria", market: "Nigeria", contactsPerMo: "14,900", contactRate: "17.1%", contactRateTone: "rose", resolution: "41 min", resolutionTone: "teal", repeatAfter: "21.4%", repeatAfterTone: "rose", silentFailures: "31,400", silentFailuresTone: "rose", atStake: "₦7M", atStakeTone: "amber", deliveryFeed: "connected", deliveryFeedTone: "teal" },
  { id: "kenya", market: "Kenya", contactsPerMo: "3,100", contactRate: "11.4%", contactRateTone: "teal", resolution: "38 min", resolutionTone: "teal", repeatAfter: "29.1%", repeatAfterTone: "teal", silentFailures: "4,100", silentFailuresTone: "amber", atStake: "KES 1.1M", atStakeTone: "amber", deliveryFeed: "connected", deliveryFeedTone: "teal" },
  { id: "ghana", market: "Ghana", contactsPerMo: "2,400", contactRate: "14.1%", contactRateTone: "amber", resolution: "2.9 hrs", resolutionTone: "rose", repeatAfter: "18.1%", repeatAfterTone: "rose", silentFailures: "Unavailable", silentFailuresTone: "neutral", atStake: "GHS 410k", atStakeTone: "amber", deliveryFeed: "not connected", deliveryFeedTone: "rose" },
  { id: "uk", market: "United Kingdom", contactsPerMo: "1,000", contactRate: "8.1%", contactRateTone: "teal", resolution: "22 min", resolutionTone: "teal", repeatAfter: "34.1%", repeatAfterTone: "teal", silentFailures: "1,100", silentFailuresTone: "amber", atStake: "£9k", atStakeTone: "amber", deliveryFeed: "connected", deliveryFeedTone: "teal" },
];

export const SUPPORT_MARKET_CLOSING = {
  title: "Ghana's silent failures cannot be counted at all",
  body: "There is no delivery feed for Ghana, so Flolyt cannot know how many orders arrived late or failed. It can only count people who complained — 2,400 a month, at a resolution time six times worse than Nigeria's. The real number is unavailable, and given Ghana's position in five other stages it is unlikely to be small.",
};

export const SUPPORT_MARKET_GHANA_ROWS: { label: string; value: string }[] = [
  { label: "Ghana resolution time", value: "2.9 hours against 41 minutes in Nigeria" },
  { label: "Ghana repeat rate after contact", value: "18.1% · lowest of four markets" },
  { label: "Ghana silent failures", value: "Unavailable · no delivery source" },
  { label: "Ghana support headcount", value: "3 people for 410,000 customers" },
  { label: "Rooms open about Ghana", value: "1 · about a campaign · no owner since 10 August" },
];

// ---- What changed (SU08) ---------------------------------------------------

export const SUPPORT_CHANGE_ROWS: ChangeRow[] = [
  { id: "delivery-fee-checkout", date: "4 Mar", team: "Engineering", teamColor: "#4E7080", title: "Delivery fee moved to checkout", effect: "Contact rate 11.7% → 17.3% · new top driver", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "support-signal-reclassified", date: "11 Mar", team: "Support", teamColor: "#C56A2E", title: "Support Signal reclassified the top driver", effect: "Logged as a revenue driver · routed to nobody", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "chatbot-refund-flow-launched", date: "Feb", team: "Support", teamColor: "#C56A2E", title: "Chatbot refund flow launched", effect: "4,200 deflected · repeat rate 9 pts worse", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "proactive-outreach-failed-delivery", date: "Mar", team: "Support", teamColor: "#C56A2E", title: "Proactive outreach on failed deliveries", effect: "1,200/mo · repeat rate 31.4% · +22 vs holdout", effectTone: "teal", badge: "causal finding", badgeTone: "ultra" },
  { id: "help-centre-fee-article", date: "Apr", team: "Support", teamColor: "#C56A2E", title: "Help centre delivery-fee article", effect: "6,900 deflected · repeat rate 5 pts worse", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "ghana-headcount-cut", date: "Jun", team: "Support", teamColor: "#C56A2E", title: "Ghana support team cut to 3", effect: "Resolution 51 min → 2.9 hrs", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
];

// ---- Agents (SU09) ----------------------------------------------------------

export const SUPPORT_AGENT_CARDS: AgentCard[] = [
  {
    id: "support-signal",
    initials: "SS",
    status: "Lead agent · reading since 12 Jan",
    name: "Support Signal",
    body: "Reclassifies contact drivers by what they cost in revenue rather than what they cost to handle. It produced the first correct reading of the delivery-fee problem anywhere in the company, on 11 March.",
    footnote: "4 rooms · 2 closed",
    tone: "ultra",
  },
  {
    id: "march-reclassification",
    initials: "SS",
    status: "What it got right and nobody used",
    name: "The 11 March reclassification",
    body: "It labelled “where is my order” a revenue driver in week one and wrote it to the log. There was no rule that sent a reclassified driver to a person, so it sat there for 144 days.",
    footnote: "the cost of an unrouted signal",
    tone: "rose",
    footnoteTone: "rose",
  },
  {
    id: "ghana-silent-failures",
    initials: "SS",
    status: "What it cannot see",
    name: "Ghana's silent failures",
    body: "No delivery feed for Ghana means the agent can count complaints and cannot count problems. It reports the difference as unavailable rather than assuming Ghana looks like Nigeria.",
    footnote: "one market, half blind",
    tone: "amber",
    footnoteTone: "amber",
  },
];

export const SUPPORT_THRESHOLD_ROWS: ThresholdRow[] = [
  { id: "driver-reclassified-as-revenue", condition: "A contact driver is reclassified as revenue", threshold: "any", currently: "2 this year", currentlyTone: "rose", status: "opens-automatically", statusLabel: "opens now", owner: { name: "Amara", initials: "AO", color: "#C56A2E" } },
  { id: "contact-rate-rises", condition: "Contact rate rises", threshold: "more than 2 pts", currently: "+5.6", currentlyTone: "rose", status: "already-open", owner: { name: "Amara", initials: "AO", color: "#C56A2E" } },
  { id: "deflection-lowers-retention", condition: "Deflection lowers retention", threshold: "more than 3 pts vs human", currently: "2 flows, −5 and −9", currentlyTone: "rose", status: "not-opened", noOwner: true },
  { id: "silent-failures-rise", condition: "Silent failures rise", threshold: "more than 10%", currently: "Unavailable in Ghana", currentlyTone: "neutral", status: "blocked", statusLabel: "partially blocked", owner: { name: "Amara", initials: "AO", color: "#C56A2E" } },
  { id: "resolution-time-doubles", condition: "Resolution time doubles in a market", threshold: "2×", currently: "Ghana 3.4×", currentlyTone: "rose", status: "not-opened", noOwner: true },
];

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

// ---- History (SU10) ----------------------------------------------------------

export const SUPPORT_GOAL_ROWS: GoalRow[] = [
  { id: "90-day-repeat-rate", goal: "90-day repeat rate", owner: { name: "Ifeoma", initials: "IN", color: "#79883A" }, target: "36.4%", today: "29.2%", todayTone: "amber", paceLabel: "7.2 behind", paceTone: "rose", part: "earliest detectable signal", partTone: "amber" },
  { id: "cost-per-contact", goal: "Cost per contact", owner: { name: "Amara", initials: "AO", color: "#C56A2E" }, target: "₦42", today: "₦48", todayTone: "amber", paceLabel: "behind", paceTone: "amber", part: "the goal that caused three losses", partTone: "rose" },
];

export const SUPPORT_HISTORY_MID_INSIGHT = {
  tone: "rose" as const,
  title: "This stage has a goal that actively works against the company's other four",
  body: "Cost per contact rewards deflection, headcount cuts and shorter conversations. Three of those decisions this year each saved money and lost more revenue than they saved. Amara is being measured on the one number that makes the ₦12M invisible. Nobody set out to do this — the goal predates the lifecycle view by three years.",
};

export const SUPPORT_TRIED_ROWS: TriedRow[] = [
  { id: "proactive-outreach-failed-delivery", what: "Proactive outreach · failed delivery", when: "Mar", result: "31.4% repeat · +22 vs holdout", resultTone: "teal", measuredHow: "holdout · 15%", learningKept: "validated · best in lifecycle" },
  { id: "chatbot-refund-flow", what: "Chatbot refund flow", when: "Feb", result: "4,200 deflected · −9 pts repeat", resultTone: "rose", measuredHow: "no holdout · found later", learningKept: "net negative" },
  { id: "help-centre-fee-article", what: "Help centre fee article", when: "Apr", result: "6,900 deflected · −5 pts repeat", resultTone: "rose", measuredHow: "no holdout", learningKept: "net negative" },
  { id: "ghana-headcount-reduction", what: "Ghana headcount reduction", when: "Jun", result: "₦4M saved · resolution 3.4× worse", resultTone: "rose", measuredHow: "no holdout", learningKept: "under review" },
  { id: "outreach-on-late-delivery", what: "Outreach on late delivery", when: "never", whenTone: "amber", result: "untried · 31,400/mo silent", resultTone: "rose", measuredHow: "—", learningKept: "the obvious next test" },
];

// ---- Compare periods (SU11) -----------------------------------------------

export const SUPPORT_COMPARE_ROWS: CompareRow[] = [
  { id: "contact-rate", metric: "Contact rate", before: "11.7%", after: "17.3%", change: "+5.6 pts", changeTone: "rose", whatMovedIt: "The fee · 18,400 new tickets a month" },
  { id: "first-contact-resolution", metric: "First-contact resolution", before: "71.4%", after: "78.1%", change: "+6.7 pts", changeTone: "teal", whatMovedIt: "The fee question is easy to answer" },
  { id: "median-resolution-time", metric: "Median resolution time", before: "2.1 hrs", after: "41 min", change: "−67%", changeTone: "teal", whatMovedIt: "Same · a simpler queue resolves faster" },
  { id: "cost-per-contact", metric: "Cost per contact", before: "₦51", after: "₦48", change: "−5.9%", changeTone: "teal", whatMovedIt: "Deflection and a simpler queue" },
  { id: "repeat-rate-after-contact", metric: "Repeat rate after contact", before: "29.8%", after: "21.4%", change: "−8.4 pts", changeTone: "rose", whatMovedIt: "Satisfied and gone" },
  { id: "revenue-lost-after-contact", metric: "Revenue lost after contact", before: "₦8M/cohort", after: "₦61M/cohort", change: "+663%", changeTone: "rose", whatMovedIt: "Volume × a worse outcome" },
];
