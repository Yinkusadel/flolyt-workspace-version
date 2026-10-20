import { useNavigate, useSearchParams } from "react-router-dom";

import { RelationshipsList } from "@/pages/relationships/relationships-list";
import { RelationshipDeclare } from "@/pages/relationships/relationship-declare";

/**
 * /relationships, under Data in the user menu. The declare flow lives in the URL
 * (?view=declare) so a refresh and the breadcrumb both land back where the person was. Preview,
 * approval and the detail view come in later steps (docs/datasource-relationships/build-plan.md).
 */
export default function RelationshipsRoute() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  if (searchParams.get("view") === "declare") {
    return (
      <RelationshipDeclare
        onClose={() => setSearchParams({}, { replace: true })}
        onSaved={(mapping) => navigate(`/relationships/${mapping.id}`)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Relationships</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Tell Flolyt how records in one dataset match records in another. Nothing takes effect until
          an administrator previews and approves it.
        </p>
      </div>

      <RelationshipsList onDeclare={() => setSearchParams({ view: "declare" })} />
    </div>
  );
}
