import { useQuery } from "@tanstack/react-query";
import {
  getExpandUpgradePaths,
  type GetExpandUpgradePathsResponse,
} from "@/services/api/lifecycle/get-expand-upgrade-paths";

export const EXPAND_UPGRADE_PATHS_QUERY_KEY = ["lifecycle-expand-upgrade-paths"];

export const useGetExpandUpgradePaths = () =>
  useQuery<GetExpandUpgradePathsResponse, Error>({
    queryKey: EXPAND_UPGRADE_PATHS_QUERY_KEY,
    queryFn: getExpandUpgradePaths,
  });
