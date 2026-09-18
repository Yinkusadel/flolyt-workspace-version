import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createInboxThread,
  type CreateInboxThreadPayload,
  type CreateInboxThreadResponse,
} from "@/services/api/inbox/create-inbox-thread";

interface UseCreateInboxThreadOptions {
  onSuccess?: (threadId: string) => void;
}

const useCreateInboxThread = (options?: UseCreateInboxThreadOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateInboxThreadResponse, Error, CreateInboxThreadPayload>({
    mutationFn: createInboxThread,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to start the conversation");
        return;
      }

      if (!variables.asDraft) {
        toast.success("Message sent");
      }
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to start the conversation");
    },
  });

  return {
    createInboxThread: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCreateInboxThread;
