import * as React from "react";

/**
 * Lets a page ask the app layout to show the sidebar as its icon rail for as long as the page needs the room
 * (the Room's thread panel). Temporary by design: the person's own saved collapse preference
 * (`flolyt-sidebar-collapsed`) is never written, so closing the panel restores exactly what they had.
 */
export const SidebarOverrideContext = React.createContext<(forceCollapsed: boolean) => void>(() => {});

export function useForceSidebarCollapsed(active: boolean) {
  const setForceCollapsed = React.useContext(SidebarOverrideContext);
  React.useEffect(() => {
    setForceCollapsed(active);
    return () => setForceCollapsed(false);
  }, [active, setForceCollapsed]);
}
