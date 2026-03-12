import { z } from 'zod';
import type { TripId, UserId, IsoDate, IsoDateTime, Url } from './branded';
import { IsoDateSchema, UrlSchema } from './branded';

/**
 * Trip-related type definitions
 */

/**
 * Trip interface
 *
 * BRD v1.1: Trips can be dateless (startDate/endDate are optional)
 * - When dates are null, display uses "Day 1, Day 2..." instead
 * - Backend uses displayOrder field for day sequencing
 */
export interface Trip {
  id: TripId;
  name: string;
  description?: string | null;
  startDate: IsoDate | null; // ISO 8601 date string (YYYY-MM-DD) or null for dateless trips
  endDate: IsoDate | null; // ISO 8601 date string (YYYY-MM-DD) or null for dateless trips
  coverImageUrl?: Url;
  ownerId: UserId;
  sharingMode?: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  isPublic?: boolean;
  version?: number;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  deletedAt?: IsoDateTime | null;
  status?: 'planning' | 'upcoming' | 'active' | 'completed' | 'cancelled';
  memberCount?: number; // Total number of members (including owner)
  eventCount?: number; // Total number of events in the trip
}

/**
 * Input type for creating a new trip
 *
 * BRD v1.1: startDate and endDate are optional (dateless trips supported)
 */
export interface CreateTripInput {
  name: string;
  description?: string; // Optional description
  startDate?: string; // Plain string for form input (will be validated to IsoDate) - optional for dateless trips
  endDate?: string; // Plain string for form input (will be validated to IsoDate) - optional for dateless trips
  coverImageUrl?: string; // Plain string for form input (will be validated to Url)
}

/**
 * Input type for updating an existing trip
 */
export interface UpdateTripInput {
  name?: string;
  description?: string;
  startDate?: string; // Plain string for form input (will be validated to IsoDate)
  endDate?: string; // Plain string for form input (will be validated to IsoDate)
  coverImageUrl?: string; // Plain string for form input (will be validated to Url)
}

/**
 * Zod schema for creating a new trip
 *
 * BRD v1.1: startDate and endDate are optional (dateless trips)
 * - If one date is provided, both must be provided
 * - If dates are provided, endDate must be >= startDate
 */
export const createTripSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be 100 characters or less')
      .trim(),
    description: z
      .string()
      .max(500, 'Description must be 500 characters or less')
      .trim()
      .optional()
      .or(z.literal('')),
    startDate: IsoDateSchema.optional().or(z.literal('')),
    endDate: IsoDateSchema.optional().or(z.literal('')),
    coverImageUrl: UrlSchema.optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      // If one date is provided, both must be provided
      const hasStartDate = data.startDate && data.startDate !== '';
      const hasEndDate = data.endDate && data.endDate !== '';
      if (hasStartDate !== hasEndDate) {
        return false;
      }
      return true;
    },
    {
      message: 'Both start date and end date must be provided, or neither',
      path: ['endDate'],
    }
  )
  .refine(
    (data) => {
      // If dates are provided, validate order
      if (
        data.startDate &&
        data.endDate &&
        data.startDate !== '' &&
        data.endDate !== ''
      ) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end >= start;
      }
      return true;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'],
    }
  );

/**
 * Zod schema for updating an existing trip
 */
export const updateTripSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be 100 characters or less')
      .trim()
      .optional(),
    description: z
      .string()
      .max(500, 'Description must be 500 characters or less')
      .trim()
      .optional()
      .or(z.literal('')),
    startDate: IsoDateSchema.optional(),
    endDate: IsoDateSchema.optional(),
    coverImageUrl: UrlSchema.optional().or(z.literal('')).nullable(),
    status: z
      .enum(['planning', 'upcoming', 'active', 'completed', 'cancelled'])
      .optional(),
  })
  .refine(
    (data) => {
      // Only validate date comparison if both dates are provided
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end >= start;
      }
      return true;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'],
    }
  );

/**
 * Type for creating a new trip (inferred from schema)
 */
export type CreateTripDto = z.infer<typeof createTripSchema>;

/**
 * Type for updating an existing trip (inferred from schema)
 */
export type UpdateTripDto = z.infer<typeof updateTripSchema>;

/**
 * Runtime validation schema for Trip objects
 * Used for validating API responses before optimistic updates
 */
export const tripSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  startDate: z
    .string()
    .nullable()
    .transform((val) => (val ? val.slice(0, 10) : val)),
  endDate: z
    .string()
    .nullable()
    .transform((val) => (val ? val.slice(0, 10) : val)),
  coverImageUrl: UrlSchema.optional(),
  ownerId: z.number(),
  sharingMode: z.enum(['PRIVATE', 'SHARED', 'PUBLIC']).optional(),
  isPublic: z.boolean().optional(),
  version: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable().optional(),
  status: z
    .enum(['planning', 'upcoming', 'active', 'completed', 'cancelled'])
    .optional(),
  memberCount: z.number().optional(),
  eventCount: z.number().optional(),
});
