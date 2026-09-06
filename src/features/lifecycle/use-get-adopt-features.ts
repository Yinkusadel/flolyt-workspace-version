import { useQuery } from "@tanstack/react-query";
import { getAdoptFeatures, type GetAdoptFeaturesResponse } from "@/services/api/lifecycle/get-adopt-features";

export const ADOPT_FEATURES_QUERY_KEY = ["lifecycle-adopt-features"];

export const useGetAdoptFeatures = () =>
  useQuery<GetAdoptFeaturesResponse, Error>({
    queryKey: ADOPT_FEATURES_QUERY_KEY,
    queryFn: getAdoptFeatures,
  });
