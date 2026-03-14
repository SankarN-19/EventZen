import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" toastOptions={{
      duration: 3000,
      style: {
        background: '#fff',
        color: '#111827',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
      success: {
        iconTheme: { primary: '#2563EB', secondary: '#fff' }
      }
    }} />
  </StrictMode>
);