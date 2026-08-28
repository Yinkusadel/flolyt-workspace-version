import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AcceptInvitationForm } from "@/pages/teams/accept-invitation/accept-invitation-form";
import useGetInvitationDetails from "@/features/teams/use-get-invitation-details";
import flolytLogo from "../../../../assets/logo.png";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export const LeftSection = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [declined, setDeclined] = useState(false);

  const { invitation, isLoading, isError } = useGetInvitationDetails(token ?? "");

  return (
    <div className="flex h-full flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-sm">
        <img src={flolytLogo} alt="Flolyt" className="size-7.5 object-contain" />

        {!token ? (
          <>
            <h1 className="mt-9 text-[22px] font-semibold text-ink">This link isn't valid</h1>
            <p className="mt-8 text-[12px] text-destructive">
              This invitation link is invalid or has expired. Ask whoever invited you to send a
              new one.
            </p>
            <SignInFooter />
          </>
        ) : isLoading ? (
          <div className="mt-9">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-3/4" />
          </div>
        ) : isError || !invitation ? (
          <>
            <h1 className="mt-9 text-[22px] font-semibold text-ink">This link isn't valid</h1>
            <p className="mt-8 text-[12px] text-destructive">
              This invitation link is invalid or has expired. Ask whoever invited you to send a
              new one.
            </p>
            <SignInFooter />
          </>
        ) : invitation.isExpired ? (
          <>
            <h1 className="mt-9 text-[22px] font-semibold text-ink">This invitation has expired</h1>
            <p className="mt-2 text-[12.5px] text-ink-3">
              Ask {invitation.inviterName} to send you a new invite to {invitation.teamName}.
            </p>
            <SignInFooter />
          </>
        ) : declined ? (
          <>
            <h1 className="mt-9 text-[22px] font-semibold text-ink">No problem</h1>
            <p className="mt-2 text-[12.5px] text-ink-3">
              You haven't been added to {invitation.teamName}. This invitation stays open if you
              change your mind — just open the link again.
            </p>
            <SignInFooter />
          </>
        ) : (
          <>
            <h1 className="mt-9 text-[22px] font-semibold text-ink">You've been invited</h1>
            <p className="mt-1.5 text-[12.5px] text-ink-3">
              {invitation.inviterName} invited you to join their workspace on Flolyt.
            </p>

            <div className="mt-6 rounded-panel border border-line bg-paper-2 px-4 py-3.5">
              <p className="text-[13px] font-semibold text-ink">{invitation.teamName}</p>
              <p className="mt-1 text-[11.5px] text-ink-3">{invitation.email}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {invitation.roles.map((role) => (
                  <Chip key={role} tone="ultra">
                    {role}
                  </Chip>
                ))}
              </div>
              <p className="mt-2.5 font-mono text-[10px] text-ink-4">
                Expires {formatDate(invitation.expiresAt)}
              </p>
            </div>

            {invitation.userAlreadyExists && (
              <p className="mt-4 text-[11.5px] text-ink-3">
                Looks like you already have a Flolyt account with this email — confirm your name
                below to join, then sign in as usual.
              </p>
            )}

            <AcceptInvitationForm token={token} />

            <button
              type="button"
              onClick={() => setDeclined(true)}
              className="mt-4 w-full text-center text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              No thanks, decline
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const SignInFooter = () => (
  <p className="mt-6 text-[12px] text-ink-3">
    Already have a workspace?{" "}
    <Link to="/auth/sign-in" className="font-semibold text-ink hover:underline">
      Sign in
    </Link>
  </p>
);
