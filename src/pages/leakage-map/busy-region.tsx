import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * While `busy`, nothing inside can be clicked, tabbed to or read as interactive: the browser's `inert` attribute
 * does all three at once (a `pointer-events` rule alone would still let the keyboard through). Set through a ref
 * because the attribute is not part of the framework's typed props.
 */
export function BusyRegion({ busy, className, children }: { busy: boolean; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (busy) el.setAttribute("inert", "");
    else el.removeAttribute("inert");
  }, [busy]);

  return (
    <div ref={ref} aria-busy={busy} className={cn(busy && "pointer-events-none select-none", className)}>
      {children}
    </div>
  );
}
