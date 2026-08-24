import { useState } from "react";
import { Link } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { MarketplaceTabs } from "@/pages/agents/marketplace/tabs";
import { MarketplaceKvList } from "@/pages/agents/marketplace/kv-list";
import { UninstallModal } from "@/pages/agents/marketplace/modals/uninstall-modal";
import { MK07_KV, MK07_ROWS, MK_CHIP_TONE, MK_TONE_CLASS } from "@/pages/agents/marketplace/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** MK07 — /marketplace/installed. */
const InstalledRoute = () => {
  const [uninstallOpen, setUninstallOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Installed here</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Two installed · five findings between them · and their record elsewhere is unknowable</p>
      </div>

      <MarketplaceTabs active="Installed" />

      <Link
        to="/marketplace/installed/update"
        className="block rounded-card border border-amber-border bg-amber-bg p-4 transition-colors hover:border-amber"
      >
        <p className="text-[12px] font-semibold text-ink">Hold list integrity is paused, waiting on an update</p>
        <p className="mt-1 text-[10.5px] text-amber">Its publisher now wants one more field · review the change</p>
      </Link>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Two installed · their record here is the only record that exists</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={`${HEAD_CLASS} text-right`}>Publisher</th>
                <th className={`${HEAD_CLASS} text-right`}>Installed</th>
                <th className={`${HEAD_CLASS} text-right`}>Findings here</th>
                <th className={`${HEAD_CLASS} text-right`}>Tested</th>
                <th className={`${HEAD_CLASS} text-right`}>Cost</th>
                <th className={`${HEAD_CLASS} text-right`}>Record elsewhere</th>
              </tr>
            </thead>
            <tbody>
              {MK07_ROWS.map((row) => (
                <tr key={row.agent} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.agent}</td>
                  <td className={`px-4 py-3 text-right ${MK_TONE_CLASS[row.publisherTone]}`}>{row.publisher}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.installed}</td>
                  <td className={`px-4 py-3 text-right font-mono ${MK_TONE_CLASS[row.findingsTone]}`}>{row.findings}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={MK_CHIP_TONE[row.testedTone]}>{row.tested}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-ink-3">{row.cost}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Chip tone="neutral">{row.elsewhere}</Chip>
                      {row.agent === "Subscription cohorting" && (
                        <button
                          type="button"
                          onClick={() => setUninstallOpen(true)}
                          className="shrink-0 text-[10.5px] font-semibold text-ink-3 hover:text-ink"
                        >
                          Uninstall
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The last column reads unknown for both and always will">
        Fifty-two companies use subscription cohorting and this workspace has no way to find out whether it helped
        any of them. What is known is that it has produced four findings here, none of which has been tested
        against a holdout, at a cost of ₦410 since February. That is a thinner picture than any marketplace would
        normally show and it is the true one.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>How an installed agent differs from the twelve</p>
        <MarketplaceKvList rows={MK07_KV} />
      </section>

      <UninstallModal open={uninstallOpen} onOpenChange={setUninstallOpen} />
    </div>
  );
};

export default InstalledRoute;
