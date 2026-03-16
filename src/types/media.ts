import { z } from 'zod';
import type { MediaId, TripId, UserId, S3Url, IsoDateTime } from './branded';
import { S3UrlSchema } from './branded';

/**
 * Media-related type definitions for trip photos and videos
 *
 * Server DTOs (source of truth):
 *   src/media/dto/generate-upload-url.dto.ts
 *   src/media/dto/presigned-url-response.dto.ts
 *   src/media/dto/confirm-upload.dto.ts
 *   src/media/dto/media-response.dto.ts
 *   src/media/trip-media.controller.ts
 */

/**
 * Media types for categorizing uploaded files
 * Domain-level uses uppercase; server DTOs use lowercase
 */
export type MediaType = 'IMAGE' | 'VIDEO';

/**
 * Server-level media type (lowercase, matches backend enum)
 */
export type ServerMediaType = 'image' | 'video';

/**
 * Media file in a trip's gallery (domain type)
 */
export interface Media {
  id: MediaId;
  tripId: TripId;
  filename: string;
  fileUrl: S3Url; // Presigned download URL
  mimeType: string;
  fileSize: number; // bytes
  mediaType: MediaType;
  uploadedBy: UserId; // userId
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  eventId?: string | null;
  width?: number | null;
  height?: number | null;
  durationSeconds?: number | null;
  thumbnailUrl?: string | null;
  version?: number;
}

/**
 * Input for creating media record after S3 upload
 * @deprecated Use ConfirmUploadRequest for the confirm step
 */
export interface CreateMediaInput {
  filename: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  mediaType: MediaType;
}

// ────────────── Upload Flow DTOs (match server exactly) ──────────────

/**
 * Step 1 Request: Generate presigned upload URL
 * Matches server GenerateUploadUrlDto
 * Endpoint: POST /v1/trips/:tripId/media/upload-url
 */
export interface GenerateUploadUrlRequest {
  fileName: string;
  fileType: string; // MIME type
  mediaType: ServerMediaType;
  fileSize: number; // declared size in bytes
  eventId?: string; // optional — associates upload with an event
}

/**
 * Step 1 Response: Presigned upload URL details
 * Matches server PresignedUrlResponseDto
 */
export interface PresignedUrlResponse {
  uploadUrl: string; // Presigned S3 PUT URL (expires in ~15 min)
  s3Key: string; // S3 object key (needed for confirm step)
  mediaId: string; // Server-assigned media ID
  expiresIn: number; // URL expiration in seconds
}

/**
 * Step 2 Request: Confirm upload after S3 PUT
 * Matches server ConfirmUploadDto
 * Endpoint: POST /v1/trips/:tripId/media/confirm
 */
export interface ConfirmUploadRequest {
  s3Key: string; // S3 key from presigned response
  fileName: string;
  fileType: string; // MIME type
  fileSize: number; // actual file size in bytes
  width?: number; // image width in pixels
  height?: number; // image height in pixels
  durationSeconds?: number; // video duration in seconds
}

/**
 * Bulk upload URL request (up to 20 files)
 * Endpoint: POST /v1/trips/:tripId/media/bulk-upload-urls
 */
export interface BulkUploadUrlRequest {
  eventId?: string;
  files: Array<{
    fileName: string;
    fileType: string;
    mediaType: ServerMediaType;
    fileSize: number;
  }>;
}

/**
 * Bulk upload URL response
 */
export interface BulkUploadUrlResponse {
  uploads: PresignedUrlResponse[];
}

/**
 * Bulk confirm request (up to 20 confirmations)
 * Endpoint: POST /v1/trips/:tripId/media/bulk-confirm
 */
export interface BulkConfirmRequest {
  uploads: ConfirmUploadRequest[];
}

/**
 * Bulk confirm response
 */
export interface BulkConfirmResponse {
  succeeded: MediaResponseDto[];
  failed: Array<{ s3Key: string; error: string }>;
}

// ────────────── Response DTOs ──────────────

/**
 * Media response DTO from backend API
 * Matches server MediaResponseDto
 */
export interface MediaResponseDto {
  id: string;
  tripId: string;
  eventId: string | null;
  uploadedByUserId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  mediaType: ServerMediaType;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
  url: string | null; // Presigned download URL
  thumbnailUrl: string | null; // Presigned thumbnail URL
  version: number;
  createdAt: string;
  updatedAt: string;
  /** @deprecated Server now returns `url` instead. Kept for backwards compat. */
  s3Key?: string;
  /** @deprecated Server now returns `thumbnailUrl` instead. Kept for backwards compat. */
  thumbnailS3Key?: string;
}

/**
 * Pagination metadata from backend API
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Paginated media response from backend API
 * Endpoint: GET /v1/trips/:tripId/media
 */
export interface PaginatedMediaResponse {
  data: MediaResponseDto[];
  meta: PaginationMeta;
}

/**
 * Query parameters for listing trip media
 */
export interface TripMediaQueryParams {
  page?: number;
  limit?: number;
  eventId?: string;
  mediaType?: ServerMediaType;
}

// ────────────── Constants ──────────────

/**
 * Allowed image MIME types (matches server allowlist)
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
] as const;

/**
 * Allowed video MIME types (matches server allowlist)
 */
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
] as const;

/**
 * Max file sizes (in bytes) — matches server limits
 */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB (server limit)
export const MAX_VIDEO_SIZE = 30 * 1024 * 1024; // 30MB (server limit)
export const MAX_TRIP_STORAGE = 1024 * 1024 * 1024; // 1GB per trip

/**
 * Raw capture size limits (before compression, client-only)
 */
export const MAX_RAW_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB before compression
export const TARGET_COMPRESSED_SIZE = 5 * 1024 * 1024; // 5MB target after compression

// ────────────── Zod Schemas ──────────────

/**
 * Zod schema for MediaType enum (uppercase domain type)
 */
export const mediaTypeSchema = z.enum(['IMAGE', 'VIDEO']);

/**
 * Zod schema for server media type (lowercase)
 */
export const serverMediaTypeSchema = z.enum(['image', 'video']);

/**
 * Zod schema for creating media record
 */
export const createMediaSchema = z.object({
  filename: z
    .string()
    .min(1, 'Filename is required')
    .max(255, 'Filename must be 255 characters or less'),
  fileUrl: S3UrlSchema,
  mimeType: z
    .string()
    .min(1, 'MIME type is required')
    .max(100, 'MIME type must be 100 characters or less'),
  fileSize: z
    .number()
    .int('File size must be a whole number')
    .positive('File size must be positive'),
  mediaType: mediaTypeSchema,
});

/**
 * Type for creating media (inferred from schema)
 */
export type CreateMediaDto = z.infer<typeof createMediaSchema>;
