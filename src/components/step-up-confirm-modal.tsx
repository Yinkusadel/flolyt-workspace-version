import { useEffect, useState, type FormEvent } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import useResendCooldown from "@/features/auth/use-resend-cooldown";

interface StepUpConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isRequesting: boolean;
  isVerifying: boolean;
  onVerify: (code: string) => void;
  onResend: () => void;
}

/**
 * Shared confirm-with-an-emailed-code modal for step-up gated actions (workspace
 * markets, revenue model, and later governance changes) — see auth-frontend-handoff.md's
 * "Step-up confirmation" section. Always mounted with `open` starting false, per
 * [[preact_radix_dialog_crash]] — never gate this behind a truthy conditional.
 */
export function StepUpConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  isRequesting,
  isVerifying,
  onVerify,
  onResend,
}: StepUpConfirmModalProps) {
  const [code, setCode] = useState("");
  const { secondsLeft, canResend, start } = useResendCooldown();

  useEffect(() => {
    if (!open) return;
    setCode("");
    start();
    // Only the open transition should reset the code + cooldown, not every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleResend = () => {
    if (!canResend || isRequesting) return;
    onResend();
    start();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (code.length === 6) onVerify(code);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody className="px-5 py-5 sm:px-7 sm:py-6">
            <label htmlFor="step-up-code" className="text-[10.5px] text-ink-3">
              Confirmation code
            </label>
            <InputOTP
              id="step-up-code"
              inputMode="numeric"
              pattern={REGEXP_ONLY_DIGITS}
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={setCode}
              containerClassName="mt-2"
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isRequesting}
              className="mt-3 text-[11.5px] text-ink-3 hover:text-ink hover:underline disabled:cursor-not-allowed disabled:text-ink-4 disabled:no-underline"
            >
              {canResend ? "Resend code" : `Resend in ${secondsLeft}s`}
            </button>
          </DialogBody>

          <DialogFooter>
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={code.length !== 6 || isVerifying}>
                {isVerifying ? "Confirming..." : "Confirm"}
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
