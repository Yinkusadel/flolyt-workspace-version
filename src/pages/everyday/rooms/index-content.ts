import type { Tone } from "@/pages/everyday/rooms/types";

/** Static flavor content for the Rooms index's stale/recovering/archived explainer cards — R05. */

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
