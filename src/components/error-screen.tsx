import * as React from "react";

import { cn } from "@/lib/utils";
import flolytLogo from "../../assets/logo.png";

export type ErrorScreenProps = {
  title: string;
  description: string;
  /** Dev-only detail (stack trace, status text) — never shown in production. */
  detail?: string;
  actions?: React.ReactNode;
  className?: string;
};

function ErrorScreen({ title, description, detail, actions, className }: ErrorScreenProps) {
  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col items-center justify-center gap-6 bg-paper px-6 text-center",
        className
      )}
    >
      <img src={flolytLogo} alt="Flolyt" className="size-page shrink-0 object-contain" />

      <div className="max-w-sm space-y-1.5">
        <h1 className="text-base font-semibold text-ink">{title}</h1>
        <p className="text-[13px] text-ink-3">{description}</p>
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}

      {detail && (
        <pre className="max-w-lg overflow-x-auto rounded-panel border border-line bg-paper-2 px-3 py-2 text-left font-mono text-[10.5px] whitespace-pre-wrap text-ink-3">
          {detail}
        </pre>
      )}
    </div>
  );
}

export { ErrorScreen };
