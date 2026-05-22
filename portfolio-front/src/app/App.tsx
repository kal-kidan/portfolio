import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { HomePage } from '../features/landing/pages/HomePage';
import { SectionPage } from '../features/landing/pages/SectionPage';
import '../features/landing/pages/section-shell.css';

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/bio" element={<SectionPage />} />
        <Route path="/resume" element={<SectionPage />} />
        <Route path="/experience" element={<SectionPage />} />
        <Route path="/projects" element={<SectionPage />} />
        <Route path="/skills" element={<SectionPage />} />
        <Route path="/contact" element={<SectionPage />} />
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
