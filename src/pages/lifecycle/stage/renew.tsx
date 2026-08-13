import { cn } from "@/lib/utils";
import { Eyebrow, StageDetailLayout } from "@/pages/lifecycle/stage/layout";
import { Rail, RailInsight } from "@/pages/lifecycle/stage/rail";

const BANDS = [
  { label: "Will renew, nothing needed", count: "38,400", amount: "₦1.84B", note: "no action", tone: "teal" as const, share: 64 },
  { label: "Card will fail", count: "9,200", amount: "₦441M", note: "retry timing — approved", tone: "rose" as const, share: 14.9 },
  { label: "Slipping, low recent use", count: "6,800", amount: "₦326M", note: "value reminder, no discount", tone: "amber" as const, share: 10.8 },
  { label: "Open complaint", count: "3,100", amount: "₦148M", note: "CX resolves before we ask", tone: "rose" as const, share: 4.7 },
  { label: "Asked to cancel", count: "3,500", amount: "₦168M", note: "let them go cleanly", tone: "ink" as const, share: 5.7 },
];

const FORECAST = [
  { label: "COMMITTED", value: "₦1.84B", note: "63% of the book", tone: "teal" as const },
  { label: "RECOVERABLE", value: "₦767M", note: "if the plays land", tone: "amber" as const },
  { label: "LIKELY LOST", value: "₦316M", note: "complaint or intent to cancel", tone: "rose" as const },
  { label: "RENEWAL RATE, PROJECTED", value: "88.4%", note: "was 91.2% before March", tone: "rose" as const },
];

const TONE_BG = { teal: "bg-teal", rose: "bg-rose", amber: "bg-amber", ink: "bg-ink-4" } as const;
const TONE_TEXT = { teal: "text-teal", rose: "text-rose", amber: "text-amber", ink: "text-ink-3" } as const;

/** Screen 23 (stage renew) — see flolyt-kit-122/23-stage-renew.svg. */
const StageRenew = () => {
  return (
    <StageDetailLayout
      title="Renew"
      subtitle="61,000 renewals in the next 30 days · ₦2.9B, and what stands between us and it"
      rail={
        <Rail heading="WHAT CS OWNS HERE">
          <RailInsight title="The renewal is not the moment">
            By the time a renewal is at risk, the cause is thirty to ninety days old. This page
            is a scoreboard; the work happened upstream.
          </RailInsight>
          <RailInsight title="Two of the five bands are not ours">
            Failed cards belong to Finance and complaints belong to Support. CS&rsquo;s job is
            to make sure they are being worked, not to work them.
          </RailInsight>
          <RailInsight title="A clean exit is a decision">
            Retention offers at the door teach people that leaving is how you get a better price.
          </RailInsight>
          <RailInsight title="The rate fell before the renewals did">
            88.4% projected against 91.2% before March. Nothing about this cohort&rsquo;s renewal
            month caused that.
          </RailInsight>
        </Rail>
      }
    >
      <section>
        <Eyebrow>Next 30 days, by what is actually in the way</Eyebrow>

        <div className="mt-4 flex h-3 overflow-hidden rounded-full">
          {BANDS.map((b) => (
            <div key={b.label} className={TONE_BG[b.tone]} style={{ width: `${b.share}%` }} />
          ))}
        </div>

        <div className="mt-4 divide-y divide-line rounded-card border border-line bg-paper">
          {BANDS.map((b) => (
            <div key={b.label} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
              <span className={cn("size-2.5 shrink-0 rounded-[3px]", TONE_BG[b.tone])} aria-hidden />
              <span className="text-[12px] font-medium text-ink">{b.label}</span>
              <span className="ml-auto font-mono text-[11.5px] text-ink-2">{b.count}</span>
              <span className="w-20 text-right font-mono text-[12px] font-semibold text-ink">
                {b.amount}
              </span>
              <span className={cn("w-52 text-right text-[11.5px]", TONE_TEXT[b.tone])}>{b.note}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-card border border-dashed border-line bg-paper-2 p-5">
          <h3 className="text-[12.5px] font-semibold text-ink">
            3,500 people asked to cancel. We are going to let them.
          </h3>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
            No retention offer, no three-step flow, no dark pattern. They get a clean exit, their
            data on request, and one message in ninety days. 31% of last year&rsquo;s clean exits
            came back on their own.
          </p>
        </div>
      </section>

      <section>
        <Eyebrow>What renews, on current behaviour</Eyebrow>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {FORECAST.map((f) => (
            <div key={f.label} className="rounded-card border border-line bg-paper p-4">
              <p className="font-mono text-[9px] font-medium tracking-[0.8px] text-ink-4 uppercase">
                {f.label}
              </p>
              <p className={cn("mt-2 text-[19px] font-semibold", TONE_TEXT[f.tone])}>{f.value}</p>
              <p className="mt-1 text-[10px] text-ink-4">{f.note}</p>
            </div>
          ))}
        </div>
      </section>
    </StageDetailLayout>
  );
};

export default StageRenew;
