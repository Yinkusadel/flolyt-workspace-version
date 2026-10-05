import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLeakageCaseDecision } from "@/services/api/leakage/add-leakage-case-decision";

export const useAddLeakageCaseDecision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addLeakageCaseDecision,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to record this decision");
        return;
      }
      toast.success("Decision recorded");
      queryClient.invalidateQueries({ queryKey: ["leakage-case", data.data.id] });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to record this decision"),
  });
};
