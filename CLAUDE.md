# CLAUDE.md

## 1. Project Metadata

| Field            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| Project Name     | `trip-planner-shared`                                    |
| Project Type     | Shared TypeScript library (types, schemas, constants)    |
| Language         | TypeScript                                               |
| Package Manager  | Yarn                                                     |
| Key Dependency   | `zod` ^4.3.6                                             |

## 2. Purpose

Single source of truth for types, Zod schemas, constants, and permission logic shared between:

- **`trip-planner-client`** (React Router v7 web app)
- **`trip-planner-mobile`** (React Native + Expo)

Consumed via `"trip-planner-shared": "file:../trip-planner-shared"` in each consumer's `package.json`.

## 3. Project Structure

```
trip-planner-shared/
├── src/
│   ├── types/              # TypeScript interfaces & type aliases
│   │   ├── branded.ts      # Branded types (TripId, EventId, etc.)
│   │   ├── auth.ts         # Auth types (LoginRequest, User, Tokens, etc.)
│   │   ├── trip.ts         # Trip types (Trip, CreateTripDto, etc.)
│   │   ├── event.ts        # Event + Transit types
│   │   ├── media.ts        # Media types (upload, gallery)
│   │   ├── comment.ts      # Comment types
│   │   ├── collaboration.ts # TripMember, roles, invitations
│   │   ├── api.ts          # API response shapes, error format, pagination
│   │   └── index.ts        # Barrel export for types
│   ├── schemas/            # Zod validation schemas
│   │   ├── auth.ts         # loginSchema, registerSchema, etc.
│   │   ├── trip.ts         # createTripSchema, updateTripSchema
│   │   ├── event.ts        # createEventSchema, updateEventSchema
│   │   ├── media.ts        # mediaUploadSchema
│   │   ├── comment.ts      # createCommentSchema
│   │   └── index.ts
│   ├── constants/          # Shared constants
│   │   ├── media.ts        # ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE
│   │   ├── permissions.ts  # Permission matrix
│   │   └── index.ts
│   ├── utils/
│   │   └── permissions.ts  # hasPermission(role, action) function
│   └── index.ts            # Root barrel export
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

## 4. What Belongs Here

| Include                                    | Exclude                                     |
| ------------------------------------------ | ------------------------------------------- |
| TypeScript interfaces & type aliases       | API clients (fetch/axios wrappers)           |
| Zod validation schemas                     | Session/cookie logic                         |
| Constants (file sizes, allowed types)      | UI components                                |
| Permission matrix & `hasPermission()`      | Platform-specific utilities                  |
| Branded types (`TripId`, `EventId`)        | Environment config                           |
| API error/response shape types             | Database models (WatermelonDB, TypeORM)      |

**Rule of thumb**: If it's pure TypeScript with no runtime platform dependency (no `react`, no `node:crypto`, no `expo-*`), it belongs here.

## 5. Commands

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `yarn build`     | Compile TypeScript to `dist/`  |
| `yarn typecheck` | Run type checking only         |

## 6. Naming Conventions

| Element          | Convention        | Example                         |
| ---------------- | ----------------- | ------------------------------- |
| Types/Interfaces | `PascalCase`      | `Trip`, `CreateTripDto`         |
| Zod schemas      | `camelCase`       | `createTripSchema`              |
| Constants        | `SCREAMING_SNAKE` | `MAX_IMAGE_SIZE`                |
| Functions        | `camelCase`       | `hasPermission`                 |
| Files            | `camelCase.ts`    | `trip.ts`, `permissions.ts`     |
| Branded types    | `PascalCase`      | `TripId`, `EventId`             |

## 7. Adding New Types

1. Add the type to the appropriate file in `src/types/`
2. Export it from `src/types/index.ts`
3. Export it from `src/index.ts`
4. If it has validation, add a Zod schema in `src/schemas/`
5. Run `yarn typecheck` to verify

## 8. Relationship to Server DTOs

Server DTOs in `trip-planner-server/src/<domain>/dto/` are the source of truth. Types here mirror those DTOs for client-side consumption.

```
Server DTO (class-validator)  →  Shared type (interface)  →  Web client / Mobile app
```

**When a server DTO changes, update the corresponding shared type first, then both consumers.**

## 9. Consumer Integration

### Web Client (`trip-planner-client`)

Web client `app/types/*.ts` files re-export from this package for backward compatibility:

```typescript
// trip-planner-client/app/types/trip.ts
export type { Trip, CreateTripDto, UpdateTripDto } from 'trip-planner-shared';
```

### Mobile App (`trip-planner-mobile`)

Mobile imports directly:

```typescript
import { Trip, createTripSchema, hasPermission } from 'trip-planner-shared';
```

### Metro Bundler (Mobile)

The mobile app's `metro.config.js` must include this package in `watchFolders` and `nodeModulesPaths` for resolution to work.

## 10. File Boundaries

| Action             | Paths                          |
| ------------------ | ------------------------------ |
| **Safe to modify** | `src/`                         |
| **Never modify**   | `node_modules/`, `.git/`       |
