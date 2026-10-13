/** Someone or something a message can address: an agent on the Room, or a person in it. */
export interface Mentionable {
  kind: "agent" | "human";
  /** The agent key or the person's user id: what goes into the stored token. */
  id: string;
  /** What the chip and the `@` picker show. */
  label: string;
  role: string;
}

/** The text stored in the message: `@[agent:<key>]` or `@[human:<userId>]`. A typed `@Name` alone is NOT a mention. */
export const mentionToken = (mention: Pick<Mentionable, "kind" | "id">) => `@[${mention.kind}:${mention.id}]`;

export const MENTION_PATTERN = /@\[(agent|human):([^\]]+)\]/g;
