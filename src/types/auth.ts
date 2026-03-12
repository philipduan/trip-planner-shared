import type {
  UserId,
  Email,
  AccessToken,
  RefreshToken,
  IsoDateTime,
} from './branded';

// API Request DTOs (matching backend schema)
export interface AuthSignInDto {
  email: string; // Plain string for form input
  password: string;
}

export interface AuthSignUpDto {
  firstName: string;
  lastName: string;
  email: string; // Plain string for form input
  password: string;
}

export interface ForgotPasswordDto {
  email: string; // Plain string for form input
}

export interface ResetPasswordDto {
  token: string; // Plain string for form input (will be branded when processed)
  newPassword: string;
}

export interface VerifyEmailDto {
  token: string; // Plain string for form input (will be branded when processed)
}

export interface ResendVerificationDto {
  email: string; // Plain string for form input
}

// API Response types
export interface AuthTokenResponse {
  access_token: AccessToken;
  refresh_token: RefreshToken;
}

export interface AuthSessionDto {
  sessionId: string;
  userAgent: string;
  ipAddress: string;
}

export interface MessageResponse {
  message: string;
}

export interface User {
  id: UserId;
  firstName: string;
  lastName: string;
  email: Email;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

// Form Data types (client-side)
export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailFormData {
  email: string;
}

// Error handling
interface AuthError {
  message: string;
  field?: string;
  statusCode?: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: AuthError;
  data?: AuthTokenResponse | User;
}
