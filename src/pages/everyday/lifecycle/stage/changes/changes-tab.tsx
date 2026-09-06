import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, type ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { formatCount, formatPercent, formatShortDate } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetStageChangeRegistry } from "@/features/lifecycle/use-get-stage-change-registry";
import type { StageChangeEffectDto, StageChangeRegistryEntryDto } from "@/services/api/lifecycle/get-stage-change-registry";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

// Colors match the palette every stage's mock data already used for these team names — kept as
// a shared lookup now that the rows come from the live registry instead of per-stage mocks.
// Exported for chain-route.tsx, the only other consumer of this same team-name/effect shape.
export const TEAM_COLORS: Record<string, string> = {
  Engineering: "#4E7080",
  Marketing: "#79883A",
  Product: "#7A5AA8",
  Finance: "#5D6BB8",
  Sales: "#B4568F",
  Support: "#C56A2E",
  "Customer Success": "#2E8B7F",
};
export const NO_TEAM_COLOR = "#98A0AF";

export const EFFECT_BADGE: Record<string, { label: string; tone: ChipTone }> = {
  measured: { label: "causal finding", tone: "ultra" },
  no_effect: { label: "no effect", tone: "neutral" },
  too_recent: { label: "measuring", tone: "ultra" },
  outside_history: { label: "outside history", tone: "neutral" },
  not_instrumented: { label: "not instrumented", tone: "amber" },
};

const EFFECT_TEXT_TONE_CLASS: Record<"teal" | "rose" | "amber" | "neutral", string> = {
  teal: "text-teal",
  rose: "text-rose",
  amber: "text-amber",
  neutral: "text-ink-4",
};

/** The concrete number behind `effect`, without inventing a metric name the API doesn't give — see
 * docs/endpoints/lifecycle.md's open question on whether a templated sentence is ever supplied.
 * Exported for chain-route.tsx, which reads the same `StageChangeEffectDto` shape. */
export function effectLine(effect: StageChangeEffectDto): { text: string; tone: "teal" | "rose" | "amber" | "neutral" } {
  if (effect.status === "measured") {
    const primary = effect.percentChange ?? effect.delta;
    if (primary === null) return { text: "Measured, magnitude unavailable", tone: "neutral" };
    const sign = primary >= 0 ? "+" : "";
    const text = effect.percentChange !== null ? `${sign}${formatPercent(effect.percentChange)}` : `${sign}${formatCount(effect.delta!)}`;
    return { text, tone: primary >= 0 ? "teal" : "rose" };
  }
  if (effect.status === "not_instrumented") return { text: "Not instrumented", tone: "amber" };
  if (effect.status === "too_recent") return { text: "Too recent to measure yet", tone: "neutral" };
  if (effect.status === "outside_history") return { text: "Outside this stage's measured history", tone: "neutral" };
  if (effect.status === "no_effect") return { text: "No measurable effect", tone: "neutral" };
  return { text: effect.status, tone: "neutral" };
}

function ChangesSkeleton() {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-paper">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-4 w-20 rounded-chip" />
        </div>
      ))}
    </div>
  );
}

/** The shared "What changed" tab template (e.g. A09) — dated changes with a measured effect where one exists. */
export function ChangesTab() {
  const { stage, headerActionsEl } = useStageContext();
  const { data, isLoading, isError, refetch } = useGetStageChangeRegistry(stage.slug);
  const registry = data?.data;
  const entries = registry?.entries ?? [];

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm">
            Add a change
          </Button>,
          headerActionsEl
        )}

      <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
        Dated changes that moved something in this stage
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load what changed in this stage.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <ChangesSkeleton />
      ) : entries.length === 0 ? (
        <div className="rounded-card border border-line bg-paper px-4 py-10 text-center">
          <p className="text-[12px] font-semibold text-ink">Nothing dated for this stage yet</p>
          <p className="mx-auto mt-1.5 max-w-md text-[10.5px] leading-relaxed text-ink-4">
            Changes appear here once someone records one, a release feed is connected, or Flolyt detects a dated
            step change on its own.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-paper">
          {entries.map((entry: StageChangeRegistryEntryDto) => {
            const badge = EFFECT_BADGE[entry.effect.status] ?? { label: entry.effect.status, tone: "neutral" as ChipTone };
            const line = effectLine(entry.effect);
            const teamColor = entry.team ? (TEAM_COLORS[entry.team] ?? NO_TEAM_COLOR) : NO_TEAM_COLOR;

            return (
              <div key={entry.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex shrink-0 items-center gap-2 sm:w-24">
                  <span className="font-mono text-[10.5px] text-ink-4">{formatShortDate(entry.occurredOnUtc)}</span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 sm:w-28">
                  <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: teamColor }} aria-hidden />
                  <span className="font-mono text-[10px] font-medium" style={{ color: teamColor }}>
                    {entry.team ?? "No team"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-ink">{entry.title}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-[10px] ${EFFECT_TEXT_TONE_CLASS[line.tone]}`}>{line.text}</span>
                    {entry.effect.caveat && <span className="text-[9.5px] text-ink-4">· {entry.effect.caveat}</span>}
                  </div>
                </div>
                <Chip tone={badge.tone}>{badge.label}</Chip>
              </div>
            );
          })}
        </div>
      )}

      {registry?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
}
