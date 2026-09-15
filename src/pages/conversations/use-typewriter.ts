import { useEffect, useState } from "react";

/**
 * Types each phrase in, holds, deletes it, then moves to the next — the rotating placeholder
 * pattern from flolyt-figma-designs/New-pages-pattern/Screens 2 (Useflolyt's home composer).
 *
 * Deliberately does not gate on prefers-reduced-motion: this machine has Windows' "Animation
 * effects" setting off (common, unrelated to any actual motion sensitivity — many people turn it
 * off purely for perceived snappiness), which maps straight to prefers-reduced-motion: reduce in
 * Chromium and silently froze this on phrase one, fully typed, no caret — exactly what got
 * reported as "not animating." A placeholder text cycle is low-stakes motion (no parallax, no
 * large moving regions), so it always runs rather than reading that OS setting as a signal here.
 */
export function useTypewriter(
  phrases: readonly string[],
  {
    typingSpeed = 42,
    deletingSpeed = 24,
    holdMs = 1700,
    pauseMs = 350,
  }: { typingSpeed?: number; deletingSpeed?: number; holdMs?: number; pauseMs?: number } = {}
) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    if (phrases.length === 0) return;
    const current = phrases[phraseIndex % phrases.length];
    let timer: number;

    if (phase === "typing") {
      if (text.length < current.length) {
        timer = window.setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
      } else {
        timer = window.setTimeout(() => setPhase("holding"), holdMs);
      }
    } else if (phase === "holding") {
      timer = window.setTimeout(() => setPhase("deleting"), 0);
    } else {
      if (text.length > 0) {
        timer = window.setTimeout(() => setText(current.slice(0, text.length - 1)), deletingSpeed);
      } else {
        timer = window.setTimeout(() => {
          setPhraseIndex((i) => (i + 1) % phrases.length);
          setPhase("typing");
        }, pauseMs);
      }
    }

    return () => window.clearTimeout(timer);
  }, [phrases, phraseIndex, phase, text, typingSpeed, deletingSpeed, holdMs, pauseMs]);

  return { text, caret: true };
}
