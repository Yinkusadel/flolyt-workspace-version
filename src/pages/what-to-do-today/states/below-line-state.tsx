import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { ScopeTabs } from "@/pages/what-to-do-today/scope-tabs";
import { BELOW_THE_LINE, TODAY_ITEMS } from "@/pages/what-to-do-today/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** T05 — the below-the-line expanded view, reached via ?show=all. */
export function BelowLineState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">What to do today · everything</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Four ranked, six that cannot be ranked yet, and the reason for each
          </p>
        </div>
        <Button variant="outline" className="shrink-0">
          Quick wins only
        </Button>
      </div>

      <ScopeTabs active="mine" />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Ranked · above the line</p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[560px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>#</th>
                <th className={HEAD_CLASS}>Do this</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={cn(HEAD_CLASS, "text-right")}>State</th>
              </tr>
            </thead>
            <tbody>
              {TODAY_ITEMS.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0 hover:bg-paper-2">
                  <td className="px-4 py-3 font-mono text-ink-4">{item.rank}</td>
                  <td className="px-4 py-3">
                    <Link to={`/what-to-do-today/${item.id}`} className="font-semibold text-ultra hover:underline">
                      {item.title}
                    </Link>
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 text-right font-mono font-semibold",
                      item.atStakeTone ? TONE_TEXT_CLASS[item.atStakeTone] : "text-ink"
                    )}
                  >
                    {item.atStake}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={item.stateTone}>{item.stateLabel}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Below the line · why each one is here rather than up there
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Item</th>
                <th className={HEAD_CLASS}>Reason it is not ranked</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Would rank when</th>
              </tr>
            </thead>
            <tbody>
              {BELOW_THE_LINE.map((row) => (
                <tr key={row.item} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5 text-ink-2">{row.item}</td>
                  <td className="px-4 py-3.5 text-ink-3">{row.reason}</td>
                  <td
                    className={cn(
                      "px-4 py-3.5 text-right font-mono",
                      row.atStakeTone ? TONE_TEXT_CLASS[row.atStakeTone] : "text-ink"
                    )}
                  >
                    {row.atStake}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3.5 text-right",
                      row.wouldRankWhenTone ? TONE_TEXT_CLASS[row.wouldRankWhenTone] : "text-ink-4"
                    )}
                  >
                    {row.wouldRankWhen}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="rose" title="The last row is the uncomfortable one">
        ₦74M sits behind an idea that has been suggested twice by an agent, deferred twice, and never became an
        open item. It is not below the line because it is small — it is below the line because nothing in the
        product turns a deferred suggestion into something that gets ranked. That is a real gap and it is shown
        rather than absorbed.
      </Callout>

      <Callout tone="neutral" title="Two things become rankable the moment a source connects">
        Both name the exact source. A blocked item with a named unblocker is a task; a blocked item without one is
        a mystery, and this screen refuses to produce mysteries.
      </Callout>
    </div>
  );
}
