import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";

import useSendAiMessage from "@/features/ai-conversations/use-send-ai-message";

export default function NewConversationRoute() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const { sendMessage, isPending } = useSendAiMessage({
    onSuccess: (conversationId) => navigate(`/conversations/${conversationId}`),
  });

  const handleSubmit = () => {
    const message = prompt.trim();
    if (!message || isPending) return;

    sendMessage({ conversationId: null, message, mode: null, interactiveReply: null });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <h1 className="text-[22px] font-semibold text-ink">What can I do for you?</h1>
      <p className="mt-2 text-[12.5px] text-ink-3">Ask Flolyt to look something up or take an action.</p>

      <div className="mt-8 w-full max-w-2xl rounded-card border border-line bg-paper-2 shadow-xs">
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
          placeholder="Assign a task or ask anything"
          disabled={isPending}
          className="w-full resize-none rounded-t-card bg-transparent px-4 pt-4 pb-2 text-[12.5px] text-ink outline-none placeholder:text-ink-4 disabled:opacity-60"
        />

        <div className="flex items-center justify-end border-t border-line px-3 py-2.5">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!prompt.trim() || isPending}
            className="flex size-8 items-center justify-center rounded-lg bg-ink text-paper transition-opacity disabled:opacity-30"
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
