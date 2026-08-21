import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { acceptInvitationSchema, type AcceptInvitationSchemaType } from "@/validators/auth";
import {
  acceptInvitation,
  type AcceptInvitationResponse,
} from "@/services/api/auth/accept-invitation";

interface UseAcceptInvitationOptions {
  token: string;
}

const useAcceptInvitation = ({ token }: UseAcceptInvitationOptions) => {
  const navigate = useNavigate();

  const form = useForm<AcceptInvitationSchemaType>({
    resolver: zodResolver(acceptInvitationSchema),
    mode: "onChange",
    defaultValues: { firstName: "", lastName: "" },
  });

  const mutation = useMutation<AcceptInvitationResponse, Error, AcceptInvitationSchemaType>({
    mutationFn: (values) => acceptInvitation({ token, ...values }),
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Couldn't accept this invitation.");
        return;
      }

      // Accepting creates the account and membership but does not sign the
      // user in — route them to the same code flow as anyone else.
      toast.success("Welcome to the team — sign in to continue");
      navigate("/auth/sign-in", { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't accept this invitation.");
    },
  });

  const onSubmit = (values: AcceptInvitationSchemaType) => {
    mutation.mutate(values);
  };

  return {
    form,
    isPending: mutation.isPending,
    onSubmit,
  };
};

export default useAcceptInvitation;
