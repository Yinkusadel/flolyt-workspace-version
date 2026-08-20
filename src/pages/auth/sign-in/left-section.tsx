import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { RequestCodeForm } from "@/pages/auth/sign-in/request-code-form";
import { VerifyCodeForm } from "@/pages/auth/sign-in/verify-code-form";
import flolytLogo from "../../../../assets/logo.png";

type Step = { name: "request" } | { name: "verify"; email: string; challengeId: string };

export const LeftSection = () => {
  const [searchParams] = useSearchParams();
  const defaultEmail = searchParams.get("email") ?? undefined;
  const [step, setStep] = useState<Step>({ name: "request" });

  return (
    <div className="flex h-full flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-sm">
        <img src={flolytLogo} alt="Flolyt" className="size-7.5 object-contain" />

        {step.name === "request" ? (
          <>
            <h1 className="mt-9 text-[22px] font-semibold text-ink">Sign in to your workspace</h1>
            <p className="mt-1.5 text-[12.5px] text-ink-3">
              Flolyt rooms are shared, so you always arrive as yourself.
            </p>

            <RequestCodeForm
              defaultEmail={defaultEmail}
              onRequested={(email, challengeId) => setStep({ name: "verify", email, challengeId })}
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
              email={step.email}
              challengeId={step.challengeId}
              onChallengeRefreshed={(challengeId) =>
                setStep({ name: "verify", email: step.email, challengeId })
              }
              onUseDifferentEmail={() => setStep({ name: "request" })}
            />
          </>
        )}
      </div>
    </div>
  );
};
