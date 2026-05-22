import type { ReactNode } from 'react';

/**
 * Placeholder Socket.IO provider — implement when adding real-time features.
 * Use VITE_API_BASE_URL (same host as API) for the socket URL.
 */
export function SocketProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
