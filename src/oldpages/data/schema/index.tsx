import { SCHEMA_STATE } from "@/oldpages/data/schema/data";
import { NothingMappedState } from "@/oldpages/data/schema/states/nothing-mapped";
import { FirstFieldMappedState } from "@/oldpages/data/schema/states/first-field-mapped";
import { FieldsState } from "@/oldpages/data/schema/states/fields";

/**
 * SM01/02/03 — all share /schema, branching on SCHEMA_STATE. SM01/SM02 are
 * wired but unreachable with the default "full" state, same "not wired, no
 * demo state currently triggers it" situation as every prior rebuild's
 * empty/first states.
 */
const Schema = () => {
  if (SCHEMA_STATE === "empty") return <NothingMappedState />;
  if (SCHEMA_STATE === "first") return <FirstFieldMappedState />;
  return <FieldsState />;
};

export default Schema;
