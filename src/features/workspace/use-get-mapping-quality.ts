import { useQuery } from "@tanstack/react-query";
import {
  getMappingQuality,
  type GetMappingQualityResponse,
  type MappingQualityDto,
} from "@/services/api/workspace/get-mapping-quality";

export const MAPPING_QUALITY_QUERY_KEY = ["workspace-mapping-quality"];

// Only .state === "clean" is good news — an empty .flags array alone does not mean
// "all good", check .state first (nothing_connected / awaiting_analysis / clean / flagged).
const useGetMappingQuality = () => {
  const query = useQuery<GetMappingQualityResponse, Error>({
    queryKey: MAPPING_QUALITY_QUERY_KEY,
    queryFn: getMappingQuality,
  });

  return {
    ...query,
    mappingQuality: query.data?.data ?? (null as MappingQualityDto | null),
  };
};

export default useGetMappingQuality;
