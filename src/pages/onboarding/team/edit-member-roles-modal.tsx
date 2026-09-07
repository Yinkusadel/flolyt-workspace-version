import { useEffect } from "react";

import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StepUpConfirmModal } from "@/components/step-up-confirm-modal";
import useUpdateMemberRoles from "@/features/teams/use-update-member-roles";
import useStepUpConfirmation from "@/features/auth/use-step-up-confirmation";
import { USER_ROLES, type UserRole } from "@/validators/teams";
import type { TeamMemberDto } from "@/services/api/teams/get-team-by-id";

/**
 * Edit-roles form for one existing member, opened from a "Edit roles" row action on the
 * Members table — same step-up shape as InviteMemberModal: the first submit always goes out
 * with no challenge id, and if the backend asks for one, `onStepUpRequired` opens
 * `StepUpConfirmModal` on top of this one.
 */
export function EditMemberRolesModal({
  member,
  open,
  onOpenChange,
}: {
  member: TeamMemberDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { form, onSubmit, isPending } = useUpdateMemberRoles(member?.id ?? "", {
    onSuccess: () => onOpenChange(false),
    onStepUpRequired: () => stepUp.begin(),
  });

  const stepUp = useStepUpConfirmation({
    action: "change_administrators",
    onConfirmed: (challengeId) => {
      form.setValue("stepUpChallengeId", challengeId);
      form.handleSubmit(onSubmit)();
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = form;

  const selectedRoles = watch("roles");

  useEffect(() => {
    if (open && member) {
      reset({ roles: member.roles as UserRole[], stepUpChallengeId: null });
    }
  }, [open, member, reset]);

  const toggleRole = (role: UserRole) => {
    const next = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];
    setValue("roles", next, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader>
          <DialogTitle>Edit member roles</DialogTitle>
          <DialogDescription>
            {member ? `Change what ${member.userName} can do on this team.` : ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
            <div>
              <p className="text-[11px] text-ink-3">Role</p>
              <div className="mt-1.5 space-y-2">
                {USER_ROLES.map((role) => (
                  <label
                    key={role}
                    className="flex cursor-pointer items-center gap-2 rounded-panel border border-line bg-paper-2 px-3 py-2 text-[12px] text-ink"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                      disabled={isPending}
                      className="size-3.5 rounded border-line"
                    />
                    {role}
                  </label>
                ))}
              </div>
              {errors.roles && <p className="mt-1.5 text-[11px] text-destructive">{errors.roles.message}</p>}
            </div>
          </DialogBody>

          <DialogFooter>
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={!isValid || isPending || stepUp.isRequesting}>
                {isPending || stepUp.isRequesting ? "Saving..." : "Save roles"}
              </Button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="text-[12px] font-semibold text-ink-3 hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>

      <StepUpConfirmModal
        open={stepUp.isOpen}
        onOpenChange={stepUp.close}
        title="Confirm this change"
        description="Granting Administrator needs a fresh code. Check your email."
        isRequesting={stepUp.isRequesting}
        isVerifying={stepUp.isVerifying}
        onVerify={stepUp.verify}
        onResend={stepUp.resend}
      />
    </Dialog>
  );
}
