import { useMutation } from "@tanstack/react-query";
import {
  resendUserOtp,
  type ResendOtpRequest,
  type ResendOtpResponse,
} from "@/services/api/auth/resend-otp";

const useResendOtp = () => {
  const mutation = useMutation<ResendOtpResponse, Error, ResendOtpRequest>({
    mutationFn: resendUserOtp,
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
