import { cn } from "@/lib/utils";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KvList } from "@/pages/everyday/digest/kv-list";
import { BULK_ACTION_ROWS, BULK_BANNER, BULK_CLOSING_CALLOUT, BULK_DIAGNOSTIC_ROWS } from "@/pages/everyday/inbox/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** I14 — No bulk approve. The selection-mode state of /inbox, shown once one or more items are checked. */
export function BulkSelectionPanel({ count, onClear }: { count: number; onClear: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">
            {count} selected
          </h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Snooze, assign and mark read work in bulk · approval never does
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 rounded-panel border border-line bg-paper px-3.5 py-1.5 text-[11.5px] font-medium text-ink-2 hover:border-ink-4"
        >
          Clear selection
        </button>
      </div>

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">
          You have selected {count} item{count === 1 ? "" : "s"}. There is no approve button.
        </h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{BULK_BANNER.body}</p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What you can do to {count} items at once
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Action</th>
                <th className={HEAD_CLASS}>Available in bulk?</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>Logged as</th>
              </tr>
            </thead>
            <tbody>
              {BULK_ACTION_ROWS.map((row) => (
                <tr key={row.action} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.action}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.availableTone}>{row.available}</Chip>
                  </td>
                  <td className={cn("px-4 py-3", row.whyTone ? undefined : "text-ink-3")}>{row.why}</td>
                  <td className="px-4 py-3 text-ink-4 whitespace-nowrap">{row.loggedAs ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{BULK_CLOSING_CALLOUT.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{BULK_CLOSING_CALLOUT.body}</p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          If you are here because the queue is too long
        </p>
        <KvList rows={BULK_DIAGNOSTIC_ROWS} />
      </div>
    </div>
  );
}
