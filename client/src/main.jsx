// index.js or App.jsx
import './index.css';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom'; // Assuming RouterProvider is correctly imported
import { router } from './router/Router.jsx';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
      </RouterProvider>
    </QueryClientProvider>
  </HelmetProvider>
);
