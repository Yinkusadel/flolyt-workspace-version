import { useParams } from "react-router-dom";

import { usePageBreadcrumb } from "@/components/breadcrumb-context";

export default function ConversationDetailRoute() {
  const { id } = useParams();

  usePageBreadcrumb([{ label: "New conversation", to: "/new-conversation" }, { label: "Conversation" }]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-panel border border-line bg-paper-2 px-6 py-10 text-center">
        <p className="text-[13px] font-medium text-ink">Conversation view is coming soon</p>
        <p className="mt-1.5 text-[11.5px] text-ink-3">
          This thread will render here once the chat surface is wired up.
        </p>
        <p className="mt-3 font-mono text-[10px] text-ink-4">{id}</p>
      </div>
    </div>
  );
}
