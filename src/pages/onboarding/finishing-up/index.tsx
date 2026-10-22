import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const MESSAGES = [
  "Setting up your workspace...",
  "Bringing your agents online...",
  "Loading what you've connected...",
  "Almost there...",
];

const STAGE_DURATION_MS = 1150;
const MESSAGES_DURATION_MS = MESSAGES.length * STAGE_DURATION_MS;
const FINAL_STAGE_DURATION_MS = 900;

/**
 * Onboarding's closing screen, reached only from /onboarding/team's Continue button (which
 * posts `kind: "Finished"` before navigating here — this page does no work of its own, no
 * data fetched or written). Purely cosmetic: a spinning ring + rotating status line + a
 * linear progress bar for ~4.6s, then a checkmark payoff for ~0.9s, then an automatic
 * redirect to "/" — makes landing back in the app feel like a deliberate handoff rather than
 * an abrupt jump, per the user's request for "lovely animations" here.
 */
export default function OnboardingFinishingUpRoute() {
  const navigate = useNavigate();
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [barFilled, setBarFilled] = useState(false);

  useEffect(() => {
    const fillFrame = requestAnimationFrame(() => setBarFilled(true));

    const messageTimeouts = MESSAGES.map((_, index) =>
      setTimeout(() => setMessageIndex(index), index * STAGE_DURATION_MS)
    );
    const doneTimeout = setTimeout(() => setIsDone(true), MESSAGES_DURATION_MS);
    const navigateTimeout = setTimeout(
      () => navigate("/"),
      MESSAGES_DURATION_MS + FINAL_STAGE_DURATION_MS
    );

    return () => {
      cancelAnimationFrame(fillFrame);
      messageTimeouts.forEach(clearTimeout);
      clearTimeout(doneTimeout);
      clearTimeout(navigateTimeout);
    };
    // Runs the whole sequence exactly once on mount — deliberately not re-run on any prop
    // or state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-[calc(100dvh-62px)] flex-col items-center justify-center px-6">
      <div className="relative flex size-20 items-center justify-center">
        {isDone ? (
          <div className="flex size-20 items-center justify-center rounded-full bg-teal-bg text-teal duration-300 animate-in zoom-in-95">
            <Check className="size-9" />
          </div>
        ) : (
          <>
            <span className="absolute inset-0 rounded-full border-4 border-line" aria-hidden />
            <span
              className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-ultra"
              aria-hidden
            />
          </>
        )}
      </div>

      <p className="mt-6 text-[14px] font-semibold text-ink" role="status">
        {isDone ? "You're all set!" : MESSAGES[messageIndex]}
      </p>
      <p className="mt-1.5 text-[11.5px] text-ink-3">Taking you to your workspace</p>

      <div className="mt-5 h-1.5 w-56 overflow-hidden rounded-full bg-paper-2">
        <div
          className={cn(
            "h-1.5 rounded-full bg-ultra transition-all ease-linear",
            barFilled ? "w-full" : "w-0"
          )}
          style={{ transitionDuration: `${MESSAGES_DURATION_MS}ms` }}
        />
      </div>
    </div>
  );
}
