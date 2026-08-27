import { cn } from "@/lib/utils";
import { UNLOCK_CATEGORIES } from "@/pages/onboarding/data/data";

/**
 * flolyt-figma-designs/onboarding/05-connect-first-source.svg's right rail. Desktop only —
 * hidden below lg, since a 400px-wide aside has nowhere to go on a phone. Each row's dot
 * lights up teal once at least one active connected datasource carries that category —
 * gray otherwise.
 */
export function WhatSourceUnlocks({ connectedCategories }: { connectedCategories: Set<string> }) {
  return (
    <aside className="hidden w-100 shrink-0 overflow-y-auto border-l border-line bg-paper-2 p-8 lg:block">
      <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
        What one source unlocks
      </p>

      <div className="mt-6 space-y-6">
        {UNLOCK_CATEGORIES.map((item) => {
          const unlocked = item.matchesCategories.some((c) => connectedCategories.has(c));
          return (
            <div key={item.key} className="flex gap-3">
              <span
                className={cn("mt-1.5 size-2 shrink-0 rounded-full", unlocked ? "bg-teal" : "bg-line")}
                aria-hidden
              />
              <div>
                <p className="text-[12.5px] font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-ink-3">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-card border border-dashed border-line bg-paper p-4">
        <p className="text-[12px] font-semibold text-ink">You can start with one</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-3">
          Agents say plainly which answers they cannot give yet, and which source would unlock them.
          Nothing is estimated to fill a gap.
        </p>
      </div>
    </aside>
  );
}
