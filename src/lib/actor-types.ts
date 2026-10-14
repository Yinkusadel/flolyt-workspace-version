import type { Department } from "@/lib/lifecycle-data";
import type { ChipTone } from "@/components/ui/chip";

/** Chip/pill tone vocabulary shared by every page that draws a tone-coded chip. */
export type Tone = ChipTone;

/** A person as the design draws them: initials plus a department that sets the avatar color. */
export type PersonRef = { initials: string; name: string; department: Department; roleLabel?: string };

/** An agent: always 3-letter initials, never mistakable for a person's 2. */
export type AgentRef = { initials: string; name: string };

export type Actor = { kind: "human"; person: PersonRef } | { kind: "agent"; agent: AgentRef };
