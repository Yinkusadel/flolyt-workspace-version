import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Slides its children open and closed. The height is measured and animated with an inline style, so it
 * does not depend on CSS grid-row interpolation or on any utility class being generated, and it works the
 * same in every browser. A ResizeObserver keeps the open height right when the text rewraps. Always
 * mounted, so it animates closed as well as open.
 */
export function Collapse({ open, id, children }: { open: boolean; id?: string; children: ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => setContentHeight(el.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id={id}
      aria-hidden={!open}
      style={{
        height: open ? contentHeight : 0,
        opacity: open ? 1 : 0,
        overflow: "hidden",
        transition: "height 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease-out",
      }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
