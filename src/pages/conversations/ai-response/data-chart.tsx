import { useId } from "react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

import { downloadChartPng, downloadJson } from "@/lib/chart-and-table-exports";
import { formatCompactCount, formatCompactMoney } from "@/lib/format-measured-value";
import type { DataChartPayload } from "@/features/ai-conversations/response-parser";
import { ResponseCta } from "./response-cta";

// Validated for CVD-safe adjacent-pair separation (dataviz skill's validate_palette.js) — Flolyt's
// own status-tinted tokens (teal/amber/rose) read too close to gray at chart chroma, so this is a
// dedicated, punchier categorical set anchored on the app's ultra-blue as slot 1.
const CATEGORICAL_PALETTE = ["#4c5fd5", "#eb6834", "#1baf7a", "#eda100", "#e34948"];
const SEQUENTIAL_HUE = "#4c5fd5";

function formatValue(value: number, currency?: string): string {
  return currency ? formatCompactMoney(value, currency) : formatCompactCount(value);
}

function ChartTooltip({ active, payload, currency }: TooltipContentProps & { currency?: string }) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  const name = (point.payload as { name?: string } | undefined)?.name ?? point.name;
  return (
    <div className="rounded-panel border border-line bg-paper px-3 py-2 text-[11px] shadow-md">
      <p className="font-medium text-ink">{name}</p>
      <p className="text-ink-3">{formatValue(Number(point.value), currency)}</p>
    </div>
  );
}

export function AiDataChart({ data }: { data: DataChartPayload }) {
  // useId() includes colons (e.g. ":r0:"), invalid inside an SVG url(#id) gradient reference.
  const chartId = `chart-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const isCategorical = data.type === "pie" || data.type === "donut";
  const points = data.labels.map((name, idx) => ({ name, value: data.values[idx] ?? 0 }));

  const handleDownloadPng = async () => {
    try {
      await downloadChartPng(chartId, data.title);
    } catch {
      toast.error("Couldn't export chart image");
    }
  };

  return (
    <div id={chartId} className="group max-w-full min-w-0 overflow-hidden rounded-card border border-line bg-paper p-3.5">
      <div className="mb-2 flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-[11.5px] font-semibold text-ink-3">{data.title}</span>
        <div data-chart-export-ignore="true">
          <ResponseCta
            onCopy={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
            onDownloadJson={() => downloadJson(data.title, data)}
            onDownloadPng={handleDownloadPng}
          />
        </div>
      </div>

      {/* Literal hex, not the bg-paper token — html-to-image's PNG export can otherwise paint
          an unresolved-custom-property gray behind the SVG instead of leaving it white. */}
      <div style={{ background: "#fbfbfc" }}>
        <ResponsiveContainer width="100%" height={200}>
          {data.type === "bar" ? (
            <BarChart data={points} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--color-ink-4)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-ink-4)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={44}
                tickFormatter={(value) => formatValue(Number(value), data.currency)}
              />
              <Tooltip content={(props) => <ChartTooltip {...props} currency={data.currency} />} cursor={{ fill: "var(--color-paper-2)" }} />
              <Bar dataKey="value" fill={SEQUENTIAL_HUE} radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          ) : data.type === "line" ? (
            <AreaChart data={points} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id={`${chartId}-fill`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={SEQUENTIAL_HUE} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={SEQUENTIAL_HUE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--color-ink-4)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-ink-4)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={44}
                tickFormatter={(value) => formatValue(Number(value), data.currency)}
              />
              <Tooltip content={(props) => <ChartTooltip {...props} currency={data.currency} />} cursor={{ stroke: "var(--color-line)" }} />
              <Area type="monotone" dataKey="value" stroke={SEQUENTIAL_HUE} strokeWidth={2} fill={`url(#${chartId}-fill)`} />
            </AreaChart>
          ) : (
            <PieChart>
              <Tooltip content={(props) => <ChartTooltip {...props} currency={data.currency} />} />
              <Pie
                data={points}
                dataKey="value"
                nameKey="name"
                innerRadius={data.type === "donut" ? "62%" : 0}
                outerRadius="85%"
                paddingAngle={2}
                stroke="var(--color-paper)"
                strokeWidth={2}
              >
                {points.map((_, idx) => (
                  <Cell key={idx} fill={CATEGORICAL_PALETTE[idx % CATEGORICAL_PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Text-visible legend — required relief for the two categorical hues (aqua/yellow) that
          sit under 3:1 contrast against the surface on their own (dataviz skill palette check),
          and doubles as an accessible table view of the chart's own values. */}
      <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 border-t border-line pt-3 sm:grid-cols-2">
        {points.map((point, idx) => (
          <div key={point.name} className="flex min-w-0 items-center gap-2 text-[11px]">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: isCategorical ? CATEGORICAL_PALETTE[idx % CATEGORICAL_PALETTE.length] : SEQUENTIAL_HUE }}
            />
            <span className="min-w-0 flex-1 truncate text-ink-3">{point.name}</span>
            <span className="shrink-0 font-medium text-ink">{formatValue(point.value, data.currency)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
