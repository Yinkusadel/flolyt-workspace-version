import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { DataSourcesHero } from "@/pages/data/data-sources/hero-banner";
import { WidenAScopeModal } from "@/pages/data/data-sources/modals/widen-a-scope-modal";
import {
  DS04_BREAKS_ROWS,
  DS04_CONNECTION_ROWS,
  DS15_TIMELINE_ROWS,
  DS_TONE_CLASS,
} from "@/pages/data/data-sources/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DS04 — the `orders` reference row. */
function OrdersDetail() {
  const [widenOpen, setWidenOpen] = useState(false);

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Data sources", to: "/data-sources" }, { label: "orders" }]}
        title="orders"
        subtitle="Five fields · six stages · and what an outage stops, which is not everything"
        action={
          <Button type="button" variant="outline" onClick={() => setWidenOpen(true)}>
            Add a field
          </Button>
        }
      />

      <DataSourcesHero
        tone="teal"
        kicker="orders · connected 12 december"
        value="1.24M rows"
        desc="Five fields, read-only, delivering every fourteen minutes. Six of nine stages depend on it."
        statLabel="if it stops"
        statValue="6 stages"
        statSub="go to Unavailable, not to zero"
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The connection itself</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <tbody>
              {DS04_CONNECTION_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-0">
                  <td className="w-1/4 px-4 py-3 font-semibold text-ink-3">{row.label}</td>
                  <td className="px-4 py-3 text-ink-2">{row.value}</td>
                  <td className={`px-4 py-3 text-right font-mono ${DS_TONE_CLASS[row.changedTone]}`}>{row.changed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What breaks when it stops</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What</th>
                <th className={HEAD_RIGHT_CLASS}>Effect</th>
                <th className={HEAD_CLASS}>What it shows instead</th>
                <th className={HEAD_RIGHT_CLASS}>How long before it matters</th>
              </tr>
            </thead>
            <tbody>
              {DS04_BREAKS_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className={`px-4 py-3 text-right ${DS_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                  <td className="px-4 py-3 text-ink-4">{row.instead}</td>
                  <td className={`px-4 py-3 text-right ${DS_TONE_CLASS[row.howTone]}`}>{row.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="An outage stops what depends on this source and does not stop anything already decided">
        Plays that were approved yesterday keep sending, because the audience was built and a person authorised it.
        The ledger keeps its closed figures. What stops is everything that would be a new statement about the world
        — which is the correct thing to stop, and the thing most systems keep producing from a stale cache.
      </Callout>

      <WidenAScopeModal open={widenOpen} onOpenChange={setWidenOpen} />
    </div>
  );
}

/** DS15 — the `ad_spend` reference row, at the `ad-spend` slug per the export's own footer. */
function AdSpendDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Data sources", to: "/data-sources" }, { label: "ad_spend" }]}
        title="ad_spend"
        subtitle="Six months of perfect delivery and a 22% hole · found by a shape, not by an error"
      />

      <DataSourcesHero
        tone="rose"
        kicker="delivering daily, healthy, and wrong"
        value="14k rows"
        desc="It has been arriving on time since December and it excludes agency fees, which are 22% of spend."
        statLabel="found by"
        statValue="Data Integrity"
        statSub="after 6 months"
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>How this was found, and what it means for what was said before</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>What happened</th>
                <th className={HEAD_CLASS}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {DS15_TIMELINE_ROWS.map((row, i) => (
                <tr key={`${row.when}-${i}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className={`px-4 py-3 ${DS_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="A source arriving reliably every day is not the same as a source being right">
        Freshness, row counts and schema all looked perfect for six months. Nothing in a health dashboard would have
        caught this, because the data was complete against its own definition and the definition was wrong. It took
        an agent noticing a shape and a person who knew how the agency billed.
      </Callout>

      <Callout tone="teal" title="Everything derived from it was restated rather than quietly corrected">
        Four CAC figures moved, two findings were revised and one learning about paid social was superseded — all
        with the date and the reason attached, so anybody who quoted the old number in May can find out why it
        changed. The alternative is a workspace where numbers improve silently and nobody trusts the improvement.
      </Callout>
    </div>
  );
}

function SourceNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Source not found</p>
      <Link to="/data-sources" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to data sources
      </Link>
    </div>
  );
}

/** DS04 (`orders`) and DS15 (`ad-spend`) — the section's only two built `:id` reference rows, same "one/two reference rows" pattern as every prior section. */
const SourceDetailRoute = () => {
  const { id } = useParams();

  if (id === "orders") return <OrdersDetail />;
  if (id === "ad-spend") return <AdSpendDetail />;
  return <SourceNotFound />;
};

export default SourceDetailRoute;
