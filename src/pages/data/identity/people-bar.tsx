import { ID_SEGMENT_CLASS, ID_TONE_CLASS, type IdTone } from "@/pages/data/identity/data";

/** A proportional stacked bar over the customer base, with a legend below (ID03). */
export function PeopleBar({ segments }: { segments: { label: string; count: number; tone: IdTone }[] }) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-3">
      <div className="flex h-3 overflow-hidden rounded-full border border-line">
        {segments.map((s) => (
          <div
            key={s.label}
            className={ID_SEGMENT_CLASS[s.tone]}
            style={{ width: `${(s.count / total) * 100}%` }}
            title={`${s.label} · ${s.count.toLocaleString()}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className={`size-2 shrink-0 rounded-full ${ID_SEGMENT_CLASS[s.tone]}`} aria-hidden />
            <span className="text-[10.5px] text-ink-3">{s.label}</span>
            <span className={`font-mono text-[10.5px] font-semibold ${ID_TONE_CLASS[s.tone]}`}>{s.count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
