import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { confirmRegistrationSchema, type ConfirmRegistrationSchemaType } from "@/validators/auth";
import {
  confirmRegistration,
  type ConfirmRegistrationResponse,
} from "@/services/api/auth/confirm-registration";

interface UseConfirmRegistrationOptions {
  userId: string;
  email?: string;
}

const useConfirmRegistration = ({ userId, email }: UseConfirmRegistrationOptions) => {
  const navigate = useNavigate();

  const form = useForm<ConfirmRegistrationSchemaType>({
    resolver: zodResolver(confirmRegistrationSchema),
    // Not "onChange" — InputOTP fires an onChange on mount to sync its initial
    // value, which would validate (and show red) before the user has typed anything.
    mode: "onTouched",
    defaultValues: { otp: "" },
  });

  const mutation = useMutation<ConfirmRegistrationResponse, Error, { otp: string }>({
    mutationFn: ({ otp }) => confirmRegistration({ userId, otp }),
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "That code is not valid. Request a new one and try again.");
        return;
      }

      toast.success("Email confirmed — sign in to continue");
      const query = email ? `?email=${encodeURIComponent(email)}` : "";
      navigate(`/auth/sign-in${query}`, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || "That code is not valid. Request a new one and try again.");
    },
  });

  const onSubmit = (values: ConfirmRegistrationSchemaType) => {
    mutation.mutate(values);
  };

  return {
    form,
    isPending: mutation.isPending,
    onSubmit,
  };
};

export default useConfirmRegistration;
