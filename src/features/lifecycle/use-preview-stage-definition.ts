import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import {
  previewStageDefinition,
  type PreviewStageDefinitionData,
  type PreviewStageDefinitionPayload,
  type PreviewStageDefinitionResponse,
} from "@/services/api/lifecycle/preview-stage-definition";

interface UsePreviewStageDefinitionOptions {
  onSuccess?: (preview: PreviewStageDefinitionData) => void;
}

const usePreviewStageDefinition = (options?: UsePreviewStageDefinitionOptions) => {
  const mutation = useMutation<PreviewStageDefinitionResponse, Error, PreviewStageDefinitionPayload>({
    mutationFn: previewStageDefinition,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to preview the stage definition");
        return;
      }

      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to preview the stage definition");
    },
  });

  return {
    preview: mutation.mutate,
    previewData: mutation.data?.data,
    isPending: mutation.isPending,
  };
};

export default usePreviewStageDefinition;
