import { z } from 'zod';
import type { MediaId, TripId, UserId, S3Url, IsoDateTime } from './branded';
import { S3UrlSchema } from './branded';

/**
 * Media-related type definitions for trip photos and videos
 */

/**
 * Media types for categorizing uploaded files
 */
export type MediaType = 'IMAGE' | 'VIDEO';

/**
 * Media file in a trip's gallery
 */
export interface Media {
  id: MediaId;
  tripId: TripId;
  filename: string;
  fileUrl: S3Url; // S3 URL
  mimeType: string;
  fileSize: number; // bytes
  mediaType: MediaType;
  uploadedBy: UserId; // userId
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  // New optional fields from backend
  eventId?: string | null;
  width?: number | null;
  height?: number | null;
  durationSeconds?: number | null;
  thumbnailUrl?: string | null;
}

/**
 * Input for creating media record after S3 upload
 */
export interface CreateMediaInput {
  filename: string;
  fileUrl: string; // Plain string for form input (will be validated to S3Url)
  mimeType: string;
  fileSize: number;
  mediaType: MediaType;
}

/**
 * Response from presigned URL request
 */
export interface PresignedUrlResponse {
  url: S3Url; // Presigned S3 URL for upload
  fields: Record<string, string>; // Additional fields for S3 form upload
  fileUrl: S3Url; // Final public URL after upload
}

/**
 * Allowed image MIME types
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

/**
 * Allowed video MIME types
 */
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mov',
  'video/quicktime',
  'video/avi',
  'video/x-msvideo',
] as const;

/**
 * Max file sizes (in bytes)
 */
export const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB before compression
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
export const TARGET_COMPRESSED_SIZE = 5 * 1024 * 1024; // 5MB after compression

/**
 * Zod schema for MediaType enum
 */
export const mediaTypeSchema = z.enum(['IMAGE', 'VIDEO']);

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

/**
 * Backend API response types (raw DTOs)
 */

/**
 * Media response DTO from backend API
 */
export interface MediaResponseDto {
  id: string;
  tripId: string;
  eventId: string | null;
  fileName: string;
  fileType: string;
  fileSize: number;
  s3Key: string; // Full S3 URL
  mediaType: 'image' | 'video'; // Lowercase in backend
  uploadedByUserId: number;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
  thumbnailS3Key: string | null; // Full URL or null
  createdAt: string;
  updatedAt: string;
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
 */
export interface PaginatedMediaResponse {
  data: MediaResponseDto[];
  meta: PaginationMeta;
}
