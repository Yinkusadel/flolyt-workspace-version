export type SparklineSeries = {
  points: { x: number; y: number | null }[];
  toneClass: string;
};

function buildPath(points: { x: number; y: number }[]): string {
  return points.map((p, index) => `${index === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

/**
 * A compact multi-line curve with optional dashed reference lines — no charting library in this
 * project, and several lifecycle endpoints are explicit that a curve, not one collapsed number, is
 * the point (Unit economics' payback curve, Repeat curve's return-probability curve, etc.).
 */
export function Sparkline({
  series,
  referenceLines = [],
  width = 120,
  height = 32,
  emptyLabel = "No curve yet",
}: {
  series: SparklineSeries[];
  referenceLines?: { y: number; toneClass?: string }[];
  width?: number;
  height?: number;
  emptyLabel?: string;
}) {
  const pad = 3;
  const usable = series.map((s) => ({ ...s, points: s.points.filter((p) => p.y !== null) as { x: number; y: number }[] }));
  const allPoints = usable.flatMap((s) => s.points);
  if (allPoints.length === 0) return <span className="font-mono text-[10px] text-ink-4">{emptyLabel}</span>;

  const xs = allPoints.map((p) => p.x);
  const ys = [...allPoints.map((p) => p.y), ...referenceLines.map((r) => r.y), 0];
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const domainMax = Math.max(...ys);
  const domainMin = Math.min(...ys);
  const xSpan = maxX - minX || 1;
  const ySpan = domainMax - domainMin || 1;

  const scaleX = (x: number) => pad + ((x - minX) / xSpan) * (width - 2 * pad);
  const scaleY = (y: number) => height - pad - ((y - domainMin) / ySpan) * (height - 2 * pad);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {referenceLines.map((line, index) => (
        <line
          key={index}
          x1={pad}
          x2={width - pad}
          y1={scaleY(line.y)}
          y2={scaleY(line.y)}
          className={line.toneClass ?? "stroke-ink-4"}
          strokeWidth={1}
          strokeDasharray="2,2"
        />
      ))}
      {usable.map((s, index) =>
        s.points.length > 0 ? (
          <path key={index} d={buildPath(s.points.map((p) => ({ x: scaleX(p.x), y: scaleY(p.y) })))} className={s.toneClass} fill="none" strokeWidth={1.5} />
        ) : null
      )}
    </svg>
  );
}
