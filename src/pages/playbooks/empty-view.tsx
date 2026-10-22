import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

import { CLOSEST_TO_BECOMING_ONE } from "@/pages/playbooks/data";

/** PB06 — /playbooks before anything has worked three times. Reachable by flipping
 * `PLAYBOOKS_DEMO_STATE` in index.tsx. */
export function PlaybooksEmptyState() {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <span className="flex size-11 items-center justify-center rounded-card bg-paper-2 text-ink-3">
        <BookOpen className="size-5" />
      </span>

      <h1 className="mt-5 max-w-md text-[18px] font-semibold text-ink">
        Playbooks come from outcomes, not from a blank page
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-[12.5px] leading-relaxed text-ink-3">
        When the same fix works in three separate rooms, Maestro proposes it as a playbook. You can write one from
        scratch, but the ones that last are the ones that already worked.
      </p>

      <div className="mt-6 w-full max-w-lg rounded-card border border-line bg-paper p-5 text-left">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Closest to becoming one
        </p>
        <div className="mt-3 space-y-2.5">
          {CLOSEST_TO_BECOMING_ONE.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3">
              <p className="text-[12.5px] text-ink">{row.label}</p>
              <p className="text-[11.5px] text-ink-3">{row.note}</p>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/playbooks/new"
        className="mt-6 rounded-control border border-ultra-border px-4 py-2 text-[13px] font-medium text-ultra hover:bg-ultra-bg"
      >
        Write one anyway
      </Link>
    </div>
  );
}
