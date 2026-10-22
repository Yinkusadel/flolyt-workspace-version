import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeakageCaseOwner } from "@/services/api/leakage/update-leakage-case-owner";

export const useUpdateLeakageCaseOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLeakageCaseOwner,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to reassign this case");
        return;
      }
      toast.success("Case owner updated");
      queryClient.invalidateQueries({ queryKey: ["leakage-case", data.data.id] });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to reassign this case"),
  });
};
