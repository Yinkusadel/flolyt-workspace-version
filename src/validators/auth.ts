import { z } from "zod";

const CODE_REGEX = /^\d{6}$/;
const codeSchema = z
  .string()
  .length(6, "Enter the 6-digit code")
  .regex(CODE_REGEX, "Code must be 6 digits");

export const requestLoginCodeSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const verifyLoginCodeSchema = z.object({
  challengeId: z.string().min(1, "Missing challenge id"),
  code: codeSchema,
});

const PERSONAL_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "icloud.com", "mail.com", "protonmail.com", "zoho.com", "live.com",
  "msn.com", "me.com", "mac.com", "inbox.com", "gmx.com", "gmx.net",
  "rediffmail.com", "ymail.com", "rocketmail.com",
];

export const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .refine((val) => {
      const domain = val.split("@")[1]?.toLowerCase();
      if (!domain) return false;
      // Allow yupmail for testing
      if (domain === "yopmail.com") return true;
      return !PERSONAL_EMAIL_DOMAINS.includes(domain);
    }, "Please sign up with your work email. Personal email providers (Gmail, Yahoo, etc.) aren't supported."),
});

export const confirmRegistrationSchema = z.object({
  otp: codeSchema,
});

export const resendOtpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const acceptInvitationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  description: z.string().min(1, "Description is required"),
  phoneNumber: z.string().optional().nullable(),
  email: z.string().email("Invalid email"),
  jobRole: z.string().min(1, "Job role is required"),
  employeeCountRange: z.string().min(1, "Employee count range is required"),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string(),
  country: z.string().min(1, "Country is required"),
  timeZoneId: z.string().min(1, "Time zone is required"),
  currency: z.string().min(1, "Currency is required"),
  webSite: z
    .string()
    .url("Invalid website URL")
    .refine((val) => {
      try {
        const { hostname } = new URL(val);
        return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(hostname);
      } catch {
        return false;
      }
    }, "Enter a valid domain (e.g. https://example.com)")
    .refine((val) => val !== "https://", {
      message: "Website is required",
    }),
  userId: z.string().min(1, "User ID is required"),
});

export const updateCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),

  brandTone: z.string().nullable().optional(),
  website: z
    .string()
    .url("Invalid website URL")
    .nullable()
    .optional(),

  industry: z.string().nullable().optional(),
  businessModel: z.string().nullable().optional(),
  monetizationModel: z.string().nullable().optional(),
  revenueDriver: z.string().nullable().optional(),
  missionStatement: z.string().nullable().optional(),
  primaryProduct: z.string().nullable().optional(),

  primaryUserActions: z
    .array(z.string())
    .min(1, "At least one user action is required"),

  targetAudience: z.string().nullable().optional(),
  geographicFocus: z.string().nullable().optional(),
  companySize: z.string().nullable().optional(),
});

export type UpdateCompanySchemaType = z.infer<typeof updateCompanySchema>;
export type CreateCompanySchemaType = z.infer<typeof createCompanySchema>;
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type RequestLoginCodeSchemaType = z.infer<typeof requestLoginCodeSchema>;
export type VerifyLoginCodeSchemaType = z.infer<typeof verifyLoginCodeSchema>;
export type ConfirmRegistrationSchemaType = z.infer<typeof confirmRegistrationSchema>;
export type ResendOtpSchemaType = z.infer<typeof resendOtpSchema>;
export type AcceptInvitationSchemaType = z.infer<typeof acceptInvitationSchema>;
