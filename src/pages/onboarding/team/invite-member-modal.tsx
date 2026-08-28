import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useInviteTeamMember from "@/features/teams/use-invite-team-member";
import { USER_ROLES, type UserRole } from "@/validators/teams";

/** Invite-member form, opened from a team page's "Invite member" button — same shape as CreateTeamModal. */
export function InviteMemberModal({
  teamId,
  open,
  onOpenChange,
}: {
  teamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { form, onSubmit, isPending } = useInviteTeamMember(teamId, {
    onSuccess: () => onOpenChange(false),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = form;

  const selectedRoles = watch("roles");

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
          <DialogTitle>Invite a team member</DialogTitle>
          <DialogDescription>They'll get an email invite with the role you pick below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
            <div>
              <label htmlFor="invite-email" className="text-[11px] text-ink-3">
                Email
              </label>
              <Input
                id="invite-email"
                type="email"
                placeholder="name@company.com"
                aria-invalid={!!errors.email}
                disabled={isPending}
                className="mt-1.5"
                {...register("email")}
              />
              {errors.email && <p className="mt-1.5 text-[11px] text-destructive">{errors.email.message}</p>}
            </div>

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
              <Button type="submit" disabled={!isValid || isPending}>
                {isPending ? "Sending..." : "Send invite"}
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
    </Dialog>
  );
}
