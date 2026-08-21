import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { CampaignsKvList } from "@/pages/customers/campaigns/kv-list";
import { CP11_APPLIED_ROWS, CP11_KV_ROWS, CP_TONE_CLASS } from "@/pages/customers/campaigns/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CP11 — step 3, "Guardrails". */
export function StepGuardrails() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Applied automatically · you are seeing them, not setting them</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Guardrail</th>
                <th className={`${HEAD_CLASS} text-right`}>Effect here</th>
                <th className={HEAD_CLASS}>Who set it</th>
                <th className={`${HEAD_CLASS} text-right`}>Yours to change</th>
              </tr>
            </thead>
            <tbody>
              {CP11_APPLIED_ROWS.map((row) => (
                <tr key={row.guardrail} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.guardrail}</td>
                  <td className={`px-4 py-3 text-right font-mono ${CP_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                  <td className="px-4 py-3 text-ink-3">{row.whoSetIt}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone="rose">no</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Yours to set · and one of them is required</p>
        <CampaignsKvList rows={CP11_KV_ROWS} />
      </section>

      <Callout tone="amber" title="Removing the holdout is possible and costs you the ability to claim anything">
        The field accepts a typed reason and the campaign will run without a control. Its result then enters the
        value ledger as unattributable, permanently, alongside the Lagos refund and the weekend cadence change. That
        is a real choice somebody should be able to make — and it is not a checkbox, because it decides in advance
        what the campaign will be able to prove.
      </Callout>
    </div>
  );
}
