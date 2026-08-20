import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import useConfirmRegistration from "@/features/auth/use-confirm-registration";
import useResendOtp from "@/features/auth/use-resend-otp";
import useResendCooldown from "@/features/auth/use-resend-cooldown";

interface OtpFormProps {
  userId: string;
  email?: string;
}

export const OtpForm = ({ userId, email }: OtpFormProps) => {
  const { form, isPending, onSubmit } = useConfirmRegistration({ userId, email });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { secondsLeft, canResend, start } = useResendCooldown();
  const { resendOtpAsync, isPending: isResending } = useResendOtp();

  useEffect(() => {
    start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResend = async () => {
    if (!canResend || isResending || !email) return;

    try {
      await resendOtpAsync({ email });
      start();
    } catch {
      // useResendOtp's mutation already toasts the error — nothing else to do here
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10" noValidate>
      <div>
        <label htmlFor="otp" className="text-[10.5px] text-ink-3">
          Confirmation code
        </label>
        <Controller
          control={control}
          name="otp"
          render={({ field }) => (
            <InputOTP
              id="otp"
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
                  <InputOTPSlot key={index} index={index} aria-invalid={!!errors.otp} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        {errors.otp && <p className="mt-1.5 text-[11px] text-destructive">{errors.otp.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="mt-6 h-9.5 w-full rounded-card bg-ink text-[13px] font-semibold text-paper hover:bg-ink/90"
      >
        {isPending ? "Confirming..." : "Confirm email"}
      </Button>

      {email && (
        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend || isResending}
          className="mt-4 text-[11.5px] text-ink-3 hover:text-ink hover:underline disabled:cursor-not-allowed disabled:text-ink-4 disabled:no-underline"
        >
          {canResend ? "Resend code" : `Resend in ${secondsLeft}s`}
        </button>
      )}
    </form>
  );
};
