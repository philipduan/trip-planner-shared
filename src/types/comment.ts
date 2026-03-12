import { z } from 'zod';
import type {
  CommentId,
  TripId,
  EventId,
  UserId,
  IsoDateTime,
} from './branded';
import { TripIdSchema, EventIdSchema } from './branded';

/**
 * Comment-related type definitions
 *
 * BRD v1.1: Comments can be on trips OR events
 * All member roles (OWNER, EDITOR, VIEWER) can comment
 */

/**
 * Comment interface
 */
export interface Comment {
  id: CommentId;
  tripId?: TripId; // Either tripId OR eventId must be present
  eventId?: EventId; // Either tripId OR eventId must be present
  content: string;
  authorId: UserId;
  author: {
    id: UserId;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    role?: 'OWNER' | 'EDITOR' | 'VIEWER'; // Author's role in the trip
  };
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

/**
 * Input for creating a comment on a trip
 */
export interface CreateTripCommentInput {
  tripId: string; // Plain string for form input (will be validated to TripId)
  content: string;
}

/**
 * Input for creating a comment on an event
 */
export interface CreateEventCommentInput {
  eventId: string; // Plain string for form input (will be validated to EventId)
  content: string;
}

/**
 * Input for updating a comment
 */
export interface UpdateCommentInput {
  content: string;
}

/**
 * Zod schema for creating a trip comment
 */
export const createTripCommentSchema = z.object({
  tripId: TripIdSchema,
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment must be 2000 characters or less')
    .trim(),
});

/**
 * Zod schema for creating an event comment
 */
export const createEventCommentSchema = z.object({
  eventId: EventIdSchema,
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment must be 2000 characters or less')
    .trim(),
});

/**
 * Zod schema for updating a comment
 */
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment must be 2000 characters or less')
    .trim(),
});

/**
 * Type for creating a trip comment (inferred from schema)
 */
export type CreateTripCommentDto = z.infer<typeof createTripCommentSchema>;

/**
 * Type for creating an event comment (inferred from schema)
 */
export type CreateEventCommentDto = z.infer<typeof createEventCommentSchema>;

/**
 * Type for updating a comment (inferred from schema)
 */
export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;

/**
 * API response for listing comments
 */
export interface CommentsListResponse {
  comments: Comment[];
  total: number;
}

/**
 * API response for a single comment
 */
export interface CommentResponse {
  comment: Comment;
}
