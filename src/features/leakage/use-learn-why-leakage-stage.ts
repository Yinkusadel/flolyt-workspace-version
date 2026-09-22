import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { learnWhyLeakageStage } from "@/services/api/leakage/learn-why-leakage-stage";

export const useLearnWhyLeakageStage = () =>
  useMutation({
    mutationFn: learnWhyLeakageStage,
    onError: (error: Error) => toast.error(error.message || "Failed to ask why this stage is leaking"),
  });
