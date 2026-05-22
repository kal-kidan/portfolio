import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { App } from './app';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root container missing');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
