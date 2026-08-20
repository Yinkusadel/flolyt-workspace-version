import { Link, useSearchParams } from "react-router-dom";

import { RequestCodeForm } from "@/pages/auth/sign-in/request-code-form";
import { VerifyCodeForm } from "@/pages/auth/sign-in/verify-code-form";
import flolytLogo from "../../../../assets/logo.png";

export const LeftSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const email = searchParams.get("email") ?? undefined;
  const challengeId = searchParams.get("challengeId") ?? undefined;
  const isVerifying = Boolean(email && challengeId);

  return (
    <div className="flex h-full flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-sm">
        <img src={flolytLogo} alt="Flolyt" className="size-7.5 object-contain" />

        {!isVerifying ? (
          <>
            <h1 className="mt-9 text-[22px] font-semibold text-ink">Sign in to your workspace</h1>
            <p className="mt-1.5 text-[12.5px] text-ink-3">
              Flolyt rooms are shared, so you always arrive as yourself.
            </p>

            <RequestCodeForm
              defaultEmail={email}
              onRequested={(requestedEmail, requestedChallengeId) =>
                setSearchParams({ email: requestedEmail, challengeId: requestedChallengeId })
              }
            />

            <p className="mt-6 text-[12px] text-ink-3">
              New to Flolyt?{" "}
              <Link to="/auth/sign-up" className="font-semibold text-ink hover:underline">
                Create a workspace
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-9 text-[22px] font-semibold text-ink">Enter your code</h1>
            <p className="mt-1.5 text-[12.5px] text-ink-3">
              Check your inbox for the code we just sent.
            </p>

            <VerifyCodeForm
              email={email!}
              challengeId={challengeId!}
              onChallengeRefreshed={(newChallengeId) =>
                setSearchParams({ email: email!, challengeId: newChallengeId })
              }
              onUseDifferentEmail={() => setSearchParams({})}
            />
          </>
        )}
      </div>
    </div>
  );
};
