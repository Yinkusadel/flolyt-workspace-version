import { useQuery } from "@tanstack/react-query";
import {
  getSupportContactDrivers,
  type GetSupportContactDriversResponse,
} from "@/services/api/lifecycle/get-support-contact-drivers";

export const SUPPORT_CONTACT_DRIVERS_QUERY_KEY = ["lifecycle-support-contact-drivers"];

export const useGetSupportContactDrivers = () =>
  useQuery<GetSupportContactDriversResponse, Error>({
    queryKey: SUPPORT_CONTACT_DRIVERS_QUERY_KEY,
    queryFn: getSupportContactDrivers,
  });
