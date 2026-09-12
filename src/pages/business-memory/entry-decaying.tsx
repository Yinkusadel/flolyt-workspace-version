import { Link } from "react-router-dom";
import { Flag } from "lucide-react";

import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import type { MemoryEntry } from "@/pages/business-memory/data";

const CHART_HEIGHT = 140;

function EffectivenessChart({ chart, targetPercent }: { chart: { month: string; percent: number }[]; targetPercent: number }) {
  const floor = Math.min(...chart.map((p) => p.percent), targetPercent) - 8;
  const scale = (percent: number) => ((percent - floor) / (100 - floor)) * CHART_HEIGHT;
  const targetY = CHART_HEIGHT - scale(targetPercent);

  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <div className="relative" style={{ height: CHART_HEIGHT }}>
        <div
          className="absolute inset-x-0 border-t border-dashed border-amber"
          style={{ top: targetY }}
        />
        <span className="absolute right-0 text-[10.5px] text-amber" style={{ top: targetY - 14 }}>
          target {targetPercent}%
        </span>

        <div className="flex h-full items-end gap-3">
          {chart.map((point) => (
            <div key={point.month} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={point.percent >= targetPercent ? "w-full rounded-t-sm bg-teal" : "w-full rounded-t-sm bg-amber"}
                style={{ height: Math.max(scale(point.percent), 2) }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex gap-3">
        {chart.map((point) => (
          <span key={point.month} className="flex-1 text-center text-[10.5px] text-ink-4">
            {point.month}
          </span>
        ))}
      </div>
    </div>
  );
}

export function EntryDecaying({ entry }: { entry: MemoryEntry }) {
  usePageBreadcrumb([{ label: "Business memory", to: "/business-memory" }, { label: entry.title }]);

  const decay = entry.decay;
  if (!decay) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[17px] font-semibold text-ink">{entry.title}</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Closed {entry.closedFull} · {entry.preserved} preserved · cited {entry.citedCount} times
          </p>
        </div>
        <Chip tone="amber" className="shrink-0">
          Decaying
        </Chip>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <div className="flex items-start gap-2.5">
          <Flag className="mt-0.5 size-4 shrink-0 text-amber" />
          <div className="space-y-1.5">
            <p className="text-[14px] font-semibold text-amber">The control is no longer holding</p>
            <p className="text-[12.5px] text-amber/90">{decay.summary}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Control effectiveness since implementation
        </p>
        <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
          <EffectivenessChart chart={decay.chart} targetPercent={decay.chartTargetPercent} />

          <div className="flex flex-col justify-between rounded-card border border-line bg-paper p-5">
            <div>
              <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">What changed</p>
              <p className="mt-2 text-[13px] text-ink-2">{decay.whatChanged}</p>
            </div>
            <Button asChild className="mt-4 w-full">
              <Link to="/rooms/new">Open a room on the recurrence</Link>
            </Button>
          </div>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What this entry still gives you
        </p>
        <div className="mt-2 space-y-1">
          <p className="text-[13px] text-ink-2">{decay.stillGivesYou}</p>
        </div>
      </div>
    </div>
  );
}
