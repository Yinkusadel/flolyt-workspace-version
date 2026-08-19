import { cn } from "@/lib/utils";
import { KpiCards } from "@/pages/lifecycle/stage/kpi-cards";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { NOT_IN_DIGEST_KPIS, NOT_IN_DIGEST_ROWS } from "@/pages/digest/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** D14 — Not in this digest, /digest/excluded. Standalone drilldown, no tab bar. */
const DigestExcludedRoute = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Not in this digest</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">437 things happened overnight · three reached you · here is every rule that decided that</p>
      </div>

      <KpiCards items={NOT_IN_DIGEST_KPIS} />

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Everything that happened and did not reach you
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Count</th>
                <th className={HEAD_CLASS}>Why it was left out</th>
                <th className={HEAD_CLASS}>Where it is</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Could you change this?</th>
              </tr>
            </thead>
            <tbody>
              {NOT_IN_DIGEST_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.countTone ? TONE_TEXT_CLASS[row.countTone] : "text-ink")}>
                    {row.count}
                  </td>
                  <td className={cn("px-4 py-3", row.whyTone ? TONE_TEXT_CLASS[row.whyTone] : "text-ink-3")}>{row.why}</td>
                  <td className={cn("px-4 py-3", row.whereTone ? TONE_TEXT_CLASS[row.whereTone] : "text-ink-3")}>{row.where}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.canChange === "yes" ? "teal" : "neutral"}>{row.canChange}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">437 things happened and three reached you, and that ratio is the product</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
          A digest that reported everything would be a log with a nicer font. What makes the three trustworthy is
          that this screen exists — you can check what was withheld, see the rule that withheld it, and change the
          two rules that are yours to change.
        </p>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">Eleven rooms opened below your threshold and none of them are hidden</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
          They are in the daily list, ranked, and worth ₦96M combined. Below the digest threshold is not the same as
          invisible — it means "not worth waking up for", which is a different claim entirely.
        </p>
      </div>
    </div>
  );
};

export default DigestExcludedRoute;
