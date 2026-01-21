import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ColorSchemeScript } from '@mantine/core';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
