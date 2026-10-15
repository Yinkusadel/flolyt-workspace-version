import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  retireThreatLesson,
  type RetireThreatLessonPayload,
  type RetireThreatLessonResponse,
} from "@/services/api/rooms/retire-threat-lesson";

interface UseRetireThreatLessonOptions {
  onSuccess?: (data: string) => void;
}

const useRetireThreatLesson = (options?: UseRetireThreatLessonOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<RetireThreatLessonResponse, Error, RetireThreatLessonPayload>({
    mutationFn: retireThreatLesson,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to retire the lesson");
        return;
      }

      toast.success("Lesson retired");
      queryClient.invalidateQueries({ queryKey: ["threat-lessons"] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to retire the lesson");
    },
  });

  return {
    retireThreatLesson: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useRetireThreatLesson;
