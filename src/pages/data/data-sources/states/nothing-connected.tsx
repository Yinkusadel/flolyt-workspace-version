import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DS01_STEP_ROWS, DS_TONE_CLASS } from "@/pages/data/data-sources/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DS01 — before anything is connected. Wired but unreachable with DATA_SOURCES_STATE's current default. */
export function NothingConnectedState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data sources</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Nothing connected · read-only, field-scoped, and reversible until the baseline locks
        </p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">Nothing is connected yet</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          Flolyt reads and never writes. Every source is connected with a read-only credential, scoped to named
          fields, and everything the product can say afterwards is bounded by what is on this screen.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => navigate("/data-sources/new")}>
            Connect a source
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/data-sources/what-we-read")}>
            What Flolyt reads
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          Connect orders first. Almost nothing in this product works without it, and the screen will say so as you
          go.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What connecting the first one starts</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Step</th>
                <th className={HEAD_CLASS}>What happens</th>
                <th className={cnRight}>How long</th>
                <th className={cnRight}>Reversible</th>
              </tr>
            </thead>
            <tbody>
              {DS01_STEP_ROWS.map((row) => (
                <tr key={row.step} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4">{row.step}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DS_TONE_CLASS[row.howTone]}`}>{row.how}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.reversibleTone === "risk" ? "rose" : "teal"}>{row.reversible}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Nothing this product says is stronger than what this section is reading">
        Every figure elsewhere — the leakage map, the funnel, every claim type, every Unavailable — resolves back to
        a row on this screen. Connecting a source is the only irreversible-feeling act in Flolyt, and it is the one
        that is most reversible: disconnect it and the figures that depended on it go to Unavailable rather than to
        zero.
      </Callout>
    </div>
  );
}

const cnRight = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
