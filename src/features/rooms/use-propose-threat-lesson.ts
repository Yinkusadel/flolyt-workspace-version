import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  proposeThreatLesson,
  type ProposeThreatLessonPayload,
  type ProposeThreatLessonResponse,
} from "@/services/api/rooms/propose-threat-lesson";

interface UseProposeThreatLessonOptions {
  onSuccess?: (data: string) => void;
}

const useProposeThreatLesson = (options?: UseProposeThreatLessonOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ProposeThreatLessonResponse, Error, ProposeThreatLessonPayload>({
    mutationFn: proposeThreatLesson,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to propose the lesson");
        return;
      }

      toast.success("Lesson proposed");
      queryClient.invalidateQueries({ queryKey: ["threat-lessons"] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to propose the lesson");
    },
  });

  return {
    proposeThreatLesson: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useProposeThreatLesson;
