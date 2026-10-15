import * as React from "react";
import { Check } from "lucide-react";

/**
 * Shared pieces of the cascading dropdown-menu pattern `filters-menu.tsx` (V1) established —
 * extracted 2026-10-01 so `v2-filters-menu.tsx` can reuse the exact same interaction instead of a
 * near-duplicate. Nothing about V1's behavior changes; this is a pure move.
 */

export function OptionRow({
  label,
  note,
  active,
  onClick,
}: {
  label: string;
  note?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-control px-2.5 py-2 text-left hover:bg-paper-2"
    >
      <span className="block flex-1">
        <span className="block text-[12px] font-medium text-ink">{label}</span>
        {note && <span className="block text-[10.5px] text-ink-3">{note}</span>}
      </span>
      {active && <Check className="size-3.5 shrink-0 text-ultra" />}
    </button>
  );
}

export function SubHeading({ prefix, value }: { prefix: string; value: string }) {
  return (
    <span className="block flex-1 text-left">
      <span className="text-ink-3">{prefix} </span>
      <span className="text-ink">{value}</span>
    </span>
  );
}

/**
 * Manages one cascading level of a Filters menu: which key (if any) is "active" — i.e. open —
 * among a set of siblings, driven by both click (instant) and hover. Hover only takes over after
 * `openDelayMs` of dwelling on a trigger, and only lets go `closeDelayMs` after the pointer has
 * left both the trigger and its content.
 */
export function useCascadeSlot<K extends string>(openDelayMs: number, closeDelayMs: number) {
  const [active, setActive] = React.useState<K | null>(null);
  const closeTimerRef = React.useRef<number | undefined>(undefined);
  const openTimerRef = React.useRef<number | undefined>(undefined);

  const clearClose = React.useCallback(() => {
    if (closeTimerRef.current !== undefined) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  }, []);
  const clearOpen = React.useCallback(() => {
    if (openTimerRef.current !== undefined) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = undefined;
    }
  }, []);
  React.useEffect(() => {
    return () => {
      clearClose();
      clearOpen();
    };
  }, [clearClose, clearOpen]);

  const open = React.useCallback(
    (key: K) => {
      clearOpen();
      clearClose();
      setActive(key);
    },
    [clearOpen, clearClose]
  );

  const scheduleClose = React.useCallback(
    (key: K) => {
      clearClose();
      closeTimerRef.current = window.setTimeout(() => {
        setActive((current) => (current === key ? null : current));
      }, closeDelayMs);
    },
    [clearClose]
  );

  const closeAll = React.useCallback(() => {
    clearOpen();
    clearClose();
    setActive(null);
  }, [clearOpen, clearClose]);

  const handleEnter = React.useCallback(
    (key: K) => {
      if (active === key) {
        clearClose();
        return;
      }
      clearOpen();
      openTimerRef.current = window.setTimeout(() => open(key), openDelayMs);
    },
    [active, clearClose, clearOpen, open]
  );

  const handleLeave = React.useCallback(
    (key: K) => {
      clearOpen();
      scheduleClose(key);
    },
    [clearOpen, scheduleClose]
  );

  return { active, open, scheduleClose, closeAll, handleEnter, handleLeave, clearClose };
}
