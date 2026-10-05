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

export interface NavLinkPayload {
  label: string;
  route: string;
  description?: string;
}

export type ResponseSegment =
  | { type: "text"; content: string }
  | { type: "table"; data: DataTablePayload }
  | { type: "chart"; data: DataChartPayload }
  | { type: "nav_link_group"; data: NavLinkPayload[] };

// Backend embeds structured blocks inline in assistant message text as HTML-comment-wrapped
// JSON, e.g. <!--[DATA_TABLE]{...}[/DATA_TABLE]--> or <!--[NAV_LINK]{...}[/NAV_LINK]-->. Split
// the raw text into a stream of plain text / table / chart / nav-link segments so each can be
// rendered with the right component.
const BLOCK_PATTERN = /<!--\[(DATA_TABLE|DATA_CHART|NAV_LINK)\]([\s\S]*?)\[\/\1\]-->/g;

export function parseAgentResponse(rawText: string): ResponseSegment[] {
  const rawSegments: (ResponseSegment | { type: "nav_link"; data: NavLinkPayload })[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  BLOCK_PATTERN.lastIndex = 0;
  while ((match = BLOCK_PATTERN.exec(rawText)) !== null) {
    const before = rawText.slice(lastIndex, match.index).trim();
    if (before) rawSegments.push({ type: "text", content: before });

    try {
      const data = JSON.parse(match[2]);
      if (match[1] === "DATA_TABLE") rawSegments.push({ type: "table", data });
      else if (match[1] === "DATA_CHART") rawSegments.push({ type: "chart", data });
      else rawSegments.push({ type: "nav_link", data });
    } catch {
      // Malformed block JSON — drop the block rather than leaking raw markup into the chat.
    }

    lastIndex = match.index + match[0].length;
  }

  const remaining = rawText.slice(lastIndex).trim();
  if (remaining) rawSegments.push({ type: "text", content: remaining });

  // Consecutive NAV_LINK blocks (the backend always emits them back-to-back) collapse into one
  // nav_link_group segment so the renderer can lay them out as a card grid instead of a text-like
  // stack of single links.
  const segments: ResponseSegment[] = [];
  let navBuffer: NavLinkPayload[] = [];
  for (const seg of rawSegments) {
    if (seg.type === "nav_link") {
      navBuffer.push(seg.data);
      continue;
    }
    if (navBuffer.length) {
      segments.push({ type: "nav_link_group", data: navBuffer });
      navBuffer = [];
    }
    segments.push(seg);
  }
  if (navBuffer.length) segments.push({ type: "nav_link_group", data: navBuffer });

  return segments;
}
