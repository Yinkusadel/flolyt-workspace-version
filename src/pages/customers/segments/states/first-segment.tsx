import { useNavigate } from "react-router-dom";

import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { IFEOMA } from "@/pages/everyday/rooms/data";
import { SegmentsKvList } from "@/pages/customers/segments/kv-list";
import { SG02_KV_ROWS, SG02_STATS, SG_KPI_TONE } from "@/pages/customers/segments/data";

/** SG02 — 20 minutes after the first segment was defined. Wired but unreachable with SEGMENTS_STATE's current default. */
export function FirstSegmentState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Segments</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">1 defined · 20 minutes ago</p>
      </div>

      <button
        type="button"
        onClick={() => navigate("/segments/lapsed-fee")}
        className="flex w-full items-start gap-4 rounded-card border border-teal-border bg-teal-bg p-5 text-left transition-colors hover:border-teal"
      >
        <PersonAvatar kind="human" initials={IFEOMA.initials} style={{ backgroundColor: DEPARTMENT_COLORS[IFEOMA.department] }} />
        <div className="min-w-0">
          <h2 className="text-[14px] font-semibold text-ink">
            Ifeoma defined the first segment and it is smaller than the cluster it came from
          </h2>
          <p className="mt-1.5 text-[11px] text-ink-2">
            Repeat & Decay found 148,000 customers who stopped ordering after 4 March. The segment she wrote holds
            100,000, because 48,000 of them cannot be contacted and she did not want a group she could not act on.
          </p>
          <p className="mt-1.5 text-[11px] font-semibold text-teal">
            Both numbers are kept on the segment. The 48,000 are excluded by name, not dropped.
          </p>
        </div>
      </button>

      <KpiCards items={SG02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: SG_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What defining it established for every segment after it</p>
        <SegmentsKvList rows={SG02_KV_ROWS} />
      </section>
    </div>
  );
}
