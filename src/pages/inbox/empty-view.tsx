import { Inbox as InboxIcon, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PickAMessageState({ onCompose }: { onCompose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <span className="flex size-12 items-center justify-center rounded-card bg-paper-2 text-ink-3">
        <InboxIcon className="size-5" />
      </span>
      <p className="mt-4 text-[16px] font-semibold text-ink">Pick a message to read</p>
      <p className="mt-2 max-w-[34ch] text-[13px] leading-relaxed text-ink-3">
        Threads here are between people. Agent notices link into the room they came from.
      </p>
      <Button variant="outline" className="mt-5" onClick={onCompose}>
        New message
      </Button>
    </div>
  );
}

export function CaughtUpState({
  movingRoomsCount,
  onSeeAll,
}: {
  movingRoomsCount: number;
  onSeeAll: () => void;
}) {
  const roomWord = movingRoomsCount === 1 ? "room is" : "rooms are";

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-teal-bg text-teal">
        <Sparkles className="size-5" />
      </span>
      <p className="mt-4 text-[18px] font-semibold text-ink">You are caught up</p>
      <p className="mt-2 text-[13px] text-ink-3">Nothing is waiting on a reply from you.</p>
      {movingRoomsCount > 0 && (
        <p className="text-[13px] text-ink-3">
          {movingRoomsCount === 1 ? "One" : movingRoomsCount} {roomWord} still moving without you.
        </p>
      )}
      <Button variant="outline" className="mt-5" onClick={onSeeAll}>
        See what is still open
      </Button>
    </div>
  );
}
