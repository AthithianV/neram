import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './components/theme/ThemeProvider';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <React.StrictMode>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ThemeProvider>
        </React.StrictMode>
    </QueryClientProvider>,
);
