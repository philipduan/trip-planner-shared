import { z } from 'zod';
import type { EventId, TripId, TransitId, IsoDateTime } from './branded';
import { EventIdSchema, IsoDateSchema, TimeStringSchema } from './branded';

/**
 * Event-related type definitions for itinerary management
 *
 * CRITICAL: Timezone-agnostic time handling
 * - Times are stored as "HH:mm" strings (e.g., "14:30")
 * - Dates are stored as "YYYY-MM-DD" strings (e.g., "2025-12-15")
 * - All times are treated as local time at the destination
 * - NO timezone conversion based on user's location
 */

/**
 * Event types for categorizing itinerary items
 * DEPRECATED: Backend no longer supports event types
 * Kept for backwards compatibility but will be removed
 */
export type EventType =
  | 'FLIGHT'
  | 'HOTEL'
  | 'RESTAURANT'
  | 'ACTIVITY'
  | 'OTHER';

/**
 * Transport methods for transit between events
 * Mirrors server TransportMethod enum in transits.entity.ts
 */
export type TransportMethod =
  | 'WALK'
  | 'BUS'
  | 'TRAIN'
  | 'TAXI'
  | 'DRIVE'
  | 'PLANE'
  | 'BOAT'
  | 'OTHER';

/**
 * Transit information between consecutive events
 * Mirrors server TransitResponseDto
 */
export interface Transit {
  id: TransitId;
  eventId: EventId; // The event this transit leads TO
  transportMethod: TransportMethod;
  departureLocation?: string | null;
  arrivalLocation?: string | null;
  departureTime?: IsoDateTime | null;
  arrivalTime?: IsoDateTime | null;
  bookingReference?: string | null;
  notes?: string | null;
  estimatedDurationMinutes?: number | null;
  version: number;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

/**
 * Event in a trip's itinerary
 *
 * IMPORTANT: This matches the backend EventResponseDto schema
 * Backend uses ISO datetime strings for startTime/endTime (not separate date/time fields)
 *
 * BRD v1.1 Changes:
 * - startTime is now optional (events can exist without specific times)
 * - location is now required (but can be placeholder "TBD" using locationPending flag)
 * - locationPending indicates if location is temporary placeholder
 */
export interface Event {
  id: EventId;
  tripId: TripId;
  title: string;
  description?: string | null;
  startTime?: IsoDateTime | null; // ISO datetime string (e.g., "2025-07-05T14:00:00Z") - optional per BRD v1.1
  endTime?: IsoDateTime | null; // ISO datetime string (e.g., "2025-07-05T17:00:00Z")
  location?: string | null; // Optional in backend but required per BRD v1.1
  notes?: string | null; // Additional notes/instructions
  locationPending: boolean; // True if location is a temporary placeholder (e.g., "TBD")
  displayOrder: number; // Display order within the day (for sorting)
  version: number; // Entity version for optimistic locking
  googleMapsUrl?: string | null; // Google Maps link for the event location
  webUrl?: string | null; // Website link for the event
  dayNumber?: number | null; // For dateless trips: 1-based day grouping (Day 1, Day 2...)
  mediaCount?: number; // Number of media files attached to this event
  commentCount?: number; // Number of comments on this event
  hasTransit?: boolean; // Whether this event has transit information
  transit?: Transit; // Transit TO this event from previous event (loaded separately)
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  deletedAt?: IsoDateTime | null;
}

/**
 * Input for creating a new event
 *
 * IMPORTANT: This matches the backend CreateEventDto schema
 * Backend expects ISO datetime strings for startTime/endTime (e.g., "2025-07-05T14:00:00Z")
 * Frontend must combine date + time fields into ISO datetime before sending
 *
 * BRD v1.1: startTime is optional, location is required
 */
export interface CreateEventInput {
  title: string;
  description?: string;
  startTime?: string; // ISO datetime string (e.g., "2025-07-05T14:00:00Z") - optional per BRD v1.1
  endTime?: string; // ISO datetime string (e.g., "2025-07-05T17:00:00Z")
  location?: string; // Optional in backend but required per BRD v1.1 - use "TBD" if unknown
  notes?: string; // Additional notes/instructions for the event
  locationPending?: boolean; // True if location is a temporary placeholder (e.g., "TBD")
  displayOrder?: number; // Display order within the day (auto-assigned by backend if not provided)
  dayNumber?: number; // For dateless trips: 1-based day grouping
  googleMapsUrl?: string | null; // Google Maps link for the event location
  webUrl?: string | null; // Website link for the event
}

/**
 * Input for updating an existing event
 *
 * IMPORTANT: This matches the backend UpdateEventDto schema
 * All fields are optional (partial update)
 * Backend expects ISO datetime strings for startTime/endTime
 */
export interface UpdateEventInput {
  title?: string;
  description?: string;
  startTime?: string; // ISO datetime string (e.g., "2025-07-05T14:00:00Z") - can be null to remove time
  endTime?: string; // ISO datetime string (e.g., "2025-07-05T17:00:00Z")
  location?: string; // Can be updated to change placeholder
  notes?: string; // Additional notes/instructions
  locationPending?: boolean; // Can toggle placeholder status
  dayNumber?: number; // For dateless trips: 1-based day grouping
  googleMapsUrl?: string | null; // Google Maps link for the event location
  webUrl?: string | null; // Website link for the event
}

/**
 * Input for creating transit information
 * Mirrors server CreateTransitDto (eventId is a path param, not in body)
 */
export interface CreateTransitInput {
  transportMethod: TransportMethod;
  departureLocation?: string;
  arrivalLocation?: string;
  departureTime?: string; // ISO datetime string
  arrivalTime?: string; // ISO datetime string
  bookingReference?: string;
  notes?: string;
  estimatedDurationMinutes?: number;
}

/**
 * Input for updating transit information
 * All fields optional (partial update)
 */
export interface UpdateTransitInput {
  transportMethod?: TransportMethod;
  departureLocation?: string;
  arrivalLocation?: string;
  departureTime?: string; // ISO datetime string
  arrivalTime?: string; // ISO datetime string
  bookingReference?: string;
  notes?: string;
  estimatedDurationMinutes?: number;
}

/**
 * Zod schema for EventType enum
 * DEPRECATED: Backend no longer supports event types
 */
export const eventTypeSchema = z.enum([
  'FLIGHT',
  'HOTEL',
  'RESTAURANT',
  'ACTIVITY',
  'OTHER',
]);

/**
 * Zod schema for TransportMethod enum
 * Mirrors server TransportMethod enum
 */
export const transportMethodSchema = z.enum([
  'WALK',
  'BUS',
  'TRAIN',
  'TAXI',
  'DRIVE',
  'PLANE',
  'BOAT',
  'OTHER',
]);

/**
 * Zod schema for creating a new event
 *
 * BRD v1.1:
 * - startTime is optional (events can exist without times)
 * - location is required (use "TBD" if unknown)
 * - endTime can only be set if startTime is provided
 *
 * NOTE: This schema validates the FORM-level fields (date, time as HH:mm)
 * The action handler combines date + time into ISO datetime before sending to backend
 */
export const createEventSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be 200 characters or less')
      .trim(),
    description: z
      .string()
      .max(2000, 'Description must be 2000 characters or less')
      .trim()
      .optional()
      .or(z.literal('')),
    date: IsoDateSchema,
    startTime: TimeStringSchema.optional().or(z.literal('')),
    endTime: TimeStringSchema.optional().or(z.literal('')),
    location: z
      .string()
      .min(1, 'Location is required')
      .max(500, 'Location must be 500 characters or less')
      .trim(),
    locationPending: z.boolean().optional(),
    dayNumber: z.number().int().positive().optional(),
    notes: z
      .string()
      .max(1000, 'Notes must be 1000 characters or less')
      .trim()
      .optional()
      .or(z.literal('')),
    googleMapsUrl: z
      .string()
      .url('Must be a valid URL')
      .max(2000, 'URL must be 2000 characters or less')
      .optional()
      .or(z.literal(''))
      .nullable(),
    webUrl: z
      .string()
      .url('Must be a valid URL')
      .max(2000, 'URL must be 2000 characters or less')
      .optional()
      .or(z.literal(''))
      .nullable(),
  })
  .refine(
    (data) => {
      // If endTime is provided, startTime must also be provided
      if (data.endTime && data.endTime !== '') {
        if (!data.startTime || data.startTime === '') {
          return false;
        }
        return data.endTime >= data.startTime;
      }
      return true;
    },
    {
      message: 'End time requires start time and must be after start time',
      path: ['endTime'],
    }
  );

/**
 * Zod schema for updating an existing event
 *
 * NOTE: This schema validates the FORM-level fields (date, time as HH:mm)
 * The action handler combines date + time into ISO datetime before sending to backend
 */
export const updateEventSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be 200 characters or less')
      .trim()
      .optional(),
    description: z
      .string()
      .max(2000, 'Description must be 2000 characters or less')
      .trim()
      .optional()
      .or(z.literal('')),
    date: IsoDateSchema.optional(),
    startTime: TimeStringSchema.optional().or(z.literal('')).nullable(),
    endTime: TimeStringSchema.optional().or(z.literal('')),
    location: z
      .string()
      .min(1, 'Location is required')
      .max(500, 'Location must be 500 characters or less')
      .trim()
      .optional(),
    locationPending: z.boolean().optional(),
    dayNumber: z.number().int().positive().optional(),
    notes: z
      .string()
      .max(1000, 'Notes must be 1000 characters or less')
      .trim()
      .optional()
      .or(z.literal('')),
    googleMapsUrl: z
      .string()
      .url('Must be a valid URL')
      .max(2000, 'URL must be 2000 characters or less')
      .optional()
      .or(z.literal(''))
      .nullable(),
    webUrl: z
      .string()
      .url('Must be a valid URL')
      .max(2000, 'URL must be 2000 characters or less')
      .optional()
      .or(z.literal(''))
      .nullable(),
  })
  .refine(
    (data) => {
      // If both startTime and endTime are provided, validate order
      if (
        data.startTime &&
        data.endTime &&
        data.startTime !== '' &&
        data.endTime !== ''
      ) {
        return data.endTime >= data.startTime;
      }
      return true;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  );

/**
 * Zod schema for creating transit information
 * eventId is a path param, not validated here
 */
export const createTransitSchema = z.object({
  transportMethod: transportMethodSchema,
  departureLocation: z
    .string()
    .max(500, 'Departure location must be 500 characters or less')
    .trim()
    .optional()
    .or(z.literal('')),
  arrivalLocation: z
    .string()
    .max(500, 'Arrival location must be 500 characters or less')
    .trim()
    .optional()
    .or(z.literal('')),
  departureTime: z
    .string()
    .datetime({ message: 'Departure time must be a valid ISO datetime' })
    .optional()
    .or(z.literal('')),
  arrivalTime: z
    .string()
    .datetime({ message: 'Arrival time must be a valid ISO datetime' })
    .optional()
    .or(z.literal('')),
  bookingReference: z
    .string()
    .max(255, 'Booking reference must be 255 characters or less')
    .trim()
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(2000, 'Notes must be 2000 characters or less')
    .trim()
    .optional()
    .or(z.literal('')),
  estimatedDurationMinutes: z
    .number()
    .int('Duration must be a whole number')
    .positive('Duration must be positive')
    .optional(),
});

/**
 * Zod schema for updating transit information
 */
export const updateTransitSchema = z.object({
  transportMethod: transportMethodSchema.optional(),
  departureLocation: z
    .string()
    .max(500, 'Departure location must be 500 characters or less')
    .trim()
    .optional()
    .or(z.literal('')),
  arrivalLocation: z
    .string()
    .max(500, 'Arrival location must be 500 characters or less')
    .trim()
    .optional()
    .or(z.literal('')),
  departureTime: z
    .string()
    .datetime({ message: 'Departure time must be a valid ISO datetime' })
    .optional()
    .or(z.literal('')),
  arrivalTime: z
    .string()
    .datetime({ message: 'Arrival time must be a valid ISO datetime' })
    .optional()
    .or(z.literal('')),
  bookingReference: z
    .string()
    .max(255, 'Booking reference must be 255 characters or less')
    .trim()
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(2000, 'Notes must be 2000 characters or less')
    .trim()
    .optional()
    .or(z.literal('')),
  estimatedDurationMinutes: z
    .number()
    .int('Duration must be a whole number')
    .positive('Duration must be positive')
    .optional(),
});

/**
 * Type for creating a new event (inferred from schema)
 */
export type CreateEventDto = z.infer<typeof createEventSchema>;

/**
 * Type for updating an existing event (inferred from schema)
 */
export type UpdateEventDto = z.infer<typeof updateEventSchema>;

/**
 * Type for creating transit (inferred from schema)
 */
export type CreateTransitDto = z.infer<typeof createTransitSchema>;

/**
 * Type for updating transit (inferred from schema)
 */
export type UpdateTransitDto = z.infer<typeof updateTransitSchema>;

