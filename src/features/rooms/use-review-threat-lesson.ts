import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  reviewThreatLesson,
  type ReviewThreatLessonPayload,
  type ReviewThreatLessonResponse,
} from "@/services/api/rooms/review-threat-lesson";

interface UseReviewThreatLessonOptions {
  onSuccess?: (data: unknown) => void;
}

const useReviewThreatLesson = (options?: UseReviewThreatLessonOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ReviewThreatLessonResponse, Error, ReviewThreatLessonPayload>({
    mutationFn: reviewThreatLesson,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to review the lesson");
        return;
      }

      toast.success("Lesson reviewed");
      queryClient.invalidateQueries({ queryKey: ["threat-lessons"] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to review the lesson");
    },
  });

  return {
    reviewThreatLesson: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useReviewThreatLesson;
