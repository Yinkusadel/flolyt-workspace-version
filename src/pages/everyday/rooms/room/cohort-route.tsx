import { Button } from "@/components/ui/button";
import { KpiCards, type Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { useRoomContext } from "@/pages/everyday/rooms/room/room-layout";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const STATS: Kpi[] = [
  { eyebrow: "In this cohort", value: "148,000", note: "3.5% of the base" },
  { eyebrow: "Reachable", value: "100,000", tone: "amber", note: "after exclusions" },
  { eyebrow: "Sampled below", value: "6", note: "random, reshuffles on load" },
  { eyebrow: "Exportable", value: "No", tone: "rose", note: "needs Ada + an admin" },
];

const INSIGHTS = [
  {
    eyebrow: "Two cannot be contacted",
    heading: "≈2,400 of the 148,000",
    body: "One erasure request and one opt-out in this sample. Extrapolated, roughly 2,400 people in this audience must be removed before anything sends — and they already have been.",
    footer: "auto-excluded",
    tone: "rose" as const,
  },
  {
    eyebrow: "One is already capped",
    heading: "≈31,900 of the 148,000",
    body: "This is the same overlap the collision screen prices — it shows up here first, in a sample you can eyeball in ten seconds.",
    footer: "see the collision view",
    tone: "amber" as const,
  },
  {
    eyebrow: "Two markets in a Nigerian cohort",
    heading: "Worth checking",
    body: "The room is scoped to Mar–May acquisitions and picked up Ghana and Kenya customers. That may be correct. Nobody would ever have noticed it from the number 148,000.",
    footer: "the reason this screen exists",
    tone: "amber" as const,
  },
];

/** R33 — Room · the cohort (`/rooms/:id/cohort`). */
export const CohortRoute = () => {
  const { room } = useRoomContext();
  const sample = room.cohortSample ?? [];

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Rooms", to: "/rooms" }, { label: room.title, to: `/rooms/${room.id}` }, { label: "The cohort" }]}
        title="The cohort"
        subtitle="148,000 customers · sampled at random · export is not available here"
        action={<Button>Reshuffle the sample</Button>}
      />

      <KpiCards items={STATS} />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          A sanity check, not a customer list
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Customer</th>
                <th className={HEAD_CLASS}>Acquired</th>
                <th className={HEAD_CLASS}>First order</th>
                <th className={HEAD_CLASS}>Since</th>
                <th className={HEAD_CLASS}>Market</th>
                <th className={HEAD_CLASS}>First delivery</th>
                <th className={HEAD_CLASS}>Contactable</th>
              </tr>
            </thead>
            <tbody>
              {sample.map((row) => (
                <tr key={row.customer} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.customer}</td>
                  <td className="px-4 py-3 font-mono text-ink-4">{row.acquired}</td>
                  <td className="px-4 py-3 font-mono text-ink">{row.firstOrder}</td>
                  <td className="px-4 py-3 font-mono text-ink-4">{row.since}</td>
                  <td className="px-4 py-3 text-ink-3">{row.market}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.firstDelivery.tone}>{row.firstDelivery.label}</Chip>
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={row.contactable.tone}>{row.contactable.label}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What a handful of rows already tell you
        </p>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
          {INSIGHTS.map((card) => (
            <div key={card.eyebrow} className="flex flex-col rounded-card border border-line bg-paper p-4">
              <p className="font-mono text-[9px] font-medium tracking-[0.7px] text-ink-4 uppercase">{card.eyebrow}</p>
              <p className="mt-1.5 text-[12.5px] font-semibold text-ink">{card.heading}</p>
              <p className="mt-1.5 flex-1 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
              <Chip tone={card.tone}>{card.footer}</Chip>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">A sample, deliberately, and never an export</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            Nobody needs to scroll 148,000 people. What they need is a random handful, to confirm the cohort is what
            they think it is before agreeing to message everyone in it. Export is a separate, jointly-approved,
            fully-logged action — not a button on this page.
          </p>
        </div>
      </div>
    </div>
  );
};
