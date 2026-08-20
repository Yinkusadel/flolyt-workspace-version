import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  resendUserOtp,
  type ResendOtpRequest,
  type ResendOtpResponse,
} from "@/services/api/auth/resend-otp";

const useResendOtp = () => {
  const mutation = useMutation<ResendOtpResponse, Error, ResendOtpRequest>({
    mutationFn: resendUserOtp,
    onSuccess: () => {
      toast.success("A new code is on its way.");
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't resend the code. Please try again.");
    },
  });

  // Expose an async version you can await
  const resendOtpAsync = (payload: ResendOtpRequest) => mutation.mutateAsync(payload);

  return {
    resendOtpAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    mutation,
  };
};

export default useResendOtp;
