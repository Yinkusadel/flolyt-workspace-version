import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import useVerifyLoginCode from "@/features/auth/use-verify-login-code";
import useRequestLoginCode from "@/features/auth/use-request-login-code";
import useResendCooldown from "@/features/auth/use-resend-cooldown";

interface VerifyCodeFormProps {
  email: string;
  challengeId: string;
  onChallengeRefreshed: (challengeId: string) => void;
  onUseDifferentEmail: () => void;
}

export const VerifyCodeForm = ({
  email,
  challengeId,
  onChallengeRefreshed,
  onUseDifferentEmail,
}: VerifyCodeFormProps) => {
  const { form, isPending, onSubmit } = useVerifyLoginCode({ challengeId, email });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const { secondsLeft, canResend, start } = useResendCooldown();

  // A fresh challenge starts its own 60s window.
  useEffect(() => {
    start();
    setValue("challengeId", challengeId);
  }, [challengeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const { requestCode, isPending: isResending } = useRequestLoginCode({
    onRequested: (_email, newChallengeId) => {
      onChallengeRefreshed(newChallengeId);
    },
  });

  const handleResend = () => {
    if (!canResend || isResending) return;
    requestCode(email);
    start();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10" noValidate>
      <p className="text-[12px] text-ink-3">
        We sent a 6-digit code to <span className="font-semibold text-ink">{email}</span>. Codes
        expire after 10 minutes.
      </p>

      <div className="mt-5">
        <label htmlFor="code" className="text-[10.5px] text-ink-3">
          Sign-in code
        </label>
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <InputOTP
              id="code"
              inputMode="numeric"
              pattern={REGEXP_ONLY_DIGITS}
              autoComplete="one-time-code"
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              containerClassName="mt-2"
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} aria-invalid={!!errors.code} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        {errors.code && <p className="mt-1.5 text-[11px] text-destructive">{errors.code.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="mt-6 h-9.5 w-full rounded-card bg-ink text-[13px] font-semibold text-paper hover:bg-ink/90"
      >
        {isPending ? "Verifying..." : "Sign in"}
      </Button>

      <div className="mt-4 flex items-center justify-between text-[11.5px]">
        <button
          type="button"
          onClick={onUseDifferentEmail}
          className="text-ink-3 hover:text-ink hover:underline"
        >
          Use a different email
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend || isResending}
          className="text-ink-3 hover:text-ink hover:underline disabled:cursor-not-allowed disabled:text-ink-4 disabled:no-underline"
        >
          {canResend ? "Resend code" : `Resend in ${secondsLeft}s`}
        </button>
      </div>
    </form>
  );
};
