import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { learnWhyLeakageCell } from "@/services/api/leakage/learn-why-leakage-cell";

export const useLearnWhyLeakageCell = () =>
  useMutation({
    mutationFn: learnWhyLeakageCell,
    onError: (error: Error) => toast.error(error.message || "Failed to ask why this cell is leaking"),
  });
