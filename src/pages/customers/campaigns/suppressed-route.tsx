import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { CampaignsTabs } from "@/pages/customers/campaigns/tabs";
import { SuppressedBar } from "@/pages/customers/campaigns/suppressed-bar";
import { CP07_PEOPLE_BAR_ROWS, CP07_RULE_ROWS, CP_CHIP_TONE, CP_TONE_CLASS } from "@/pages/customers/campaigns/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CP07 — /campaigns/suppressed. */
const CampaignsSuppressedRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Suppressed</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">41,000 people did not receive something · six rules, one of which is reported as a count only</p>
        </div>
        <Button type="button" onClick={() => toast.info("Opening the frequency-cap rule editor")}>
          Change a rule
        </Button>
      </div>

      <CampaignsTabs active="Suppressed" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who did not receive something this week, and why</p>
        <div className="max-w-2xl">
          <SuppressedBar rows={CP07_PEOPLE_BAR_ROWS} />
        </div>
      </section>

      <Callout tone="amber" title="Six thousand four hundred people were suppressed silently and the count is published weekly for one reason">
        The cap works quietly at send time, which is right. Afterwards it is not: a campaign that reached 6,400
        fewer people than its audience says will report a lower response rate for a reason nobody can see in the
        campaign report. This is the number to check before concluding that a play underperformed.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Suppression by rule</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Rule</th>
                <th className={`${HEAD_CLASS} text-right`}>People</th>
                <th className={HEAD_CLASS}>Who set it</th>
                <th className={HEAD_CLASS}>Overridable</th>
                <th className={HEAD_CLASS}>Told to the campaign owner?</th>
              </tr>
            </thead>
            <tbody>
              {CP07_RULE_ROWS.map((row) => (
                <tr key={row.rule} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.rule}</td>
                  <td className={`px-4 py-3 text-right font-mono ${CP_TONE_CLASS[row.peopleTone]}`}>{row.people}</td>
                  <td className="px-4 py-3 text-ink-3">{row.whoSetIt}</td>
                  <td className="px-4 py-3">
                    <Chip tone={CP_CHIP_TONE[row.overridableTone]}>{row.overridable}</Chip>
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={CP_CHIP_TONE[row.toldTone]}>{row.told}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="Opt-outs are reported as a count and never as a list">
        The campaign owner is told that 6,100 people were suppressed for consent and is never told which ones.
        Everything else on this screen can be inspected down to the cohort. Consent is the one exclusion where
        knowing who would let somebody route around it, so the number travels and the names do not.
      </Callout>
    </div>
  );
};

export default CampaignsSuppressedRoute;
