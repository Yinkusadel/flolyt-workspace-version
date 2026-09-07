import { z } from "zod";

// slug is a DNS label — lowercase letters, digits, hyphens, 3–63 chars — and is
// accepted once server-side, so validate the shape client-side before spending the call.
const SLUG_REGEX = /^[a-z0-9-]{3,63}$/;
const slugSchema = z
  .string()
  .min(3, "Address must be at least 3 characters")
  .max(63, "Address must be at most 63 characters")
  .regex(SLUG_REGEX, "Use lowercase letters, numbers, and hyphens only");

// The API doc lists webSite as nullable, but the backend team confirmed that's a
// documentation mistake — it's actually required. Enforcing it client-side here
// rather than waiting on a 400 round trip.
//
// zod's built-in .url() delegates to `new URL()`, which silently repairs a missing
// "//" (e.g. "https:example.com" parses as "https://example.com/") instead of
// rejecting it — so it's checked with an explicit regex instead. Requires a
// scheme, "//", and a host with at least one dot (a real domain, not just a label).
const WEBSITE_REGEX =
  /^https?:\/\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+(?::\d+)?(?:[/?#]\S*)?$/i;
const websiteSchema = z
  .string()
  .trim()
  .min(1, "Website is required")
  .regex(WEBSITE_REGEX, "Enter a full URL, e.g. https://example.com");

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  description: z.string().min(1, "Description is required"),
  phoneNumber: z.string().nullable().optional(),
  email: z.string().email("Invalid email"),
  jobRole: z.string().min(1, "Job role is required"),
  employeeCountRange: z.string().min(1, "Employee count range is required"),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().nullable().optional(),
  country: z.string().min(1, "Country is required"),
  timeZoneId: z.string().min(1, "Time zone is required"),
  currency: z.string().min(1, "Currency is required"),
  webSite: websiteSchema,
  // Nullable on the API, but this screen is where the app collects it — the
  // address is claimed at creation time now, not on a later onboarding screen.
  slug: slugSchema,
});

// PUT /identity — unused by onboarding as of 2026-08-26 (the address is now set at
// creation via POST /workspace's own slug field instead), kept for a future
// settings screen that needs to re-address an existing workspace.
export const workspaceIdentitySchema = z.object({
  slug: slugSchema,
});

export const workspaceProfileSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  timeZoneId: z.string().nullable().optional(),
  brandTone: z.string().nullable().optional(),
  website: z.string().url("Invalid website URL").nullable().optional(),
  industry: z.string().nullable().optional(),
  businessModel: z.string().nullable().optional(),
  monetizationModel: z.string().nullable().optional(),
  revenueDriver: z.string().nullable().optional(),
  missionStatement: z.string().nullable().optional(),
  primaryProduct: z.string().nullable().optional(),
  primaryUserActions: z.array(z.string()).optional(),
  targetAudience: z.string().nullable().optional(),
  geographicFocus: z.string().nullable().optional(),
  companySize: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
});

export const declaredMarketSchema = z.object({
  countryCode: z.string().min(1, "Country is required"),
  currencyCode: z.string().nullable().optional(),
});

// The primary market must be one of the declared markets — dropping a market that's
// still primary would leave the fallback pointing nowhere, so this is refused client-side too.
export const workspaceMarketsSchema = z
  .object({
    markets: z.array(declaredMarketSchema).min(1, "At least one market is required"),
    primaryMarketCountry: z.string().min(1, "Primary market is required"),
    reportingCurrency: z.string().nullable().optional(),
    stepUpChallengeId: z.string().uuid().nullable().optional(),
  })
  .refine(
    (values) => values.markets.some((m) => m.countryCode === values.primaryMarketCountry),
    { message: "Primary market must be one of the declared markets", path: ["primaryMarketCountry"] }
  );

export const REVENUE_MODELS = ["consumer", "account_based", "both"] as const;

export const revenueModelSchema = z.object({
  revenueModel: z.enum(REVENUE_MODELS, { errorMap: () => ({ message: "Select a revenue model" }) }),
  stepUpChallengeId: z.string().uuid().nullable().optional(),
});

// Mirrors the server's own refusal rules so the form can show the actual problem
// instead of round-tripping a 400: lapsed boundary must exceed the active window (or
// "slipping" is unreachable), reactivation dormancy must exceed it too (or every repeat
// purchase reads as a return), and a repeat customer needs at least 2 orders.
export const lifecycleThresholdsSchema = z
  .object({
    activeWithinDays: z.coerce.number().int().positive("Must be a positive number of days"),
    slippingWithinDays: z.coerce.number().int().positive("Must be a positive number of days"),
    reactivationDormantDays: z.coerce.number().int().positive().nullable().optional(),
    repeatCustomerOrders: z.coerce.number().int().nullable().optional(),
    repeatCustomerWindowDays: z.coerce.number().int().positive().nullable().optional(),
  })
  .refine((v) => v.slippingWithinDays > v.activeWithinDays, {
    message: "Lapsed after must be greater than Active within",
    path: ["slippingWithinDays"],
  })
  .refine(
    (v) => v.reactivationDormantDays == null || v.reactivationDormantDays > v.activeWithinDays,
    { message: "Must be greater than Active within", path: ["reactivationDormantDays"] }
  )
  .refine((v) => v.repeatCustomerOrders == null || v.repeatCustomerOrders >= 2, {
    message: "A repeat customer needs at least 2 orders",
    path: ["repeatCustomerOrders"],
  });

export const assignMemberRolesSchema = z.object({
  userId: z.string().uuid("Invalid member"),
  functionalRoles: z.array(z.string()).min(1, "Select at least one role"),
});

export const removeMemberRoleSchema = z.object({
  userId: z.string().uuid("Invalid member"),
  functionalRole: z.string().min(1, "Role is required"),
});

export const ONBOARDING_PROGRESS_KINDS = [
  "ViewedStep",
  "ReviewedMapping",
  "AcknowledgedAgents",
  "Finished",
] as const;

export const onboardingProgressSchema = z.object({
  kind: z.enum(ONBOARDING_PROGRESS_KINDS),
  step: z.string().nullable(),
});

export type CreateWorkspaceSchemaType = z.infer<typeof createWorkspaceSchema>;
export type WorkspaceIdentitySchemaType = z.infer<typeof workspaceIdentitySchema>;
export type WorkspaceProfileSchemaType = z.infer<typeof workspaceProfileSchema>;
export type WorkspaceMarketsSchemaType = z.infer<typeof workspaceMarketsSchema>;
export type RevenueModelSchemaType = z.infer<typeof revenueModelSchema>;
export type LifecycleThresholdsSchemaType = z.infer<typeof lifecycleThresholdsSchema>;
export type AssignMemberRolesSchemaType = z.infer<typeof assignMemberRolesSchema>;
export type RemoveMemberRoleSchemaType = z.infer<typeof removeMemberRoleSchema>;
export type OnboardingProgressSchemaType = z.infer<typeof onboardingProgressSchema>;
