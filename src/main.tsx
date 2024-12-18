import { Provider as DefaultChakraProvider } from '@/components/ui/provider';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { App } from './App.tsx';
import './i18n/i18n';
import { PwaProvider } from './pwa/PwaProvider.tsx';
import { store } from './redux/store.ts';

createRoot(document.getElementById('root')!).render(
    <ErrorBoundary fallback={
        <h1 style={{
            textAlign: 'center',
            verticalAlign: 'center',
            width: '100%',
            height: '100%'
        }}>
            🔥🔥💥 🦉 💥🔥🔥
        </h1>
    }>
        <StrictMode>
            <PwaProvider>
                <Provider store={store}>
                    <DefaultChakraProvider>
                        <App />
                    </DefaultChakraProvider>
                </Provider>
            </PwaProvider>
        </StrictMode>
    </ErrorBoundary>
);
