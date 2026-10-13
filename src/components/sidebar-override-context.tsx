import * as React from "react";

/**
 * Lets a page ask the app layout to show the sidebar as its icon rail for as long as the page needs the room
 * (the Room's thread panel). Temporary by design: the person's own saved collapse preference
 * (`flolyt-sidebar-collapsed`) is never written by the override, so closing the panel restores exactly what they had.
 * The page also says what to do when the person asks to EXPAND the sidebar meanwhile (the Room closes its thread).
 */
export interface SidebarOverride {
  forceCollapsed: (forceCollapsed: boolean, onExpandRequest?: () => void) => void;
}

export const SidebarOverrideContext = React.createContext<SidebarOverride["forceCollapsed"]>(() => {});

export function useForceSidebarCollapsed(active: boolean, onExpandRequest?: () => void) {
  const setForceCollapsed = React.useContext(SidebarOverrideContext);
  // Latest handler without re-running the effect (a new inline function on every render must not toggle the override).
  const handlerRef = React.useRef(onExpandRequest);
  handlerRef.current = onExpandRequest;
  React.useEffect(() => {
    setForceCollapsed(active, () => handlerRef.current?.());
    return () => setForceCollapsed(false);
  }, [active, setForceCollapsed]);
}
