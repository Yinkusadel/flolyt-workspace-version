import type { ChipTone } from "@/components/ui/chip";
import type { RelationshipState } from "@/services/api/datasource-relationships/types";

// Shared by the list, the Declare form and the detail page. Values are the API's own strings.
export const CARDINALITY_LABEL: Record<string, string> = {
  OneToOne: "One to one",
  ManyToOne: "Many to one",
  OneToMany: "One to many",
  ManyToMany: "Many to many",
};

export const STATE_LABEL: Record<RelationshipState, string> = {
  DRAFT: "Draft",
  APPROVED: "Approved",
  DISABLED: "Disabled",
  NEEDS_REVIEW: "Needs review",
};

export const STATE_TONE: Record<RelationshipState, ChipTone> = {
  DRAFT: "neutral",
  APPROVED: "teal",
  DISABLED: "neutral",
  NEEDS_REVIEW: "amber",
};
