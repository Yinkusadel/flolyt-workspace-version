import { DEPARTMENT_COLORS, type Department } from "@/pages/lifecycle/data";

/** A colored dot + label used for routing-rule "goes to" team identity (I07/I08) — reuses the same department palette as human avatars. */
export function TeamDot({ team }: { team: Department }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: DEPARTMENT_COLORS[team] }} aria-hidden />
      <span className="text-ink-2">{team}</span>
    </span>
  );
}
