import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getSlugAvailable,
  type GetSlugAvailableResponse,
  type SlugAvailabilityDto,
} from "@/services/api/workspace/get-slug-available";

const SLUG_AVAILABLE_QUERY_KEY = ["workspace-slug-available"];
const DEBOUNCE_MS = 400;

// Advisory only — the unique index behind PUT /identity is the real arbiter, so a
// caller still needs to handle a 400 from that call even after this says available.
const useSlugAvailable = (slug: string) => {
  // Debounced internally so every caller gets this for free — without it, a call fires
  // on every keystroke (confirmed live: typing "bankaigdgdhdshdh" fired 14 separate
  // requests, one per character).
  const [debouncedSlug, setDebouncedSlug] = useState(slug);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSlug(slug), DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [slug]);

  const query = useQuery<GetSlugAvailableResponse, Error>({
    queryKey: [...SLUG_AVAILABLE_QUERY_KEY, debouncedSlug],
    queryFn: () => getSlugAvailable(debouncedSlug),
    enabled: debouncedSlug.length >= 3,
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    availability: query.data?.data ?? (null as SlugAvailabilityDto | null),
  };
};

export default useSlugAvailable;
