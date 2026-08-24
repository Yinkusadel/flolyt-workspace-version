import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { MarketplaceKvList } from "@/pages/agents/marketplace/kv-list";
import { InstallModal } from "@/pages/agents/marketplace/modals/install-modal";
import { MARKETPLACE_LISTING_TITLES, MK04_HERO, MK04_KV, MK04_ROWS } from "@/pages/agents/marketplace/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function PaymentRetryTimingListing() {
  const [installOpen, setInstallOpen] = useState(false);

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Marketplace", to: "/marketplace" }, { label: MARKETPLACE_LISTING_TITLES["retry-timing"] }]}
        title={MARKETPLACE_LISTING_TITLES["retry-timing"]}
        subtitle="Six verified fields, one weak number, and no result from any of the 61 companies"
        action={
          <Button type="button" onClick={() => setInstallOpen(true)}>
            Install it
          </Button>
        }
      />

      <div className="relative overflow-hidden rounded-card border border-ultra-border bg-ultra-bg p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{MK04_HERO.leftLabel}</p>
            <p className="mt-2 text-[26px] font-semibold text-ink">{MK04_HERO.leftBig}</p>
            <p className="mt-1.5 max-w-md text-[11px] text-ink-3">{MK04_HERO.sub}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{MK04_HERO.rightLabel}</p>
            <p className="mt-2 text-[20px] font-semibold text-ink">{MK04_HERO.rightBig}</p>
            <p className="mt-1.5 font-mono text-[10px] font-semibold text-ultra">{MK04_HERO.rightSub}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the listing says</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Field</th>
                <th className={HEAD_CLASS}>What it says</th>
                <th className={`${HEAD_CLASS} text-right`}>Verified?</th>
              </tr>
            </thead>
            <tbody>
              {MK04_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.field}</td>
                  <td className="px-4 py-3 text-ink-3">{row.says}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.verified === "yes" ? "teal" : "neutral"}>{row.verified}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Sixty-one companies is the only number on this page and it is deliberately weak evidence">
        It means sixty-one workspaces installed it and did not uninstall it. It does not mean it worked, that it
        paid for itself, or that it will do anything here. It is the strongest honest signal available in a system
        where results cannot travel, and putting a bigger number next to it would require inventing one.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What would happen if you installed it here</p>
        <MarketplaceKvList rows={MK04_KV} />
      </section>

      <p className="text-[11px] text-ink-4">
        <Link to="/marketplace/what-arrives" className="font-semibold text-ultra hover:underline">
          See exactly what it would read
        </Link>
      </p>

      <InstallModal open={installOpen} onOpenChange={setInstallOpen} />
    </div>
  );
}

function ListingNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Listing not found</p>
      <Link to="/marketplace" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to Marketplace
      </Link>
    </div>
  );
}

/** MK04 (`retry-timing`) — the section's only built listing detail reference. */
const ListingDetailRoute = () => {
  const { id } = useParams();

  if (id === "retry-timing") return <PaymentRetryTimingListing />;
  return <ListingNotFound />;
};

export default ListingDetailRoute;
