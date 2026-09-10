import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { acceptAiProposal } from "@/services/api/ai-proposals/accept-ai-proposal";
import { deferAiProposal } from "@/services/api/ai-proposals/defer-ai-proposal";
import { rejectAiProposal } from "@/services/api/ai-proposals/reject-ai-proposal";
// One card, one person, one decision — three separate mutations rather than a single "decide"
// endpoint because the server itself exposes them as distinct actions (defer requires `because`,
// accept optionally takes edited arguments, reject takes neither).
//
// Invalidates every "ai-proposals" query regardless of its params (conversation-scoped in the
// chat, unscoped in the Inbox) rather than trying to target one exact param shape — a decided
// proposal should disappear from every list showing it, not just the one it was decided from.
export const useDecideAiProposal = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["ai-proposals"] });

  const accept = useMutation({
    mutationFn: acceptAiProposal,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to accept the proposal");
        return;
      }
      toast.success("Proposal accepted");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Failed to accept the proposal"),
  });

  const defer = useMutation({
    mutationFn: deferAiProposal,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to defer the proposal");
        return;
      }
      toast.success("Proposal deferred");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Failed to defer the proposal"),
  });

  const reject = useMutation({
    mutationFn: rejectAiProposal,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to reject the proposal");
        return;
      }
      toast.success("Proposal rejected");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Failed to reject the proposal"),
  });

  return {
    accept: accept.mutate,
    isAccepting: accept.isPending,
    defer: defer.mutate,
    isDeferring: defer.isPending,
    reject: reject.mutate,
    isRejecting: reject.isPending,
  };
};
