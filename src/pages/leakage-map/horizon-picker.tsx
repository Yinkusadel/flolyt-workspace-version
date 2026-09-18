import { HORIZON_GROUPS, type HorizonValue } from "@/pages/leakage-map/data";

export type HorizonState =
  | { kind: "preset"; value: HorizonValue; direction: "back" | "forward" }
  | { kind: "custom"; from: Date; to: Date };

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatRange(from: Date, to: Date) {
  const currentYear = new Date().getFullYear();
  const fromLabel = from.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const toLabel = to.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: to.getFullYear() !== currentYear ? "numeric" : undefined,
  });
  return `${fromLabel} – ${toLabel}`;
}

export function horizonLabel(state: HorizonState): string {
  if (state.kind === "custom") return formatRange(state.from, state.to);
  for (const group of HORIZON_GROUPS) {
    const match = group.options.find((o) => o.value === state.value && o.direction === state.direction);
    if (match) return match.label;
  }
  return "Next 90 days";
}
