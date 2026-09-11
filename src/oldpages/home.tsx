import { useOutletContext } from "react-router-dom";

import type { AppOutletContext } from "@/pages/app-layout";

/**
 * Placeholder for screens 11-12 (workspace home consumer / accounts) in
 * flolyt-kit-122 — layout shell only until those are built. See
 * docs/build-tracker.md.
 *
 * Content here is scoped to the sidebar's "viewing as" selection (Everyone /
 * Marketing / Sales / Products) once real dashboards land — for now it just
 * echoes the scope so the control is visibly wired up.
 */
const Home = () => {
  const { viewingAs } = useOutletContext<AppOutletContext>();

  return (
    <div className="rounded-card border border-line bg-paper p-6 text-ink-3">
      Home — viewing as {viewingAs}
    </div>
  );
};

export default Home;
