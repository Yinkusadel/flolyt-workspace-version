import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeCarousel } from "@/pages/conversations/home-carousel";
import { PromptToggles } from "@/pages/conversations/prompt-toggles";
import { useTypewriter } from "@/pages/conversations/use-typewriter";
import { useGetHomePrompts } from "@/features/home/use-get-home-prompts";
import flolytLogo from "../../../assets/logo.png";

// The greeting is randomized fresh on every fetch (by design — see /home/prompts' own docs), so
// a background refetch on remount can swap it out from under the reader. Crossfading rather than
// snapping to the new text turns that swap into something that reads as intentional.
const GREETING_FADE_MS = 300;

export default function NewConversationRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillPrompt = (location.state as { prefillPrompt?: string } | null)?.prefillPrompt;
  const [prompt, setPrompt] = useState(prefillPrompt ?? "");
  const [askBeforeSpending, setAskBeforeSpending] = useState(true);
  const [planMode, setPlanMode] = useState(true);

  // /home/prompts returns both the greeting above the composer and the suggestion texts
  // cycled through it in one call — /home/greeting is deliberately not also called here,
  // per that endpoint's own docs, since it would just duplicate this response's greeting.
  const {
    data: promptsData,
    isPending: isPromptsPending,
    isError: isPromptsError,
    refetch: refetchPrompts,
  } = useGetHomePrompts();
  const greeting = promptsData?.data.greeting;
  const promptPhrases = (promptsData?.data.prompts ?? []).map((p) => p.text);
  const { text: placeholderText, caret } = useTypewriter(promptPhrases);

  // Crossfades the greeting whenever it actually changes value, instead of the text just
  // snapping the instant a background refetch resolves.
  const [displayedGreeting, setDisplayedGreeting] = useState(greeting);
  const [isGreetingVisible, setIsGreetingVisible] = useState(true);

  useEffect(() => {
    if (greeting === undefined || greeting === displayedGreeting) return;

    if (displayedGreeting === undefined) {
      // First greeting to ever land — nothing to fade out from, so just show it.
      setDisplayedGreeting(greeting);
      return;
    }

    setIsGreetingVisible(false);
    const timer = window.setTimeout(() => {
      setDisplayedGreeting(greeting);
      setIsGreetingVisible(true);
    }, GREETING_FADE_MS);
    return () => window.clearTimeout(timer);
  }, [greeting, displayedGreeting]);

  const handleSubmit = () => {
    const message = prompt.trim();
    if (!message) return;

    // Navigate immediately — the detail route owns the actual send (SSE) and picks the prompt
    // up from nav state via the bootstrap token, so the response starts streaming the moment
    // it lands instead of waiting on a round trip here first.
    navigate("/conversations/new", { state: { bootstrapToken: crypto.randomUUID(), prompt: message } });
  };

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center pb-4 sm:justify-start sm:pt-2">
      {/* Ambient accent glow — subtle, matches the app's --color-ultra AI accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ultra/10 blur-3xl"
      />

      <div className="relative flex flex-col items-center text-center duration-500 animate-in fade-in slide-in-from-bottom-2">
        <span className="flex size-12 items-center justify-center rounded-full border border-ultra-border bg-ultra-bg">
          <img src={flolytLogo} alt="" className="size-7 object-contain" />
        </span>
        {isPromptsPending ? (
          <Skeleton className="mt-4 h-8 w-72 rounded-panel" />
        ) : (
          <h1
            className={cn(
              // duration-300 must match GREETING_FADE_MS above — the timer swaps the text at
              // the same moment this fade-out finishes.
              "mt-4 translate-y-0 font-serif text-[26px] text-ink opacity-100 transition-all duration-300 ease-out sm:text-[28px]",
              !isPromptsError && !isGreetingVisible && "-translate-y-1 opacity-0"
            )}
          >
            {isPromptsError ? "What can I do for you?" : displayedGreeting}
          </h1>
        )}
        {isPromptsError && (
          <p className="mt-1 text-[12.5px] text-ink-3">
            Couldn't load your suggestions.{" "}
            <button
              type="button"
              onClick={() => refetchPrompts()}
              className="font-medium text-ultra hover:underline"
            >
              Retry
            </button>
          </p>
        )}
      </div>

      <div className="group relative mt-6 w-full max-w-2xl duration-500 animate-in fade-in slide-in-from-bottom-2 delay-150">
        {/* Thin animated gradient outline — only visible while focused, kept subtle */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-card opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"
          style={{
            background:
              "linear-gradient(120deg, var(--color-ultra), var(--color-ultra-border), var(--color-ultra))",
            backgroundSize: "300% 300%",
            animation: "border-gradient-pan 5s ease infinite",
          }}
        />

        <div className="relative rounded-card border border-line bg-paper-2 shadow-xs transition-colors group-focus-within:border-transparent">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={3}
              aria-label="Assign a task or ask anything"
              className="w-full resize-none rounded-t-card bg-transparent px-4 pt-3.5 pb-1.5 text-[12.5px] text-ink outline-none"
            />
            {/* Native `placeholder` can't be animated, so the typewriter text renders as an
                overlay in its place instead — hidden the instant a real value exists. */}
            {!prompt && placeholderText && (
              <div
                aria-hidden
                className="pointer-events-none absolute top-3.5 left-4 text-[12.5px] text-ink-4"
              >
                {placeholderText}
                {caret && <span className="ml-px animate-pulse">|</span>}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-2.5 py-1.5">
            <PromptToggles
              askBeforeSpending={askBeforeSpending}
              onAskBeforeSpendingChange={setAskBeforeSpending}
              planMode={planMode}
              onPlanModeChange={setPlanMode}
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className={cn(
                "flex size-6.5 items-center justify-center rounded-md transition-all",
                prompt.trim() ? "bg-ultra text-paper hover:opacity-90" : "bg-paper text-ink-4"
              )}
            >
              <ArrowUp size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <HomeCarousel />
    </div>
  );
}
