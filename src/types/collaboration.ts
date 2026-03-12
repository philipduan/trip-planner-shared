import { z } from 'zod';
import type {
  MemberId,
  TripId,
  UserId,
  InvitationId,
  Email,
  IsoDate,
  IsoDateTime,
  Url,
} from './branded';
import { EmailSchema } from './branded';

/**
 * Collaboration-related type definitions
 */

/**
 * Member role type (BRD v1.1: 3-role system)
 * - OWNER: Full access (trip details, events, media, members)
 * - EDITOR: Can create/edit events, upload media, comment (but not manage trip/members)
 * - VIEWER: Read-only access, can comment only
 */
export type MemberRole = 'OWNER' | 'EDITOR' | 'VIEWER';

/**
 * Invitation status type
 */
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';

/**
 * User information embedded in trip member
 */
export interface MemberUser {
  id: UserId;
  email: Email;
  firstName: string;
  lastName: string;
  avatarUrl?: Url;
}

/**
 * Trip member interface
 */
export interface TripMember {
  id: MemberId;
  tripId: TripId;
  userId: UserId;
  role: MemberRole;
  joinedAt: IsoDateTime; // ISO 8601 date string
  user: MemberUser;
}

/**
 * Invitation interface
 */
export interface Invitation {
  id: InvitationId;
  tripId: TripId;
  email: Email;
  role: MemberRole;
  status: InvitationStatus;
  invitedBy: UserId;
  createdAt: IsoDateTime; // ISO 8601 date string
  expiresAt: IsoDateTime; // ISO 8601 date string
  trip?: {
    id: TripId;
    name: string;
    destination: string;
    startDate: IsoDate;
    endDate: IsoDate;
  };
}

/**
 * Input type for inviting a user
 */
export interface InviteUserInput {
  email: string; // Plain string for form input (will be validated to Email)
  role?: MemberRole; // Optional, defaults to 'VIEWER'
}

/**
 * Zod schema for inviting a user
 */
export const inviteUserSchema = z.object({
  email: EmailSchema,
  role: z.enum(['EDITOR', 'VIEWER']).optional().default('VIEWER'),
});

/**
 * Type for inviting a user (inferred from schema)
 */
export type InviteUserDto = z.infer<typeof inviteUserSchema>;

/**
 * API response for listing trip members
 */
export interface MembersListResponse {
  members: TripMember[];
  total: number;
}

/**
 * API response for listing invitations
 */
export interface InvitationsListResponse {
  invitations: Invitation[];
  total: number;
}

/**
 * API response for a single invitation
 */
export interface InvitationResponse {
  invitation: Invitation;
}

/**
 * API response for a single member
 */
export interface MemberResponse {
  member: TripMember;
}
