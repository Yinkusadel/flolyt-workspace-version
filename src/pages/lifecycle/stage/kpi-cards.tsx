import { cn } from "@/lib/utils";

export type KpiTone = "ink" | "teal" | "amber" | "rose";

export type Kpi = {
  eyebrow: string;
  value: string;
  tone?: KpiTone;
  note?: string;
};

const VALUE_TONE_CLASSES: Record<KpiTone, string> = {
  ink: "text-ink-2",
  teal: "text-teal",
  amber: "text-amber",
  rose: "text-rose",
};

/** The four-card metric row every stage tab opens with (ACQUIRED/AT STAKE/CAC-style cards). */
export function KpiCards({ items }: { items: Kpi[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.eyebrow} className="rounded-card border border-line bg-paper p-4">
          <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
            {item.eyebrow}
          </p>
          <p className={cn("mt-2.5 text-[19px] font-semibold", VALUE_TONE_CLASSES[item.tone ?? "ink"])}>
            {item.value}
          </p>
          {item.note && <p className="mt-1 text-[10px] text-ink-4">{item.note}</p>}
        </div>
      ))}
    </div>
  );
}
