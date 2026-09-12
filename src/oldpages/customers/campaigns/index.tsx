import { CAMPAIGNS_STATE } from "@/oldpages/customers/campaigns/data";
import { FirstCampaignState } from "@/oldpages/customers/campaigns/states/first-campaign";
import { NothingHasBeenSentState } from "@/oldpages/customers/campaigns/states/nothing-has-been-sent";
import { RunningNowState } from "@/oldpages/customers/campaigns/states/running-now";

/**
 * CP01/02/03 — all share /campaigns, branching on CAMPAIGNS_STATE
 * (nothing/first/full). CP01/CP02 are wired but unreachable with the
 * default "full" state, same "not wired, no demo state currently
 * triggers it" situation as every prior rebuild's empty/edge states.
 */
const Campaigns = () => {
  if (CAMPAIGNS_STATE === "nothing") return <NothingHasBeenSentState />;
  if (CAMPAIGNS_STATE === "first") return <FirstCampaignState />;
  return <RunningNowState />;
};

export default Campaigns;
