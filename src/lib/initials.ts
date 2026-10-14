/** "Ravi Mehta" -> "RM" — used wherever a person comes back as a bare name/id (no initials field).
 * Humans are always 2 letters; see `agentInitialsFromName` for the agent counterpart. */
export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** "Involuntary Churn" -> "INV" — agents are always 3 letters (vs. 2 for a human), so the two
 * are never mistakable at a glance even before the dashed border registers. */
export function agentInitialsFromName(name: string): string {
  const compact = name.trim().replace(/\s+/g, "");
  return compact ? compact.slice(0, 3).toUpperCase() : "?";
}
