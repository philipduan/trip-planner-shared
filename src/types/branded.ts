import { z } from 'zod';

/**
 * Branded types for improved type safety and code readability
 *
 * This file defines branded types using Zod's brand feature to prevent
 * accidentally mixing different ID types (e.g., using a TripId where a UserId is expected).
 *
 * Benefits:
 * - Compile-time type safety (can't mix different ID types)
 * - Self-documenting code (clear what type of ID is expected)
 * - Better type inference and autocomplete
 * - Runtime validation with Zod schemas
 *
 * @example
 * ```typescript
 * // ✅ Correct usage
 * const userId = createUserId('123e4567-e89b-12d3-a456-426614174000');
 * const trip = getTripsByUser(userId);
 *
 * // ❌ Compile error - can't use TripId where UserId is expected
 * const tripId = createTripId('123e4567-e89b-12d3-a456-426614174001');
 * const trip = getTripsByUser(tripId); // Type error!
 * ```
 */

// ============================================================================
// UUID-based ID Types
// ============================================================================

/**
 * User identifier (UUID)
 */
export const UserIdSchema = z.number().brand<'UserId'>();
export type UserId = z.infer<typeof UserIdSchema>;

/**
 * Trip identifier (UUID)
 */
export const TripIdSchema = z.string().brand<'TripId'>();
export type TripId = z.infer<typeof TripIdSchema>;

/**
 * Event identifier (UUID)
 */
export const EventIdSchema = z.string().brand<'EventId'>();
export type EventId = z.infer<typeof EventIdSchema>;

/**
 * Media identifier (UUID)
 */
export const MediaIdSchema = z.string().brand<'MediaId'>();
export type MediaId = z.infer<typeof MediaIdSchema>;

/**
 * Trip member identifier (UUID)
 */
export const MemberIdSchema = z.string().brand<'MemberId'>();
export type MemberId = z.infer<typeof MemberIdSchema>;

/**
 * Invitation identifier (UUID)
 */
export const InvitationIdSchema = z.string().brand<'InvitationId'>();
export type InvitationId = z.infer<typeof InvitationIdSchema>;

/**
 * Transit identifier (UUID)
 */
export const TransitIdSchema = z.string().brand<'TransitId'>();
export type TransitId = z.infer<typeof TransitIdSchema>;

/**
 * Comment identifier (UUID)
 */
export const CommentIdSchema = z.string().brand<'CommentId'>();
export type CommentId = z.infer<typeof CommentIdSchema>;

// ============================================================================
// Session and Security ID Types
// ============================================================================

/**
 * Session identifier (can be UUID or custom format)
 */
export const SessionIdSchema = z.string().min(1).brand<'SessionId'>();
export type SessionId = z.infer<typeof SessionIdSchema>;

/**
 * CSRF token (string token)
 */
export const CsrfTokenSchema = z.string().min(1).brand<'CsrfToken'>();
export type CsrfToken = z.infer<typeof CsrfTokenSchema>;

/**
 * JWT Access Token
 */
export const AccessTokenSchema = z.string().min(1).brand<'AccessToken'>();
export type AccessToken = z.infer<typeof AccessTokenSchema>;

/**
 * JWT Refresh Token
 */
export const RefreshTokenSchema = z.string().min(1).brand<'RefreshToken'>();
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;

/**
 * Email verification token
 */
export const EmailVerificationTokenSchema = z
  .string()
  .min(1)
  .brand<'EmailVerificationToken'>();
export type EmailVerificationToken = z.infer<
  typeof EmailVerificationTokenSchema
>;

/**
 * Password reset token
 */
export const PasswordResetTokenSchema = z
  .string()
  .min(1)
  .brand<'PasswordResetToken'>();
export type PasswordResetToken = z.infer<typeof PasswordResetTokenSchema>;

// ============================================================================
// Email Type
// ============================================================================

/**
 * Email address (branded for type safety)
 */
export const EmailSchema = z.string().email().brand<'Email'>();
export type Email = z.infer<typeof EmailSchema>;

// ============================================================================
// URL Types
// ============================================================================

/**
 * URL string (branded for type safety)
 *
 * Security: Only allows http: and https: protocols to prevent XSS attacks
 * via javascript:, data:, file: and other dangerous schemes
 */
export const UrlSchema = z
  .string()
  .url()
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return ['https:', 'http:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
    {
      message: 'URL must use http: or https: protocol',
    }
  )
  .brand<'Url'>();
export type Url = z.infer<typeof UrlSchema>;

/**
 * S3 file URL
 */
export const S3UrlSchema = z
  .string()
  .url()
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return ['https:', 'http:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
    {
      message: 'URL must use http: or https: protocol',
    }
  )
  .brand<'S3Url'>();
export type S3Url = z.infer<typeof S3UrlSchema>;

// ============================================================================
// Date and Time Types
// ============================================================================

/**
 * ISO 8601 date string (YYYY-MM-DD)
 */
export const IsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .brand<'IsoDate'>();
export type IsoDate = z.infer<typeof IsoDateSchema>;

/**
 * Time string in HH:mm format (24-hour)
 */
export const TimeStringSchema = z
  .string()
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  .brand<'TimeString'>();
export type TimeString = z.infer<typeof TimeStringSchema>;

/**
 * ISO 8601 datetime string
 */
export const IsoDateTimeSchema = z.string().datetime().brand<'IsoDateTime'>();
export type IsoDateTime = z.infer<typeof IsoDateTimeSchema>;

// ============================================================================
// Helper Functions for Creating Branded Types
// ============================================================================

/**
 * Create a UserId from a string (with validation)
 * @throws ZodError if the string is not a valid UUID
 */
export const createUserId = (id: number): UserId => UserIdSchema.parse(id);

/**
 * Create a TripId from a string (with validation)
 * @throws ZodError if the string is not a valid UUID
 */
export const createTripId = (id: string): TripId => TripIdSchema.parse(id);

/**
 * Create an EventId from a string (with validation)
 * @throws ZodError if the string is not a valid UUID
 */
export const createEventId = (id: string): EventId => EventIdSchema.parse(id);

/**
 * Create a MediaId from a string (with validation)
 * @throws ZodError if the string is not a valid UUID
 */
export const createMediaId = (id: string): MediaId => MediaIdSchema.parse(id);

/**
 * Create a MemberId from a string (with validation)
 * @throws ZodError if the string is not a valid UUID
 */
export const createMemberId = (id: string): MemberId =>
  MemberIdSchema.parse(id);

/**
 * Create an InvitationId from a string (with validation)
 * @throws ZodError if the string is not a valid UUID
 */
export const createInvitationId = (id: string): InvitationId =>
  InvitationIdSchema.parse(id);

/**
 * Create a TransitId from a string (with validation)
 * @throws ZodError if the string is not a valid UUID
 */
export const createTransitId = (id: string): TransitId =>
  TransitIdSchema.parse(id);

/**
 * Create a CommentId from a string (with validation)
 * @throws ZodError if the string is not a valid UUID
 */
export const createCommentId = (id: string): CommentId =>
  CommentIdSchema.parse(id);

/**
 * Create a SessionId from a string (with validation)
 * @throws ZodError if the string is empty
 */
export const createSessionId = (id: string): SessionId =>
  SessionIdSchema.parse(id);

/**
 * Create a CsrfToken from a string (with validation)
 * @throws ZodError if the string is empty
 */
export const createCsrfToken = (token: string): CsrfToken =>
  CsrfTokenSchema.parse(token);

/**
 * Create an AccessToken from a string (with validation)
 * @throws ZodError if the string is empty
 */
export const createAccessToken = (token: string): AccessToken =>
  AccessTokenSchema.parse(token);

/**
 * Create a RefreshToken from a string (with validation)
 * @throws ZodError if the string is empty
 */
export const createRefreshToken = (token: string): RefreshToken =>
  RefreshTokenSchema.parse(token);

/**
 * Create an EmailVerificationToken from a string (with validation)
 * @throws ZodError if the string is empty
 */
export const createEmailVerificationToken = (
  token: string
): EmailVerificationToken => EmailVerificationTokenSchema.parse(token);

/**
 * Create a PasswordResetToken from a string (with validation)
 * @throws ZodError if the string is empty
 */
export const createPasswordResetToken = (token: string): PasswordResetToken =>
  PasswordResetTokenSchema.parse(token);

/**
 * Create an Email from a string (with validation)
 * @throws ZodError if the string is not a valid email
 */
export const createEmail = (email: string): Email => EmailSchema.parse(email);

/**
 * Create a Url from a string (with validation)
 * @throws ZodError if the string is not a valid URL
 */
export const createUrl = (url: string): Url => UrlSchema.parse(url);

/**
 * Create an S3Url from a string (with validation)
 * @throws ZodError if the string is not a valid URL
 */
export const createS3Url = (url: string): S3Url => S3UrlSchema.parse(url);

/**
 * Create an IsoDate from a string (with validation)
 * @throws ZodError if the string is not in YYYY-MM-DD format
 */
export const createIsoDate = (date: string): IsoDate =>
  IsoDateSchema.parse(date);

/**
 * Create a TimeString from a string (with validation)
 * @throws ZodError if the string is not in HH:mm format
 */
export const createTimeString = (time: string): TimeString =>
  TimeStringSchema.parse(time);

/**
 * Create an IsoDateTime from a string (with validation)
 * @throws ZodError if the string is not a valid ISO 8601 datetime
 */
export const createIsoDateTime = (datetime: string): IsoDateTime =>
  IsoDateTimeSchema.parse(datetime);

// ============================================================================
// Safe Helper Functions (return undefined on error)
// ============================================================================

/**
 * Safely create a UserId (returns undefined if invalid)
 */
export const safeCreateUserId = (id: string): UserId | undefined => {
  const result = UserIdSchema.safeParse(id);
  return result.success ? result.data : undefined;
};

/**
 * Safely create a TripId (returns undefined if invalid)
 */
export const safeCreateTripId = (id: string): TripId | undefined => {
  const result = TripIdSchema.safeParse(id);
  return result.success ? result.data : undefined;
};

/**
 * Safely create an EventId (returns undefined if invalid)
 */
export const safeCreateEventId = (id: string): EventId | undefined => {
  const result = EventIdSchema.safeParse(id);
  return result.success ? result.data : undefined;
};

/**
 * Safely create a MediaId (returns undefined if invalid)
 */
export const safeCreateMediaId = (id: string): MediaId | undefined => {
  const result = MediaIdSchema.safeParse(id);
  return result.success ? result.data : undefined;
};

/**
 * Safely create a MemberId (returns undefined if invalid)
 */
export const safeCreateMemberId = (id: string): MemberId | undefined => {
  const result = MemberIdSchema.safeParse(id);
  return result.success ? result.data : undefined;
};

/**
 * Safely create an InvitationId (returns undefined if invalid)
 */
export const safeCreateInvitationId = (
  id: string
): InvitationId | undefined => {
  const result = InvitationIdSchema.safeParse(id);
  return result.success ? result.data : undefined;
};

/**
 * Safely create a CommentId (returns undefined if invalid)
 */
export const safeCreateCommentId = (id: string): CommentId | undefined => {
  const result = CommentIdSchema.safeParse(id);
  return result.success ? result.data : undefined;
};

/**
 * Safely create a SessionId (returns undefined if invalid)
 */
export const safeCreateSessionId = (id: string): SessionId | undefined => {
  const result = SessionIdSchema.safeParse(id);
  return result.success ? result.data : undefined;
};

/**
 * Safely create an Email (returns undefined if invalid)
 */
export const safeCreateEmail = (email: string): Email | undefined => {
  const result = EmailSchema.safeParse(email);
  return result.success ? result.data : undefined;
};

/**
 * Safely create a Url (returns undefined if invalid)
 */
export const safeCreateUrl = (url: string): Url | undefined => {
  const result = UrlSchema.safeParse(url);
  return result.success ? result.data : undefined;
};

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a string is a valid UserId
 */
export const isUserId = (id: number): id is UserId =>
  UserIdSchema.safeParse(id).success;

/**
 * Check if a string is a valid TripId
 */
export const isTripId = (id: string): id is TripId =>
  TripIdSchema.safeParse(id).success;

/**
 * Check if a string is a valid EventId
 */
export const isEventId = (id: string): id is EventId =>
  EventIdSchema.safeParse(id).success;

/**
 * Check if a string is a valid MediaId
 */
export const isMediaId = (id: string): id is MediaId =>
  MediaIdSchema.safeParse(id).success;

/**
 * Check if a string is a valid CommentId
 */
export const isCommentId = (id: string): id is CommentId =>
  CommentIdSchema.safeParse(id).success;

/**
 * Check if a string is a valid Email
 */
export const isEmail = (email: string): email is Email =>
  EmailSchema.safeParse(email).success;

/**
 * Check if a string is a valid Url
 */
export const isUrl = (url: string): url is Url =>
  UrlSchema.safeParse(url).success;

/**
 * Check if a string is a valid IsoDate
 */
export const isIsoDate = (date: string): date is IsoDate =>
  IsoDateSchema.safeParse(date).success;

/**
 * Check if a string is a valid TimeString
 */
export const isTimeString = (time: string): time is TimeString =>
  TimeStringSchema.safeParse(time).success;
