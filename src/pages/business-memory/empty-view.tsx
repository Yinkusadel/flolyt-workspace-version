import { Library } from "lucide-react";

import { OPEN_ROOMS_PREVIEW } from "@/pages/business-memory/data";

/** ME05 — /business-memory before any room has closed. Reachable by flipping `MEMORY_DEMO_STATE` in data.ts. */
export function MemoryEmptyState() {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <span className="flex size-11 items-center justify-center rounded-card bg-paper-2 text-ink-3">
        <Library className="size-5" />
      </span>

      <h1 className="mt-5 text-[18px] font-semibold text-ink">Memory starts at the first closed room</h1>
      <p className="mt-1 text-[11.5px] text-ink-3">Nothing has closed yet</p>

      <p className="mx-auto mt-4 max-w-md text-[12.5px] leading-relaxed text-ink-2">
        When a room closes, what broke, what was tried, what worked and the control that prevents it are kept here
        — and cited the next time a similar pattern appears.
      </p>

      <div className="mt-6 w-full max-w-lg rounded-card border border-line bg-paper p-5 text-left">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          {OPEN_ROOMS_PREVIEW.length} rooms are open and will land here
        </p>
        <div className="mt-3 space-y-2.5">
          {OPEN_ROOMS_PREVIEW.map((room) => (
            <div key={room.label} className="flex items-center justify-between gap-3">
              <p className="text-[12.5px] text-ink">{room.label}</p>
              <p className="text-[11.5px] text-ink-3">{room.stage}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-[11px] text-ink-4">Nothing is written here until an outcome is measured. There are no sample entries.</p>
    </div>
  );
}
