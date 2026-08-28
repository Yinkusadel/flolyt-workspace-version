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

export const inviteTeamMemberSchema = z.object({
  email: z.string().email("Invalid email"),
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
