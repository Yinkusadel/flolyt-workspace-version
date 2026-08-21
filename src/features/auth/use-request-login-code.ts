import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { requestLoginCodeSchema, type RequestLoginCodeSchemaType } from "@/validators/auth";
import {
  requestLoginCode,
  type RequestLoginCodePayload,
  type RequestLoginCodeResponse,
} from "@/services/api/auth/request-login-code";

interface UseRequestLoginCodeOptions {
  onRequested: (email: string, challengeId: string) => void;
  defaultEmail?: string;
}

const useRequestLoginCode = ({ onRequested, defaultEmail = "" }: UseRequestLoginCodeOptions) => {
  const form = useForm<RequestLoginCodeSchemaType>({
    resolver: zodResolver(requestLoginCodeSchema),
    mode: "onChange",
    defaultValues: { email: defaultEmail },
  });

  const mutation = useMutation<RequestLoginCodeResponse, Error, RequestLoginCodePayload>({
    mutationFn: requestLoginCode,
    onSuccess: (data, variables) => {
      // Always 200 — a real account, a disabled one, or an address never seen
      // all look identical here. Never branch this into "no account found".
      onRequested(variables.email, data.data.challengeId);
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't send the code. Please try again.");
    },
  });

  const onSubmit = (values: RequestLoginCodeSchemaType) => {
    mutation.mutate(values);
  };

  return {
    form,
    isPending: mutation.isPending,
    error: mutation.error,
    onSubmit,
    requestCode: (email: string) => mutation.mutate({ email }),
  };
};

export default useRequestLoginCode;
