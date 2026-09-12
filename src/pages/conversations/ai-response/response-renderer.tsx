import { useMemo } from "react";

import { parseAgentResponse } from "@/features/ai-conversations/response-parser";
import { AiDataChart } from "./data-chart";
import { AiDataTable } from "./data-table";

// Splits an assistant message's raw text into plain-text / table / chart segments and renders
// each with the right component. Only call this on a finished message — a DATA_TABLE/DATA_CHART
// block still arriving mid-stream would parse as malformed JSON and get silently dropped, then
// pop in once complete; the typewriter's own plain-text render already covers the in-progress case.
export function AiResponseRenderer({ content }: { content: string }) {
  const segments = useMemo(() => parseAgentResponse(content), [content]);

  return (
    // w-full: without a definite width here too, a table/chart segment's max-w-[85%] below has
    // nothing real to resolve against under this shrink-to-fit flex column, and its min-w-max
    // table content can overflow straight past the pane's edge instead of capping at 85%.
    <div className="flex w-full min-w-0 flex-col items-start gap-3">
      {segments.map((segment, idx) => {
        if (segment.type === "text") {
          return (
            <p
              key={idx}
              className="max-w-[85%] min-w-0 text-[12.5px] leading-relaxed wrap-break-word whitespace-pre-wrap text-ink"
            >
              {segment.content}
            </p>
          );
        }
        if (segment.type === "table") {
          return (
            <div key={idx} className="w-full max-w-[85%] min-w-0">
              <AiDataTable data={segment.data} />
            </div>
          );
        }
        return (
          <div key={idx} className="w-full max-w-[85%] min-w-0">
            <AiDataChart data={segment.data} />
          </div>
        );
      })}
    </div>
  );
}
