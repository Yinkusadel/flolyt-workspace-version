import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { learnWhyLeakageCellV2 } from "@/services/api/leakage/learn-why-leakage-cell-v2";

export const useLearnWhyLeakageCellV2 = () =>
  useMutation({
    mutationFn: learnWhyLeakageCellV2,
    onError: (error: Error) => toast.error(error.message || "Failed to ask why this cell is leaking"),
  });
