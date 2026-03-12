/**
 * Permission system utilities
 * Defines role-based permissions for trip collaboration
 */

import type { MemberRole } from '../types/collaboration';

/**
 * Permission interface defining what actions a user can perform
 */
export interface Permissions {
  canEditTrip: boolean;
  canDeleteTrip: boolean;
  canEditEvents: boolean;
  canDeleteEvents: boolean;
  canUploadMedia: boolean;
  canDeleteMedia: boolean;
  canInviteMembers: boolean;
  canRemoveMembers: boolean;
  canManageRoles: boolean;
  canCommentOnTrip: boolean;
  canCommentOnEvent: boolean;
}

/**
 * Get permissions based on user role
 *
 * Per BRD v1.1 (3-role system):
 * - OWNER: Full access (trip details, events, media, members)
 * - EDITOR (Member Edit): Can create/edit/delete events, upload media, comment
 * - VIEWER (Member Read): Read-only access, can comment only
 *
 * IMPORTANT: Only the media uploader can delete their own media (not even owners)
 *
 * @param role - The user's role in the trip
 * @returns Permissions object defining allowed actions
 */
export function getPermissions(role: MemberRole): Permissions {
  if (role === 'OWNER') {
    return {
      canEditTrip: true,
      canDeleteTrip: true,
      canEditEvents: true,
      canDeleteEvents: true,
      canUploadMedia: true,
      canDeleteMedia: false, // BRD v1.1: Cannot delete member-uploaded media
      canInviteMembers: true,
      canRemoveMembers: true,
      canManageRoles: true,
      canCommentOnTrip: true,
      canCommentOnEvent: true,
    };
  }

  if (role === 'EDITOR') {
    return {
      canEditTrip: false,
      canDeleteTrip: false,
      canEditEvents: true,
      canDeleteEvents: true,
      canUploadMedia: true,
      canDeleteMedia: false, // Can only delete own media (checked separately)
      canInviteMembers: false,
      canRemoveMembers: false,
      canManageRoles: false,
      canCommentOnTrip: true,
      canCommentOnEvent: true,
    };
  }

  // VIEWER permissions
  return {
    canEditTrip: false,
    canDeleteTrip: false,
    canEditEvents: false,
    canDeleteEvents: false,
    canUploadMedia: false,
    canDeleteMedia: false,
    canInviteMembers: false,
    canRemoveMembers: false,
    canManageRoles: false,
    canCommentOnTrip: true,
    canCommentOnEvent: true,
  };
}

/**
 * Check if a user can perform a specific action
 *
 * @param role - The user's role
 * @param action - The action to check
 * @returns Whether the user has permission
 */
export function hasPermission(
  role: MemberRole,
  action: keyof Permissions
): boolean {
  return getPermissions(role)[action];
}

/**
 * Check if a user is the owner of a resource
 */
export function isOwner(role: MemberRole): boolean {
  return role === 'OWNER';
}

/**
 * Check if a user can delete media
 *
 * BRD v1.1 RULE: Only the uploader can delete their own media.
 * Even trip owners CANNOT delete media uploaded by members.
 *
 * @param mediaUploaderId - The ID of the user who uploaded the media
 * @param currentUserId - The current user's ID
 */
export function canDeleteMedia(
  mediaUploaderId: string,
  currentUserId: string
): boolean {
  return mediaUploaderId === currentUserId;
}
