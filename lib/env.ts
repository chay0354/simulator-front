/**
 * Backend API base URL. Set NEXT_PUBLIC_BACKEND_URL in .env (see .env.example).
 * Fallback for local dev when env is not set.
 */
export const getBackendUrl = (): string =>
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
