import type { ChipTone } from "@/components/ui/chip";

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function confidenceTone(value: number): ChipTone {
  if (value >= 0.8) return "teal";
  if (value >= 0.5) return "amber";
  return "rose";
}
