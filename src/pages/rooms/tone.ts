import type { Tone } from "@/pages/rooms/types";

/** Static class lookups for a `Tone` value — keeps Tailwind's scanner happy (no `text-${tone}` template literals). */

export const TONE_TEXT_CLASS: Record<Tone, string> = {
  ultra: "text-ultra",
  rose: "text-rose",
  amber: "text-amber",
  teal: "text-teal",
  neutral: "text-ink-3",
};

export const TONE_BG_CLASS: Record<Tone, string> = {
  ultra: "bg-ultra-bg border-ultra-border",
  rose: "bg-rose-bg border-rose-border",
  amber: "bg-amber-bg border-amber-border",
  teal: "bg-teal-bg border-teal-border",
  neutral: "bg-paper-2 border-line",
};
