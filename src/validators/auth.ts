import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
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

export const verifyOtpSchema = z.object({
  otp: z.string().min(6, "OTP must be at least 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const resetPasswordSchema = z
  .object({
    recoveryToken: z.string().min(1, "Token is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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
export type SetUserPasswordSchemaType = z.infer<typeof setPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpSchemaType = z.infer<typeof verifyOtpSchema>;
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signInSchema>;
