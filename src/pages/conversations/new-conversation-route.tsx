import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, Shield, Sparkles, Zap } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { HomeCarousel } from "@/pages/conversations/home-carousel";
import { useTypewriter } from "@/pages/conversations/use-typewriter";
import { MAPPING_QUESTIONS } from "@/pages/onboarding/data/data";
import flolytLogo from "../../../assets/logo.png";

// Reuses the app's own already-authored example questions (onboarding's "what you can ask"
// rail) rather than inventing new copy — same questions, different surface.
const PLACEHOLDER_PHRASES = MAPPING_QUESTIONS.map((q) => q.question);

export default function NewConversationRoute() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [askBeforeSpending, setAskBeforeSpending] = useState(true);
  const [planMode, setPlanMode] = useState(true);
  const { text: placeholderText, caret } = useTypewriter(PLACEHOLDER_PHRASES);

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
        <h1 className="mt-4 font-serif text-[26px] text-ink sm:text-[28px]">What can I do for you?</h1>
        <p className="mt-1 text-[12.5px] text-ink-3">Ask Flolyt to look something up or take an action.</p>
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
            {!prompt && (
              <div
                aria-hidden
                className="pointer-events-none absolute top-3.5 left-4 text-[12.5px] text-ink-4"
              >
                {placeholderText}
                {caret && <span className="ml-px animate-pulse">|</span>}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-line px-2.5 py-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                aria-label="Prompt settings"
              >
                <Shield size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Shield size={14} className="text-ink-3" />
                    Ask before spending
                  </span>
                  <Switch checked={askBeforeSpending} onCheckedChange={setAskBeforeSpending} />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Zap size={14} className="text-ink-3" />
                    Plan mode
                  </span>
                  <Switch checked={planMode} onCheckedChange={setPlanMode} />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Sparkles size={14} className="text-ink-3" />
                  Enrichment chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
