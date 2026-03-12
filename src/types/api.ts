/**
 * API shape types and endpoint mapping
 *
 * Domain types are in their respective files (auth.ts, trip.ts, etc.)
 * and re-exported from src/index.ts.
 */

import type {
  AuthSignInDto,
  AuthSignUpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  ResendVerificationDto,
  AuthTokenResponse,
  MessageResponse,
  User,
} from './auth';

import type { Trip, CreateTripInput, UpdateTripInput } from './trip';

import type { Event, CreateEventInput, UpdateEventInput } from './event';

import type { Media, PresignedUrlResponse, CreateMediaInput } from './media';

import type {
  Comment,
  CreateTripCommentInput,
  CreateEventCommentInput,
  UpdateCommentInput,
  CommentsListResponse,
} from './comment';

import type {
  MemberRole,
  InviteUserInput,
  MembersListResponse,
  InvitationsListResponse,
  InvitationResponse,
  MemberResponse,
} from './collaboration';

// ============================================================================
// Generic API Response Wrappers
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  ok: boolean;
  statusCode: number;
  data: T;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

/**
 * API error response (matches server HttpExceptionFilter shape)
 */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp?: string;
  path?: string;
  requestId?: string;
}

// ============================================================================
// Endpoint Type Mapping
// ============================================================================

/**
 * Type mapping for API endpoints
 *
 * Usage:
 * ```typescript
 * type LoginRequest = ApiEndpoints['/v1/auth/login']['request'];
 * type LoginResponse = ApiEndpoints['/v1/auth/login']['response'];
 * ```
 */
export interface ApiEndpoints {
  // Authentication
  '/v1/auth/login': {
    request: AuthSignInDto;
    response: AuthTokenResponse;
  };
  '/v1/auth/signup': {
    request: AuthSignUpDto;
    response: MessageResponse;
  };
  '/v1/auth/profile': {
    request: never;
    response: User;
  };
  '/v1/auth/refresh': {
    request: never;
    response: AuthTokenResponse;
  };
  '/v1/auth/verify-email': {
    request: VerifyEmailDto;
    response: MessageResponse;
  };
  '/v1/auth/resend-verification': {
    request: ResendVerificationDto;
    response: MessageResponse;
  };
  '/v1/auth/forgot-password': {
    request: ForgotPasswordDto;
    response: MessageResponse;
  };
  '/v1/auth/reset-password': {
    request: ResetPasswordDto;
    response: MessageResponse;
  };

  // Trips
  '/v1/trips': {
    request: CreateTripInput;
    response: { trip: Trip } | { trips: Trip[]; total: number };
  };
  '/v1/trips/:id': {
    request: UpdateTripInput;
    response: { trip: Trip };
  };

  // Events
  '/v1/trips/:tripId/events': {
    request: CreateEventInput;
    response: { event: Event } | { events: Event[]; total: number };
  };
  '/v1/events/:id': {
    request: UpdateEventInput;
    response: { event: Event };
  };

  // Media
  '/v1/trips/:tripId/media': {
    request: CreateMediaInput;
    response: { media: Media } | { media: Media[]; total: number };
  };
  '/v1/trips/:tripId/media/upload-url': {
    request: { filename: string; contentType: string };
    response: PresignedUrlResponse;
  };

  // Comments
  '/v1/trips/:tripId/comments': {
    request: CreateTripCommentInput;
    response: { comment: Comment } | CommentsListResponse;
  };
  '/v1/events/:eventId/comments': {
    request: CreateEventCommentInput;
    response: { comment: Comment } | CommentsListResponse;
  };
  '/v1/comments/:id': {
    request: UpdateCommentInput;
    response: { comment: Comment };
  };

  // Invitations
  '/v1/trips/:tripId/invitations': {
    request: InviteUserInput;
    response: InvitationResponse | InvitationsListResponse;
  };
  '/v1/invitations': {
    request: never;
    response: InvitationsListResponse;
  };

  // Members
  '/v1/trips/:tripId/members': {
    request: never;
    response: MembersListResponse;
  };
  '/v1/trips/:tripId/members/:memberId': {
    request: { role: MemberRole };
    response: MemberResponse;
  };
}
