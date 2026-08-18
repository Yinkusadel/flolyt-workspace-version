import type { Tone } from "@/pages/rooms/types";

/** Static flavor content for the Rooms index's empty / stale-recovering-archived states — R01, R05. */

export type SourceReadRow = {
  source: string;
  state: "reading" | "done" | "not-connected";
  stateLabel: string;
  rowsRead: string;
  firstFullRead: string;
  waitingOn: string;
};

export const EMPTY_STATE_SOURCES: SourceReadRow[] = [
  { source: "Orders", state: "reading", stateLabel: "reading", rowsRead: "2.1M of 4.2M", firstFullRead: "14:20 today", waitingOn: "Repeat & Decay, Acquisition Quality" },
  { source: "Payments", state: "reading", stateLabel: "reading", rowsRead: "890k of 1.3M", firstFullRead: "13:50 today", waitingOn: "Involuntary Churn" },
  { source: "Support", state: "done", stateLabel: "done", rowsRead: "412k", firstFullRead: "complete", waitingOn: "Support Signal" },
  { source: "Delivery", state: "not-connected", stateLabel: "not connected", rowsRead: "—", firstFullRead: "—", waitingOn: "2 agents blocked" },
  { source: "Cost of goods", state: "not-connected", stateLabel: "not connected", rowsRead: "—", firstFullRead: "—", waitingOn: "Price & Margin" },
];

export type ExplainerCard = { eyebrow: string; heading: string; body: string; tag: string; tone: Tone };

export const OTHER_STATES_EXPLAINERS: ExplainerCard[] = [
  {
    eyebrow: "RECOVERING",
    heading: "Closed once, reopened",
    body: "Weekend push fatigue closed in March and reopened in July when unsubscribes rose again. The original decision doc is attached, not overwritten — a second opening carries the first one's reasoning with it.",
    tag: "history is never rewritten",
    tone: "ultra",
  },
  {
    eyebrow: "ARCHIVED",
    heading: "Closed, kept readable, still cited",
    body: "The dunning room closed on 2 April with ₦62M recovered against a holdout. It has been cited as evidence in two rooms since. Archived means finished, not hidden.",
    tag: "searchable forever",
    tone: "teal",
  },
  {
    eyebrow: "STALE",
    heading: "Not a moral failing, a property of scale",
    body: "Most stale rooms are waiting on one overloaded team, were never assigned, or belong to people who have left. Three of those four causes have a screen that fixes them properly.",
    tag: "this one only makes it visible",
    tone: "amber",
  },
];
