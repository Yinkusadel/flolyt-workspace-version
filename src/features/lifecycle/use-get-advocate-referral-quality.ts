import { useQuery } from "@tanstack/react-query";
import {
  getAdvocateReferralQuality,
  type GetAdvocateReferralQualityResponse,
} from "@/services/api/lifecycle/get-advocate-referral-quality";

export const ADVOCATE_REFERRAL_QUALITY_QUERY_KEY = ["lifecycle-advocate-referral-quality"];

export const useGetAdvocateReferralQuality = () =>
  useQuery<GetAdvocateReferralQualityResponse, Error>({
    queryKey: ADVOCATE_REFERRAL_QUALITY_QUERY_KEY,
    queryFn: getAdvocateReferralQuality,
  });
