import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { RAVI } from "@/pages/everyday/rooms/data";
import { CampaignsKvList } from "@/pages/customers/campaigns/kv-list";
import { CP02_KV_ROWS, CP02_STATS, CP_KPI_TONE } from "@/pages/customers/campaigns/data";

/** CP02 — 20 minutes-scale "the first send" state. Wired but unreachable with CAMPAIGNS_STATE's current default. */
export function FirstCampaignState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Campaigns</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">One sent · 19,260 reached, 2,140 held · approved by a person with a re-auth</p>
      </div>

      <div className="rounded-card border border-teal-border bg-teal-bg p-5">
        <div className="flex items-start gap-3.5">
          <PersonAvatar kind="human" initials={RAVI.initials} style={{ backgroundColor: DEPARTMENT_COLORS[RAVI.department] }} />
          <div className="min-w-0">
            <h2 className="text-[14px] font-semibold text-ink">
              Ravi approved the first campaign and 2,140 people were deliberately left out of it
            </h2>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
              Card retries move from midnight to 09:00 local for 19,260 customers. 2,140 stay on the old pattern so
              the change can be measured against something.
            </p>
            <p className="mt-1.5 text-[11px] font-semibold text-teal">
              He re-authenticated at 09:12. The approval is his, by name, and it covers this send only.
            </p>
          </div>
        </div>
      </div>

      <KpiCards items={CP02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: CP_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What sending the first one established</p>
        <CampaignsKvList rows={CP02_KV_ROWS} />
      </section>

      <Callout tone="amber" title="The first campaign in the workspace cost 2,140 customers a working payment">
        Those people were left on a retry pattern already known to be worse, for nine days, so that the other 19,260
        could be measured against something. It is defensible and it is a real cost, and it appears on the campaign
        rather than in a methods note — because the next person designing one should see both halves.
      </Callout>
    </div>
  );
}
