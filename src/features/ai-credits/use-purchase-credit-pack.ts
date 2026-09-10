import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  purchaseCreditPack,
  type PurchaseCreditPackPayload,
  type PurchaseCreditPackResponse,
} from "@/services/api/ai-credits/purchase-credit-pack";

export const usePurchaseCreditPack = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<PurchaseCreditPackResponse, Error, PurchaseCreditPackPayload>({
    mutationFn: purchaseCreditPack,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to purchase credit pack");
        return;
      }

      toast.success("Credit pack purchased");
      queryClient.invalidateQueries({ queryKey: ["credit-balance"] });
      queryClient.invalidateQueries({ queryKey: ["credit-packs"] });
      queryClient.invalidateQueries({ queryKey: ["credit-overview"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to purchase credit pack");
    },
  });

  return {
    purchasePack: mutation.mutate,
    purchasePackAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
