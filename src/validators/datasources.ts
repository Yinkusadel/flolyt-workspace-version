import { z } from "zod";

// `configuration` fields are driven per-datasource by GET /datasources/{name}/connection-schema
// (requiredFields/optionalFields), so there's no fixed shape to validate here client-side —
// a dynamic connect-form built against that schema should validate its own required fields.
const configurationSchema = z.record(z.string(), z.unknown());

export const testDatasourceConnectionSchema = z.object({
  datasourceName: z.string().min(1, "Datasource is required"),
  configuration: configurationSchema,
});
export type TestDatasourceConnectionSchemaType = z.infer<typeof testDatasourceConnectionSchema>;

export const connectDatasourceSchema = z.object({
  datasourceName: z.string().min(1, "Datasource is required"),
  connectionName: z.string().min(1, "Connection name is required"),
  configuration: configurationSchema,
});
export type ConnectDatasourceSchemaType = z.infer<typeof connectDatasourceSchema>;

// The API types deletionBatchSize/warnCustomersDeletableThreshold as `null | integer | string`
// (string must match ^-?(?:0|[1-9]\d*)$) — null clears the override back to the global default.
const nullableIntegerSchema = z
  .union([
    z.null(),
    z.number().int(),
    z
      .string()
      .regex(/^-?(?:0|[1-9]\d*)$/, "Must be a whole number"),
  ])
  .nullable();

export const updateDatasourceDeletionConfigSchema = z.object({
  deletionBatchSize: nullableIntegerSchema,
  warnCustomersDeletableThreshold: nullableIntegerSchema,
});
export type UpdateDatasourceDeletionConfigSchemaType = z.infer<
  typeof updateDatasourceDeletionConfigSchema
>;
