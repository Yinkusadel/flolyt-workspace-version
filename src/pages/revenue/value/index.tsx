import { useSearchParams } from "react-router-dom";

import { VALUE_STATE } from "@/pages/revenue/value/data";
import { ByMarketState } from "@/pages/revenue/value/states/by-market";
import { ByRoomState } from "@/pages/revenue/value/states/by-room";
import { MyRoomsState } from "@/pages/revenue/value/states/my-rooms";
import { NothingRecoveredYetState } from "@/pages/revenue/value/states/nothing-recovered-yet";
import { TheFirstRecoveryState } from "@/pages/revenue/value/states/the-first-recovery";
import { TheLedgerState } from "@/pages/revenue/value/states/the-ledger";

/**
 * VL01/02/03/04/05/13 — all share /value, branching on query params first
 * (`by`, `as`), then on VALUE_STATE. VL01/VL02 are wired but unreachable with
 * the default "full" state, same "not wired, no demo state currently
 * triggers it" situation as every prior rebuild's empty/edge states.
 */
const Value = () => {
  const [searchParams] = useSearchParams();
  const by = searchParams.get("by");
  const as = searchParams.get("as");

  if (by === "market") return <ByMarketState />;
  if (by === "room") return <ByRoomState />;
  if (as === "owner") return <MyRoomsState />;

  if (VALUE_STATE === "empty") return <NothingRecoveredYetState />;
  if (VALUE_STATE === "first") return <TheFirstRecoveryState />;
  return <TheLedgerState />;
};

export default Value;
