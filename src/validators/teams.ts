import { z } from "zod";

export const USER_ROLES = ["Member", "Lead", "Administrator"] as const;
export type UserRole = (typeof USER_ROLES)[number];
const userRoleSchema = z.enum(USER_ROLES);

export const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().nullable(),
});

export const updateTeamSchema = createTeamSchema;

// stepUpChallengeId nullable — see the note in
// services/api/teams/update-member-roles.ts on why this is presumed step-up gated.
export const updateMemberRolesSchema = z.object({
  roles: z.array(userRoleSchema).min(1, "Select at least one role"),
  stepUpChallengeId: z.string().uuid().nullable().optional(),
});

// Best-effort mirror of common consumer email providers — the backend's actual disallow list
// isn't published, so this only catches the obvious cases and surfaces the rejection inline
// before the request fires rather than waiting on a server error.
const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "mail.com",
  "gmx.com",
  "zoho.com",
  "yandex.com",
]);

const isWorkEmail = (email: string) => {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && !PERSONAL_EMAIL_DOMAINS.has(domain);
};

export const inviteTeamMemberSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .refine(isWorkEmail, "Use a work email — personal providers like Gmail or Yahoo aren't supported"),
  roles: z.array(userRoleSchema).min(1, "Select at least one role"),
  functionalRoles: z.array(z.string()).nullable().optional(),
  stepUpChallengeId: z.string().uuid().nullable().optional(),
});

export const resendTeamInvitationSchema = inviteTeamMemberSchema;

export type CreateTeamSchemaType = z.infer<typeof createTeamSchema>;
export type UpdateTeamSchemaType = z.infer<typeof updateTeamSchema>;
export type UpdateMemberRolesSchemaType = z.infer<typeof updateMemberRolesSchema>;
export type InviteTeamMemberSchemaType = z.infer<typeof inviteTeamMemberSchema>;
export type ResendTeamInvitationSchemaType = z.infer<typeof resendTeamInvitationSchema>;
