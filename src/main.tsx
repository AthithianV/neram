import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { error } from '@tauri-apps/plugin-log';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/error/MainErrorFallBack';

import App from './App';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <React.StrictMode>
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={(err, info) => {
                    error(`Boundary caught: ${err.message}, ${info}`);
                }}
            >
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ErrorBoundary>
        </React.StrictMode>
    </QueryClientProvider>,
);

function setupGlobalErrorHandlers() {
    // Sync runtime errors (outside React render)
    window.addEventListener('error', async (event) => {
        console.error('Global error:', event.error);
        try {
            await error(event.error?.message ?? String(event.error));
        } catch (err) {
            console.error('Failed to log error:', err);
        }
    });

    // Async unhandled promise rejections
    window.addEventListener('unhandledrejection', async (event) => {
        console.error('Unhandled rejection:', event.reason);
        try {
            await error(event.reason?.message ?? String(event.reason));
        } catch (err) {
            console.error('Failed to log rejection:', err);
        }
    });
}

setupGlobalErrorHandlers();
