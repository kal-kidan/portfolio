/** User-safe copy when the request body or upload exceeds server limits. */
export const PAYLOAD_TOO_LARGE_USER_MESSAGE =
  'The request is too large. Please reduce the payload size and try again.';

export const GENERIC_ERROR_BODY = {
  success: false as const,
  error: true as const,
};
