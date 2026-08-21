import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { RepliesKvList } from "@/pages/customers/replies/kv-list";
import { RP02_KV_ROWS, RP02_MESSAGE, RP02_STATS, RP_KPI_TONE } from "@/pages/customers/replies/data";

/** RP02 — the first reply arrives, 11 minutes ago. Wired but unreachable with REPLIES_STATE's current default. */
export function FirstReplyState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Replies</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">One reply · answered in 40 minutes · it described the fee problem 131 days early</p>
        </div>
        <Button type="button" onClick={() => navigate("/replies/4118207")}>
          Open it
        </Button>
      </div>

      <div className="rounded-card border-l-4 border-l-ultra border border-line bg-white p-5">
        <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{RP02_MESSAGE.meta}</p>
        <p className="mt-3 text-[13px] leading-relaxed text-ink">{RP02_MESSAGE.body}</p>
      </div>

      <KpiCards items={RP02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: RP_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happened to this reply, in order</p>
        <RepliesKvList rows={RP02_KV_ROWS} />
      </section>

      <Callout tone="rose" title="The first reply in the workspace described the ₦1.08B problem in four sentences on 24 March">
        It arrived four months before the leakage map connected the same cause across ten stages, in plain
        language, unprompted, from somebody who had closed the app three times. It was answered promptly and
        correctly and it changed nothing, because one person saying it is an anecdote — which is true, and is also
        the most expensive true thing in this build.
      </Callout>
    </div>
  );
}
