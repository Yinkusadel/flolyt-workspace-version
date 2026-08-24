import { DH_BLOCK_CLASS } from "@/pages/data/data-health/data";

/** A source's delivery over the last 24 hours, one block an hour (DH04). */
export function FreshnessBar({ source, sub, blocks }: { source: string; sub: string; blocks: ("ok" | "warn" | "risk" | "muted")[] }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[12px] font-semibold text-ink">{source}</span>
        <span className="font-mono text-[10px] text-ink-3">{sub}</span>
      </div>
      <div className="mt-2 flex gap-[3px]">
        {blocks.map((tone, i) => (
          <span key={i} className={`h-2.5 flex-1 rounded-[2px] ${DH_BLOCK_CLASS[tone]}`} aria-hidden />
        ))}
      </div>
    </div>
  );
}
