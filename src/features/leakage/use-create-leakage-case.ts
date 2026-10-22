import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLeakageCase } from "@/services/api/leakage/create-leakage-case";

export const useCreateLeakageCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLeakageCase,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to create a case for this cell");
        return;
      }
      toast.success("Case created");
      queryClient.invalidateQueries({ queryKey: ["leakage-case", data.data.id] });
      queryClient.invalidateQueries({ queryKey: ["leakage-cell-v2"] });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to create a case for this cell"),
  });
};
