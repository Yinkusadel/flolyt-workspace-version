import { useEffect, useRef, useState } from "react";

const COOLDOWN_SECONDS = 60;

/** Countdown gate for "resend code" actions — the API is a no-op inside 60s, so this keeps the button disabled instead of letting the user re-request silently. */
const useResendCooldown = () => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const start = () => {
    setSecondsLeft(COOLDOWN_SECONDS);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return { secondsLeft, canResend: secondsLeft === 0, start };
};

export default useResendCooldown;
