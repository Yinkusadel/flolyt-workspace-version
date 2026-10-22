import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  judgeDissent,
  type JudgeDissentPayload,
  type JudgeDissentResponse,
} from "@/services/api/rooms/judge-dissent";

interface UseJudgeDissentOptions {
  onSuccess?: () => void;
}

const useJudgeDissent = (options?: UseJudgeDissentOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<JudgeDissentResponse, Error, JudgeDissentPayload>({
    mutationFn: judgeDissent,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to judge the objection");
        return;
      }

      toast.success("Objection judged");
      queryClient.invalidateQueries({ queryKey: ["room-decision"] });
      queryClient.invalidateQueries({ queryKey: ["room-dissent-all"] });
      queryClient.invalidateQueries({ queryKey: ["room-cited-dissent"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to judge the objection");
    },
  });

  return {
    judgeDissent: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useJudgeDissent;
