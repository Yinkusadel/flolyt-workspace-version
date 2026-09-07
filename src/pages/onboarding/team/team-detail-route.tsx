import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoreVertical, UserPlus } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StepUpConfirmModal } from "@/components/step-up-confirm-modal";
import { Chip, type ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import { WizardStepper } from "@/pages/onboarding/wizard-stepper";
import { InviteMemberModal } from "@/pages/onboarding/team/invite-member-modal";
import { EditMemberRolesModal } from "@/pages/onboarding/team/edit-member-roles-modal";
import { ConfirmModal } from "@/pages/onboarding/team/confirm-modal";
import useGetTeamById from "@/features/teams/use-get-team-by-id";
import useResendTeamInvitation from "@/features/teams/use-resend-team-invitation";
import useRevokeTeamInvitation from "@/features/teams/use-revoke-team-invitation";
import useRemoveTeamMember from "@/features/teams/use-remove-team-member";
import useStepUpConfirmation from "@/features/auth/use-step-up-confirmation";
import type { TeamInvitationDto, TeamMemberDto } from "@/services/api/teams/get-team-by-id";
import type { UserRole } from "@/validators/teams";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const STATUS_TONE: Record<string, ChipTone> = {
  pending: "amber",
  accepted: "teal",
  expired: "neutral",
  revoked: "rose",
};

function StatusChip({ status }: { status: string }) {
  return <Chip tone={STATUS_TONE[status.toLowerCase()] ?? "neutral"}>{status}</Chip>;
}

/**
 * Onboarding step 5's team page — /onboarding/team/:teamId. Reached from the "Invite team
 * member" button on a team card at /onboarding/team. Lists real members and pending/accepted
 * invitations off GET /teams/{teamId} (returns both in one call — no separate paginated
 * invitations query needed), with its own "Invite member" button opening the same-shaped modal
 * as the create-team one. Each member row has a dropdown with "Update role" (opens
 * `EditMemberRolesModal`) and "Remove member" (opens `ConfirmModal`) — both, like inviting an
 * Administrator, are conditionally step-up gated. Resend/Revoke only render for a "pending"
 * invitation — an already accepted/expired/revoked one has nothing left to do from here. Revoke
 * opens `ConfirmModal` rather than firing immediately on click. "Back to teams" sits at the bottom, styled like
 * every other onboarding step's Continue button (the canonical CTA class — see
 * docs/onboarding/build-plan.md's "Cross-cutting: primary CTA button convention") rather than
 * a small top-of-page link, per the user's direct request.
 */
export default function OnboardingTeamDetailRoute() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<TeamMemberDto | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<TeamMemberDto | null>(null);
  const [invitationToRevoke, setInvitationToRevoke] = useState<TeamInvitationDto | null>(null);

  const { team, isLoading } = useGetTeamById(teamId ?? "");
  const {
    resendInvitation,
    isPending: isResending,
    variables: resendVariables,
  } = useResendTeamInvitation(teamId ?? "");
  const {
    revokeInvitation,
    isPending: isRevoking,
    variables: revokeVariables,
  } = useRevokeTeamInvitation({ onSuccess: () => setInvitationToRevoke(null) });
  const { removeMember, isPending: isRemoving } = useRemoveTeamMember({
    onSuccess: () => setMemberToRemove(null),
    onStepUpRequired: () => removeStepUp.begin(),
  });

  const removeStepUp = useStepUpConfirmation({
    action: "change_administrators",
    onConfirmed: (challengeId) => {
      if (memberToRemove) removeMember({ memberId: memberToRemove.id, stepUpChallengeId: challengeId });
    },
  });

  const handleResend = (invitation: TeamInvitationDto) => {
    resendInvitation({
      email: invitation.email,
      roles: invitation.roles as UserRole[],
      functionalRoles: null,
      stepUpChallengeId: null,
    });
  };

  return (
    <div className="flex flex-col md:h-[calc(100dvh-62px)] md:overflow-hidden">
      <div className="shrink-0">
        <WizardStepper activeStep={5} />
      </div>

      <div className="mx-auto w-full max-w-4xl flex-1 px-6 pb-10 md:min-h-0 md:overflow-y-auto">
        {isLoading || !team ? (
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-2.5 h-3 w-80" />
          </div>
        ) : (
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-[22px] font-semibold text-ink">{team.name}</h1>
              <p className="mt-2 max-w-2xl text-[12.5px] text-ink-3">
                {team.description || "No description yet"}
              </p>
            </div>

            <Button type="button" onClick={() => setShowInviteModal(true)} className="gap-1.5">
              <UserPlus className="size-3.5" />
              Invite member
            </Button>
          </div>
        )}

        <div className="mt-8 space-y-8">
          <section>
            <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Members</p>
            <div className="mt-3 overflow-x-auto rounded-card border border-line bg-paper">
              {isLoading || !team ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : team.members.length === 0 ? (
                <p className="p-4 text-[12px] text-ink-3">No members yet.</p>
              ) : (
                <table className="w-full min-w-[680px] text-left text-[11.5px]">
                  <thead>
                    <tr className="border-b border-line bg-paper-2">
                      <th className={HEAD_CLASS}>Name</th>
                      <th className={HEAD_CLASS}>Email</th>
                      <th className={HEAD_CLASS}>Role</th>
                      <th className={HEAD_CLASS}>Joined</th>
                      <th className={HEAD_CLASS}>Status</th>
                      <th className={HEAD_CLASS}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.members.map((member: TeamMemberDto) => (
                      <tr key={member.id} className="border-b border-line last:border-0">
                        <td className="px-4 py-3 font-semibold text-ink">{member.userName}</td>
                        <td className="px-4 py-3 text-ink-3">{member.userEmail}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {member.roles.map((role) => (
                              <Chip key={role} tone="ultra">
                                {role}
                              </Chip>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-ink-3">{formatDate(member.dateAdded)}</td>
                        <td className="px-4 py-3">
                          <Chip tone={member.isActive ? "teal" : "neutral"}>
                            {member.isActive ? "Active" : "Inactive"}
                          </Chip>
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                              aria-label="Member actions"
                            >
                              <MoreVertical className="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onSelect={() => setMemberToEdit(member)}>
                                Update role
                              </DropdownMenuItem>
                              <DropdownMenuItem variant="destructive" onSelect={() => setMemberToRemove(member)}>
                                Remove member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section>
            <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Invitations</p>
            <div className="mt-3 overflow-x-auto rounded-card border border-line bg-paper">
              {isLoading || !team ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : team.invitations.length === 0 ? (
                <p className="p-4 text-[12px] text-ink-3">No invitations yet.</p>
              ) : (
                <table className="w-full min-w-[680px] text-left text-[11.5px]">
                  <thead>
                    <tr className="border-b border-line bg-paper-2">
                      <th className={HEAD_CLASS}>Email</th>
                      <th className={HEAD_CLASS}>Role</th>
                      <th className={HEAD_CLASS}>Status</th>
                      <th className={HEAD_CLASS}>Invited</th>
                      <th className={HEAD_CLASS}>Expires</th>
                      <th className={HEAD_CLASS}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.invitations.map((invitation: TeamInvitationDto) => {
                      const isPendingStatus = invitation.status.toLowerCase() === "pending";
                      const isThisResending = isResending && resendVariables?.email === invitation.email;
                      const isThisRevoking = isRevoking && revokeVariables === invitation.id;
                      return (
                        <tr key={invitation.id} className="border-b border-line last:border-0">
                          <td className="px-4 py-3 font-semibold text-ink">{invitation.email}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {invitation.roles.map((role) => (
                                <Chip key={role} tone="ultra">
                                  {role}
                                </Chip>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <StatusChip status={invitation.status} />
                          </td>
                          <td className="px-4 py-3 text-ink-3">{formatDate(invitation.invitedAt)}</td>
                          <td className="px-4 py-3 text-ink-3">{formatDate(invitation.expiresAt)}</td>
                          <td className="px-4 py-3">
                            {isPendingStatus && (
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={isThisResending || isThisRevoking}
                                  onClick={() => handleResend(invitation)}
                                >
                                  {isThisResending ? "Resending..." : "Resend"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  disabled={isThisResending || isThisRevoking}
                                  onClick={() => setInvitationToRevoke(invitation)}
                                >
                                  {isThisRevoking ? "Revoking..." : "Revoke"}
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>

        <button
          type="button"
          onClick={() => navigate("/onboarding/team")}
          className="mt-8 h-10.5 w-full rounded-card bg-ink px-6 text-[13px] font-semibold text-paper hover:bg-ink/90 sm:w-auto"
        >
          Back to teams
        </button>
      </div>

      {teamId && (
        <InviteMemberModal teamId={teamId} open={showInviteModal} onOpenChange={setShowInviteModal} />
      )}

      <EditMemberRolesModal
        member={memberToEdit}
        open={!!memberToEdit}
        onOpenChange={(open) => !open && setMemberToEdit(null)}
      />

      <ConfirmModal
        open={!!invitationToRevoke}
        onOpenChange={(open) => !open && setInvitationToRevoke(null)}
        title="Revoke this invitation?"
        description={`${invitationToRevoke?.email} won't be able to accept it anymore. You can invite them again later.`}
        confirmLabel="Revoke invitation"
        pendingLabel="Revoking..."
        isPending={isRevoking}
        onConfirm={() => invitationToRevoke && revokeInvitation(invitationToRevoke.id)}
      />

      <ConfirmModal
        open={!!memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
        title="Remove this member?"
        description={`${memberToRemove?.userName} will lose access to this team. You can invite them again later.`}
        confirmLabel="Remove member"
        pendingLabel="Removing..."
        isPending={isRemoving || removeStepUp.isRequesting}
        onConfirm={() => memberToRemove && removeMember({ memberId: memberToRemove.id, stepUpChallengeId: null })}
      />

      <StepUpConfirmModal
        open={removeStepUp.isOpen}
        onOpenChange={removeStepUp.close}
        title="Confirm this change"
        description="Removing an Administrator needs a fresh code. Check your email."
        isRequesting={removeStepUp.isRequesting}
        isVerifying={removeStepUp.isVerifying}
        onVerify={removeStepUp.verify}
        onResend={removeStepUp.resend}
      />
    </div>
  );
}
