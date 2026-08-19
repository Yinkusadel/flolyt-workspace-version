import { useChainContext } from "@/pages/handoff/chain/chain-layout";
import ClosedChainRoute from "@/pages/handoff/chain/closed-chain-route";
import LiveChainRoute from "@/pages/handoff/chain/live-chain-route";

/** `/handoff/:id` — branches on the chain's own status, mirroring Rooms' status-branched `RoomHomeRoute`. */
export default function ChainHomeRoute() {
  const { chain } = useChainContext();
  if (chain.status === "closed") return <ClosedChainRoute />;
  return <LiveChainRoute />;
}
