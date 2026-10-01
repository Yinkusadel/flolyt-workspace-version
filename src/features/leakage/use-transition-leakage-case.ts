import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transitionLeakageCase } from "@/services/api/leakage/transition-leakage-case";

export const useTransitionLeakageCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transitionLeakageCase,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to advance this case");
        return;
      }
      toast.success(`Case moved to ${data.data.status}`);
      queryClient.invalidateQueries({ queryKey: ["leakage-case", data.data.id] });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to advance this case"),
  });
};
