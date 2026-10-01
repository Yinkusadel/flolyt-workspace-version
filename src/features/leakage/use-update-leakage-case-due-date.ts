import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeakageCaseDueDate } from "@/services/api/leakage/update-leakage-case-due-date";

export const useUpdateLeakageCaseDueDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLeakageCaseDueDate,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to set a new due date");
        return;
      }
      toast.success("Due date updated");
      queryClient.invalidateQueries({ queryKey: ["leakage-case", data.data.id] });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to set a new due date"),
  });
};
