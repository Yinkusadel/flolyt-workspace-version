import { Link, Outlet, useOutletContext, useParams } from "react-router-dom";

import { CHAIN_DETAILS } from "@/pages/everyday/handoff/data";
import type { ChainDetail } from "@/pages/everyday/handoff/types";

export type ChainOutletContext = { chain: ChainDetail };

/** Resolves `:id` to a `ChainDetail` — mirrors Rooms' `RoomLayout`. Only "delivery-fee" and "card-retry" exist in CHAIN_DETAILS; every other chain in the index falls back to this not-found state. */
const ChainLayout = () => {
  const { id } = useParams();
  const chain = id ? CHAIN_DETAILS[id] : undefined;

  if (!chain) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Chain not found</p>
        <p className="mt-1.5 text-[11.5px] text-ink-3">
          It may not have a built page yet, or the link is out of date.
        </p>
        <Link to="/handoff" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
          Back to Handoffs
        </Link>
      </div>
    );
  }

  return <Outlet context={{ chain } satisfies ChainOutletContext} />;
};

export default ChainLayout;

export function useChainContext() {
  return useOutletContext<ChainOutletContext>();
}
