import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { DiscBootGate } from '../features/landing/components/portfolio-os/DiscBootGate';
import { HomePage } from '../features/landing/pages/HomePage';
import { SectionPage } from '../features/landing/pages/SectionPage';
import '../features/landing/pages/section-shell.css';

const BioPage = lazy(() =>
  import('../features/bio/pages/BioPage').then((m) => ({ default: m.BioPage })),
);

function DiscRoute({ children }: { children: ReactNode }) {
  return <DiscBootGate>{children}</DiscBootGate>;
}

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/bio"
          element={
            <DiscRoute>
              <Suspense
                fallback={
                  <main className="section-shell">
                    <p className="section-shell__boot">&gt; Loading BIO.DISC…</p>
                  </main>
                }
              >
                <BioPage />
              </Suspense>
            </DiscRoute>
          }
        />
        <Route
          path="/resume"
          element={
            <DiscRoute>
              <SectionPage />
            </DiscRoute>
          }
        />
        <Route
          path="/experience"
          element={
            <DiscRoute>
              <SectionPage />
            </DiscRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <DiscRoute>
              <SectionPage />
            </DiscRoute>
          }
        />
        <Route
          path="/skills"
          element={
            <DiscRoute>
              <SectionPage />
            </DiscRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <DiscRoute>
              <SectionPage />
            </DiscRoute>
          }
        />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
