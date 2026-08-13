import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signUpSchema, type SignUpSchemaType } from "@/validators/auth";
import {
  registerUser,
  type RegisterUserPayload,
  type RegisterResponse,
} from "@/services/api/auth/sign-up";
import { getUserByEmail } from "@/services/api/auth/get-user-by-email";
import useResendOtp from "./use-resend-otp";


interface UseSignUpOptions {
  onUserExists?: (email: string) => void;
}

const useSignUp = (options?: UseSignUpOptions) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { resendOtpAsync } = useResendOtp();

  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const registerMutation = useMutation<RegisterResponse, Error, RegisterUserPayload>({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      if (data.succeeded) {
        setUserId(data.data);
        toast.success("Please enter OTP to continue");
        // navigate(`/auth/verify-otp/${data.data}`);
        const email = form.getValues("email");

        navigate(`/auth/verify-otp/${data.data}?email=${encodeURIComponent(email)}`);

        return;
      }

      toast.error(data.messages?.[0] || "Registration failed");
    },

    onError: async (error: any) => {
      const msg = error.message || "Registration failed";

      // Handle "already exists" here (HTTP 400/409)
      if (msg.toLowerCase().includes("already exists")) {
        const email = form.getValues("email");
        options?.onUserExists?.(email);

        try {
          const userResponse = await getUserByEmail(email);
          const user = userResponse.data;

          if (user.status !== "Confirmed") {
            // Resend OTP
            await resendOtpAsync({ email: user.email });
            toast.success("OTP has been resent. Please complete registration.");
            navigate(`/auth/verify-otp/${user.id}`, { replace: true });
          } else {
            toast.error("This email is already registered. Please log in.");
            navigate("/auth/sign-in");
          }
        } catch (err: any) {
          toast.error(err.message || "Failed to check existing user.");
        }

        return; // Important: stop here
      }

      // Other errors
      toast.error(msg);
    },
  });

  const onSubmit = (values: SignUpSchemaType) => {
    registerMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    });
  };

  return {
    form,
    onSubmit,
    isPending: registerMutation.isPending,
    userId,
  };
};

export default useSignUp;
