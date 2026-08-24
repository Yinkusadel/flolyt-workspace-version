import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { DataSourcesHero } from "@/pages/data/data-sources/hero-banner";
import { SM04_BREAKS_ROWS, SM04_WHAT_ROWS, SM_TONE_CLASS } from "@/pages/data/schema/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SM04 — the `customers.market` reference row. */
function CustomersMarketDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Schema", to: "/schema" }, { label: "customers.market" }]}
        title="customers.market"
        subtitle="31 metrics · four failure modes · three of them detectable"
        action={
          <Button type="button" variant="outline">
            Edit the meaning
          </Button>
        }
      />

      <DataSourcesHero
        tone="teal"
        kicker="metrics depending on this field"
        value="31"
        desc="Billing market, not delivery market. Every market comparison in the product resolves through this one column."
        statLabel="changed"
        statValue="never"
        statSub="watched daily since 12 December"
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What it is</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[620px] text-left text-[11.5px]">
            <tbody>
              {SM04_WHAT_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-0">
                  <td className="w-1/4 px-4 py-3 font-semibold text-ink-3">{row.label}</td>
                  <td className="px-4 py-3 text-ink-2">{row.value}</td>
                  <td className={`px-4 py-3 text-right font-mono ${SM_TONE_CLASS[row.noteTone]}`}>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What would break if it changed</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>If</th>
                <th className={HEAD_CLASS}>What happens</th>
                <th className={HEAD_CLASS}>Detected by</th>
                <th className={HEAD_CLASS}>Effect</th>
              </tr>
            </thead>
            <tbody>
              {SM04_BREAKS_ROWS.map((row) => (
                <tr key={row.if} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.if}</td>
                  <td className="px-4 py-3 text-ink-2">{row.happens}</td>
                  <td className={`px-4 py-3 ${SM_TONE_CLASS[row.detectedByTone]}`}>{row.detectedBy}</td>
                  <td className={`px-4 py-3 ${SM_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Three of four failure modes are caught automatically and the dangerous one is not">
        A rename, a new value and an empty field are all detectable in a delivery. A change in what the field{" "}
        <em>means</em> upstream — billing market becoming delivery market after a billing migration — produces
        perfectly valid data and silently invalidates eight months of market comparison. That is the failure this
        section exists to make thinkable, and it is why the written meaning is a field rather than a comment.
      </Callout>
    </div>
  );
}

function FieldNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Field not found</p>
      <Link to="/schema" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to schema
      </Link>
    </div>
  );
}

/** SM04 (`customers-market`) — the section's only built `:field` reference row, same "one/two reference rows" pattern as every prior section. */
const FieldDetailRoute = () => {
  const { field } = useParams();

  if (field === "customers-market") return <CustomersMarketDetail />;
  return <FieldNotFound />;
};

export default FieldDetailRoute;
