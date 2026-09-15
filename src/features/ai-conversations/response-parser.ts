export interface DataTablePayload {
  title: string;
  columns: string[];
  rows: string[][];
  totalCount?: number;
}

export interface DataChartPayload {
  title: string;
  type: "bar" | "pie" | "donut" | "line";
  labels: string[];
  values: number[];
  currency?: string;
}

export type ResponseSegment =
  | { type: "text"; content: string }
  | { type: "table"; data: DataTablePayload }
  | { type: "chart"; data: DataChartPayload };

// Backend embeds structured blocks inline in assistant message text as HTML-comment-wrapped
// JSON, e.g. <!--[DATA_TABLE]{...}[/DATA_TABLE]-->. Split the raw text into a stream of plain
// text / table / chart segments so each can be rendered with the right component.
const BLOCK_PATTERN = /<!--\[(DATA_TABLE|DATA_CHART)\]([\s\S]*?)\[\/\1\]-->/g;

export function parseAgentResponse(rawText: string): ResponseSegment[] {
  const segments: ResponseSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  BLOCK_PATTERN.lastIndex = 0;
  while ((match = BLOCK_PATTERN.exec(rawText)) !== null) {
    const before = rawText.slice(lastIndex, match.index).trim();
    if (before) segments.push({ type: "text", content: before });

    try {
      const data = JSON.parse(match[2]);
      if (match[1] === "DATA_TABLE") segments.push({ type: "table", data });
      else segments.push({ type: "chart", data });
    } catch {
      // Malformed block JSON — drop the block rather than leaking raw markup into the chat.
    }

    lastIndex = match.index + match[0].length;
  }

  const remaining = rawText.slice(lastIndex).trim();
  if (remaining) segments.push({ type: "text", content: remaining });

  return segments;
}
