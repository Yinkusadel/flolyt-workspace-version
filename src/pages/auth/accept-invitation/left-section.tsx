import { Link, useSearchParams } from "react-router-dom";

import { AcceptInvitationForm } from "@/pages/auth/accept-invitation/accept-invitation-form";
import flolytLogo from "../../../../assets/logo.png";

export const LeftSection = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="flex h-full flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-sm">
        <img src={flolytLogo} alt="Flolyt" className="size-7.5 object-contain" />

        <h1 className="mt-9 text-[22px] font-semibold text-ink">You've been invited</h1>
        <p className="mt-1.5 text-[12.5px] text-ink-3">
          No password to set — just confirm your name and you're in.
        </p>

        {token ? (
          <AcceptInvitationForm token={token} />
        ) : (
          <div className="mt-8">
            <p className="text-[12px] text-destructive">
              This invitation link is invalid or has expired. Ask whoever invited you to send a
              new one.
            </p>
            <p className="mt-6 text-[12px] text-ink-3">
              Already have a workspace?{" "}
              <Link to="/auth/sign-in" className="font-semibold text-ink hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
