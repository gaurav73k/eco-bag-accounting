
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Initialize authentication
const initAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return { session };
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize authentication and then render the app
initAuth().then(() => {
  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  );
});
