import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeakageCondition } from "@/services/api/leakage/update-leakage-condition";

// Bringing a hidden column back (setting Applies again) and taking one off the map both invalidate
// the same two caches — the conditions list this screen edits, and the leakage page itself, since
// a condition's applicability decides whether the page even shows that column.
export const useUpdateLeakageCondition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLeakageCondition,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to update the condition");
        return;
      }
      toast.success("Condition updated");
      queryClient.invalidateQueries({ queryKey: ["leakage-conditions"] });
      queryClient.invalidateQueries({ queryKey: ["leakage"] });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to update the condition"),
  });
};
