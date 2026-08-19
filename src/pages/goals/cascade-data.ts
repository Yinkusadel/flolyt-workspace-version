import { ADA, AMARA, IFEOMA, KUNLE, RAVI, ZAINAB } from "@/pages/rooms/data";
import type { PersonRef, Tone } from "@/pages/rooms/types";

export type CascadeNode = {
  id: string;
  name: string;
  typeLabel: string;
  range?: string;
  current: string;
  currentTone: Tone;
  chips: { label: string; tone: Tone }[];
  owner?: PersonRef;
  ownerName?: string;
  meta: string;
  children?: CascadeNode[];
};

/** G10 — company goal → market → team → owner. */
export const CASCADE_ROOT: CascadeNode = {
  id: "company",
  name: "90-day repeat rate",
  typeLabel: "Company",
  range: "27.2% → 36.4%",
  current: "29.2%",
  currentTone: "amber",
  chips: [{ label: "7.2 behind", tone: "amber" }],
  owner: ADA,
  meta: "11 teams",
  children: [
    {
      id: "nigeria",
      name: "Nigeria repeat rate",
      typeLabel: "Market",
      range: "26.1% → 36.0%",
      current: "27.4%",
      currentTone: "rose",
      chips: [{ label: "8.6 behind", tone: "rose" }],
      owner: IFEOMA,
      meta: "6 teams",
      children: [
        {
          id: "reactivate-lapsed-buyers",
          name: "Reactivate lapsed buyers",
          typeLabel: "Marketing NG",
          range: "— → 100k recovered",
          current: "0",
          currentTone: "rose",
          chips: [{ label: "not started", tone: "rose" }],
          owner: IFEOMA,
          meta: "awaiting approval",
        },
        {
          id: "checkout-fee-transparency",
          name: "Checkout fee transparency",
          typeLabel: "Product NG",
          range: "3.1× → 1.0× abandonment",
          current: "1.4×",
          currentTone: "teal",
          chips: [{ label: "on track", tone: "teal" }],
          owner: ZAINAB,
          meta: "shipped 7 Aug",
        },
        {
          id: "first-delivery-success",
          name: "First-delivery success",
          typeLabel: "Support NG",
          range: "94.1% → 98.0%",
          current: "96.2%",
          currentTone: "amber",
          chips: [{ label: "1.8 behind", tone: "amber" }],
          owner: AMARA,
          meta: "in progress",
        },
      ],
    },
    {
      id: "kenya",
      name: "Kenya repeat rate",
      typeLabel: "Market",
      range: "31.0% → 38.0%",
      current: "34.1%",
      currentTone: "amber",
      chips: [{ label: "3.9 behind", tone: "amber" }],
      owner: KUNLE,
      ownerName: "Kunle Ade",
      meta: "3 teams",
      children: [
        {
          id: "kenya-fee-rollback",
          name: "Kenya fee rollback",
          typeLabel: "Product KE",
          range: "— → shipped",
          current: "planned",
          currentTone: "amber",
          chips: [{ label: "not started", tone: "amber" }],
          owner: KUNLE,
          ownerName: "Kunle Ade",
          meta: "no room open",
        },
      ],
    },
    {
      id: "ghana",
      name: "Ghana repeat rate",
      typeLabel: "Market",
      current: "Unavailable",
      currentTone: "neutral",
      chips: [
        { label: "no baseline", tone: "neutral" },
        { label: "No owner", tone: "amber" },
      ],
      meta: "1 team",
    },
    {
      id: "uk",
      name: "UK repeat rate",
      typeLabel: "Market",
      range: "41.0% → 43.0%",
      current: "42.8%",
      currentTone: "teal",
      chips: [{ label: "on track", tone: "teal" }],
      owner: RAVI,
      meta: "1 team",
    },
  ],
};
