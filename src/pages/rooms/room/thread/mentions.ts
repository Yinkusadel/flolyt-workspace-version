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

export interface MentionRange {
  start: number;
  /** Exclusive. */
  end: number;
  mention: Mentionable;
}

const isWordChar = (char: string | undefined) => !!char && /[\p{L}\p{N}]/u.test(char);

/**
 * The mentions in a draft: every `@Label` that exactly names an agent or person on the Room, longest name first so "Retention
 * analyst" is not read as a shorter name, and not glued onto a longer word. The composer highlights these ranges, deletes
 * them as one unit and swaps them for the stored token when sending, so what is coloured is what is sent as a mention.
 */
export function findMentions(text: string, mentionables: Mentionable[]): MentionRange[] {
  if (!text.includes("@") || mentionables.length === 0) return [];
  const byLength = [...mentionables].sort((a, b) => b.label.length - a.label.length);
  const ranges: MentionRange[] = [];
  let index = text.indexOf("@");
  while (index !== -1) {
    // A mention starts a word: not in the middle of something like an email address.
    if (index === 0 || !isWordChar(text[index - 1])) {
      const hit = byLength.find(
        (mention) => text.startsWith(mention.label, index + 1) && !isWordChar(text[index + 1 + mention.label.length])
      );
      if (hit) {
        const end = index + 1 + hit.label.length;
        ranges.push({ start: index, end, mention: hit });
        index = text.indexOf("@", end);
        continue;
      }
    }
    index = text.indexOf("@", index + 1);
  }
  return ranges;
}
