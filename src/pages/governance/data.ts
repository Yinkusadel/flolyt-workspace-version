export type AutonomyMode = "automatic" | "proposes" | "blocked";

export type AutonomyRow = {
  id: string;
  label: string;
  note: string;
  mode: AutonomyMode;
};

export type AutonomyGroup = {
  key: string;
  label: string;
  rows: AutonomyRow[];
};

export const AUTONOMY_GROUPS: AutonomyGroup[] = [
  {
    key: "reading",
    label: "Reading",
    rows: [
      { id: "read-sources", label: "Read connected sources", note: "reversible · no side effect", mode: "automatic" },
      { id: "search-memory", label: "Search business memory", note: "reversible · no side effect", mode: "automatic" },
      { id: "read-tickets", label: "Read support tickets", note: "read-only integration", mode: "automatic" },
    ],
  },
  {
    key: "working",
    label: "Working inside Flolyt",
    rows: [
      { id: "open-room", label: "Open a room", note: "reversible · visible to the team", mode: "automatic" },
      { id: "draft-campaign", label: "Draft a campaign", note: "nothing sends from a draft", mode: "automatic" },
      {
        id: "write-memory",
        label: "Write to business memory",
        note: "reversible · dated and attributed",
        mode: "automatic",
      },
      {
        id: "assign-play",
        label: "Assign a play to a person",
        note: "creates an obligation for someone",
        mode: "proposes",
      },
    ],
  },
  {
    key: "leaving",
    label: "Leaving Flolyt",
    rows: [
      { id: "send-message", label: "Send a customer message", note: "not reversible · reaches a person", mode: "proposes" },
      { id: "publish-qbr", label: "Publish a QBR externally", note: "not reversible · under your identity", mode: "proposes" },
      { id: "apply-discount", label: "Apply a renewal discount", note: "changes contracted price", mode: "proposes" },
      { id: "write-crm", label: "Write back to the CRM", note: "changes a system of record", mode: "proposes" },
      {
        id: "delete-anything",
        label: "Delete anything in a connected system",
        note: "no agent path exists",
        mode: "blocked",
      },
    ],
  },
];

export const AUTONOMY_MODES: { key: AutonomyMode; label: string; description: string }[] = [
  { key: "automatic", label: "Automatic", description: "runs without asking" },
  { key: "proposes", label: "Proposes", description: "waits for a human" },
  { key: "blocked", label: "Blocked", description: "not available to agents" },
];

export const DECISION_PRINCIPLES = [
  {
    heading: "Reversibility, not importance",
    body: "A trivial irreversible action still asks. An enormous reversible one does not.",
  },
  {
    heading: "Blast radius",
    body: "Anything touching a person outside the company proposes, whatever the channel.",
  },
  {
    heading: "Your permissions, never more",
    body: "An approved action runs with the approver's access. Agents hold none of their own.",
  },
  {
    heading: "Changing a row is logged",
    body: "Autonomy changes appear in the audit log with who changed them and when.",
  },
];
