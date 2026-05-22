import type { AxiosError } from 'axios';

type ApiErrorBody = {
  message?: string | string[];
};

const TECHNICAL_MESSAGE =
  /^(Cannot (GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|Network Error|timeout of \d+ms exceeded)/i;

function extractRawMessage(err: unknown): string | null {
  const data = (err as AxiosError<ApiErrorBody>)?.response?.data;
  const msg = data?.message;
  if (Array.isArray(msg)) return msg.join(' ').trim() || null;
  if (typeof msg === 'string' && msg.trim()) return msg.trim();
  if (err instanceof Error && err.message.trim()) return err.message.trim();
  return null;
}

function isTechnicalMessage(text: string): boolean {
  return TECHNICAL_MESSAGE.test(text);
}

export function getApiErrorMessage(
  err: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  const axiosErr = err as AxiosError<ApiErrorBody>;
  const status = axiosErr.response?.status;
  const raw = extractRawMessage(err);

  if (!axiosErr.response) {
    return 'Could not reach the server. Check your connection and try again.';
  }

  if (status === 401) {
    return 'Your session expired. Please sign in again.';
  }

  if (status !== undefined && status >= 500) {
    return 'Something went wrong on our side. Please try again in a moment.';
  }

  if (raw && !isTechnicalMessage(raw)) {
    return raw;
  }

  return fallback;
}
