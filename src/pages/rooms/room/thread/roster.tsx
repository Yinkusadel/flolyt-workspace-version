import { PersonAvatar } from "@/components/person-avatar";
import { TextTooltip } from "@/components/ui/text-tooltip";
import { agentInitialsFromName, initialsFromName } from "@/lib/initials";

/** A person or agent as the roster and the members dialog draw them. */
export interface RosterPerson {
  userId: string;
  /** Always set: a person without a resolvable name is not listed (never an id or an email). */
  displayName: string;
  role: string;
}

export interface RosterAgent {
  key: string;
  displayName: string;
  role: string;
  /** Only `GET /rooms/{roomId}/people` carries it. */
  whatItWillDo?: string;
}

/** Circles shown before the rest collapse into "+N". */
const MAX_FACES = 6;

const RING = "ring-2 ring-paper";

/**
 * The thread header's roster: overlapping avatars (people solid, agents dashed) with the count beside them, one
 * button that opens the members dialog. Names live in the tooltip and the dialog, so a Room with many people stays a
 * single short row.
 */
export function ThreadRoster({
  people,
  agents,
  teamFor,
  onOpen,
}: {
  people: RosterPerson[];
  agents: RosterAgent[];
  teamFor: (userId: string) => 1 | 2 | 3 | 4;
  onOpen: () => void;
}) {
  const faces = [
    ...people.map((person) => ({ id: `p:${person.userId}`, person, agent: null as RosterAgent | null })),
    ...agents.map((agent) => ({ id: `a:${agent.key}`, person: null as RosterPerson | null, agent })),
  ];
  const shown = faces.slice(0, MAX_FACES);
  const hidden = faces.length - shown.length;

  const summary = [
    people.length > 0 ? `${people.length} ${people.length === 1 ? "person" : "people"}` : null,
    agents.length > 0 ? `${agents.length} ${agents.length === 1 ? "agent" : "agents"}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="See who is in this Room"
      className="group mt-3 flex max-w-full items-center gap-3 rounded-control text-left"
    >
      <span className="flex items-center">
        {shown.map((face, index) => (
          <TextTooltip key={face.id} className={index === 0 ? "" : "-ml-1"} content={face.person?.displayName ?? face.agent?.displayName}>
            {face.person ? (
              <PersonAvatar
                kind="human"
                size="lg"
                team={teamFor(face.person.userId)}
                initials={initialsFromName(face.person.displayName)}
                className={RING}
              />
            ) : (
              <PersonAvatar
                kind="agent"
                size="lg"
                initials={agentInitialsFromName(face.agent?.displayName ?? "")}
                className={`${RING} bg-ultra-bg`}
              />
            )}
          </TextTooltip>
        ))}
        {hidden > 0 && (
          <span
            className={`${RING} -ml-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-paper-2 font-mono text-[10px] font-semibold text-ink-3`}
          >
            +{hidden}
          </span>
        )}
      </span>
      <span className="truncate text-[11.5px] text-ink-3 group-hover:text-ink">{summary || "No one here yet"}</span>
    </button>
  );
}
