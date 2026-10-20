import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  previewRelationship,
  type PreviewRelationshipPayload,
  type PreviewRelationshipResponse,
} from "@/services/api/datasource-relationships/preview-relationship";
import type { RelationshipApiError } from "@/services/api/datasource-relationships/relationship-error";
import type { RelationshipPreview } from "@/services/api/datasource-relationships/types";

interface PreviewRelationshipVariables {
  id: string;
  payload: PreviewRelationshipPayload;
}

interface UsePreviewRelationshipOptions {
  onSuccess?: (preview: RelationshipPreview) => void;
}

// A preview is read-only and creates no cached resource to invalidate. The receipt it returns
// lasts 15 minutes and is bound to the mapping revision, so callers hold it in component state.
const usePreviewRelationship = (options?: UsePreviewRelationshipOptions) => {
  const mutation = useMutation<
    PreviewRelationshipResponse,
    RelationshipApiError,
    PreviewRelationshipVariables
  >({
    mutationFn: ({ id, payload }) => previewRelationship(id, payload),
    onSuccess: (data) => {
      if (data.succeeded) {
        options?.onSuccess?.(data.data);
        return;
      }

      toast.error(data.messages?.[0] || "Failed to preview relationship");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to preview relationship");
    },
  });

  return {
    previewRelationship: mutation.mutate,
    previewRelationshipAsync: mutation.mutateAsync,
    preview: mutation.data?.data ?? null,
    isPending: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default usePreviewRelationship;
