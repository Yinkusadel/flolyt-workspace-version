import { z } from "zod";

export const RELATIONSHIP_MEANINGS = ["Reference", "Identity"] as const;
export const RELATIONSHIP_CARDINALITIES = ["OneToOne", "ManyToOne", "OneToMany", "ManyToMany"] as const;
// Identity asserts the same subject and grain on both sides, so the doc allows only these two.
export const IDENTITY_CARDINALITIES: readonly string[] = ["OneToOne", "ManyToOne"];

export const MAX_KEY_COLUMNS = 8;
export const MAX_EVIDENCE = 20;

const keyColumnsSchema = z
  .array(z.string().min(1))
  .min(1, "Choose at least one key column")
  .max(MAX_KEY_COLUMNS, `Use at most ${MAX_KEY_COLUMNS} key columns`)
  .refine((columns) => new Set(columns).size === columns.length, "Each key column can be used once");

// The declare and edit form, including the optional bridge table (the API's `crosswalk`). Datasets are held as the catalog key
// `datasourceId::datasetId` and resolved back to a full scope when the payload is built, so the
// form never carries a UUID the user could mistype. Same subject and grain for Identity is left to
// the backend: it needs the catalog, and the backend's validationIssues are shown inline.
export const declareRelationshipSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    meaning: z.enum(RELATIONSHIP_MEANINGS, { errorMap: () => ({ message: "Choose a meaning" }) }),
    cardinality: z.enum(RELATIONSHIP_CARDINALITIES, {
      errorMap: () => ({ message: "Choose how many rows sit on each side" }),
    }),
    fromDataset: z.string().min(1, "Choose the dataset the link starts from"),
    fromKeyColumns: keyColumnsSchema,
    toDataset: z.string().min(1, "Choose the dataset the link points to"),
    toKeyColumns: keyColumnsSchema,
    // The optional bridge table. Each bridge side must line up with its own endpoint's key columns;
    // the two endpoints may then differ in count and type.
    bridgeEnabled: z.boolean(),
    bridgeDataset: z.string(),
    bridgeFromColumns: z.array(z.string()).max(MAX_KEY_COLUMNS, `Use at most ${MAX_KEY_COLUMNS} bridge columns`),
    bridgeToColumns: z.array(z.string()).max(MAX_KEY_COLUMNS, `Use at most ${MAX_KEY_COLUMNS} bridge columns`),
    evidence: z
      .array(z.string())
      .min(1, "Add at least one piece of evidence")
      .max(MAX_EVIDENCE, `Use at most ${MAX_EVIDENCE} pieces of evidence`)
      .refine((items) => items.every((item) => item.trim().length > 0), "Fill in or remove empty evidence lines"),
  })
  .superRefine((values, ctx) => {
    if (values.bridgeEnabled) {
      if (!values.bridgeDataset) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["bridgeDataset"], message: "Choose the bridge dataset" });
      }

      const checkBridge = (
        columns: string[],
        path: "bridgeFromColumns" | "bridgeToColumns",
        expected: number,
        side: string
      ) => {
        if (columns.length === 0) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message: "Choose at least one bridge column" });
        } else if (new Set(columns).size !== columns.length) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message: "Each bridge column can be used once" });
        } else if (columns.length !== expected) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [path],
            message: `Choose ${expected} bridge column${expected === 1 ? "" : "s"} to match the ${side} key columns`,
          });
        }
      };
      checkBridge(values.bridgeFromColumns, "bridgeFromColumns", values.fromKeyColumns.length, "From");
      checkBridge(values.bridgeToColumns, "bridgeToColumns", values.toKeyColumns.length, "To");
    } else if (values.fromKeyColumns.length !== values.toKeyColumns.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toKeyColumns"],
        message: "Both sides need the same number of key columns",
      });
    }

    if (values.meaning === "Identity" && !IDENTITY_CARDINALITIES.includes(values.cardinality)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardinality"],
        message: "An identity relationship can only be one to one or many to one",
      });
    }
  });

export type DeclareRelationshipValues = z.infer<typeof declareRelationshipSchema>;
