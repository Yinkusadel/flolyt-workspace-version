import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { topupWallet, type TopupWalletPayload } from "@/services/api/wallet/topup-wallet";

export const useTopupWallet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: TopupWalletPayload) => topupWallet(payload),
    onSuccess: (data) => {
      // Real-money top-up — the backend hands back a payment-gateway URL to finish on, there's
      // nothing left to show in-app until the user comes back from it.
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      toast.success(data.responseMessage || "Top-up successful");
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to top up wallet");
    },
  });

  return {
    topup: mutation.mutate,
    isPending: mutation.isPending,
  };
};
