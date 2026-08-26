import { useQuery } from "@tanstack/react-query";
import {
  getSlugAvailable,
  type GetSlugAvailableResponse,
  type SlugAvailabilityDto,
} from "@/services/api/workspace/get-slug-available";

const SLUG_AVAILABLE_QUERY_KEY = ["workspace-slug-available"];

// Advisory only — the unique index behind PUT /identity is the real arbiter, so a
// caller still needs to handle a 400 from that call even after this says available.
const useSlugAvailable = (slug: string) => {
  const query = useQuery<GetSlugAvailableResponse, Error>({
    queryKey: [...SLUG_AVAILABLE_QUERY_KEY, slug],
    queryFn: () => getSlugAvailable(slug),
    enabled: slug.length >= 3,
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    availability: query.data?.data ?? (null as SlugAvailabilityDto | null),
  };
};

export default useSlugAvailable;
