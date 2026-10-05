import { Navigate, useParams } from "react-router-dom";

import { getMemoryEntry } from "@/pages/business-memory/data";
import { EntryStandard } from "@/pages/business-memory/entry-standard";
import { EntryDecaying } from "@/pages/business-memory/entry-decaying";

/** ME03/ME04 — /business-memory/:id. A decaying control (Room 2388) gets its own layout — a
 * warning callout and an effectiveness chart instead of the What broke/Evidence/Decision trail,
 * since redoing the control is the point, not relitigating the original investigation. */
export default function BusinessMemoryEntry() {
  const { id } = useParams();
  const entry = getMemoryEntry(id);

  if (!entry) return <Navigate to="/business-memory" replace />;
  if (entry.control.status === "decaying" && entry.decay) return <EntryDecaying entry={entry} />;
  return <EntryStandard entry={entry} />;
}
