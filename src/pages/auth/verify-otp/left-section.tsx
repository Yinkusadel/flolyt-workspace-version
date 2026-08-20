import { useParams, useSearchParams } from "react-router-dom";

import { OtpForm } from "@/pages/auth/verify-otp/otp-form";
import flolytLogo from "../../../../assets/logo.png";

export const LeftSection = () => {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? undefined;

  return (
    <div className="flex h-full flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-sm">
        <img src={flolytLogo} alt="Flolyt" className="size-7.5 object-contain" />

        <h1 className="mt-9 text-[22px] font-semibold text-ink">Confirm your email</h1>
        <p className="mt-1.5 text-[12.5px] text-ink-3">
          {email ? (
            <>
              Enter the code we sent to <span className="font-semibold text-ink">{email}</span>.
            </>
          ) : (
            "Enter the code we sent to your inbox."
          )}{" "}
          Confirmation codes last a few hours, so there's no rush.
        </p>

        {userId ? (
          <OtpForm userId={userId} email={email} />
        ) : (
          <p className="mt-6 text-[12px] text-destructive">
            This confirmation link is missing information. Please sign up again.
          </p>
        )}
      </div>
    </div>
  );
};
