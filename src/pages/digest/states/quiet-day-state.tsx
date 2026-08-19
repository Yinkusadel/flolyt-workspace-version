import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { KvList } from "@/pages/digest/kv-list";
import { QUIET_DAY_STATS, QUIET_DAY_STILL_RUNNING } from "@/pages/digest/data";

/** D03 — A quiet day. Wired but unreachable given QUIET_DAY_ACTIVE in data.ts. */
export function QuietDayState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Your morning digest</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Thursday 14 August · nothing needed you overnight · about fifteen seconds to read
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/settings/digest">Digest settings</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Overnight</p>

          <div className="rounded-card border-2 border-teal-border bg-teal-bg p-5">
            <h2 className="text-[15px] font-semibold text-ink">Nothing needed you overnight</h2>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
              No approvals, no conflicts, no unowned rooms, nothing overdue. Eleven rooms are open and all of them
              have somebody on them.
            </p>
            <p className="mt-3 border-t border-dashed border-teal-border pt-3 font-mono text-[10.5px] font-semibold text-teal">
              This happens about two days a week and it is not an error
            </p>
          </div>

          <div className="rounded-card border border-line bg-paper p-4">
            <span className="font-mono text-[9.5px] font-semibold tracking-[0.6px] text-ink-3 uppercase">Worth knowing</span>
            <h3 className="mt-2 text-[13px] font-semibold text-ink">Wave two of the reactivation sends at 08:00</h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
              33,000 customers. Nothing is required from you — it was approved on Friday and the holdout is intact.
            </p>
            <p className="mt-3 border-t border-dashed border-line pt-3 font-mono text-[10.5px] text-ink-3">no action needed</p>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-4">
            <h3 className="text-[13px] font-semibold text-ink">What a quiet digest deliberately does not do</h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
              It does not scrape together three items to look useful, does not surface an agent run that finished
              cleanly, and does not report yesterday's news a second time. A digest that is never empty is a digest
              nobody believes.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <KvList label="Still running" rows={QUIET_DAY_STILL_RUNNING} />
          <KvList label="Quiet days" rows={QUIET_DAY_STATS} />
          <div className="rounded-card border border-teal-border bg-teal-bg p-4">
            <p className="text-[12px] font-semibold text-ink">Quiet days are counted</p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
              They appear in the archive with the same weight as busy ones, so "how often does this actually need me"
              is answerable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
