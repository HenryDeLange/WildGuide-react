import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { PwaReloadPrompt } from './PwaReloadPrompt';

export type PwaContextType = {
    isPwa: boolean;
    showPwaInstallButton: boolean;
    handleInstallClick: () => Promise<void>;
}

export const PwaContext = createContext<PwaContextType>({
    isPwa: false,
    showPwaInstallButton: false,
    handleInstallClick: async () => Promise.resolve()
});

type Props = {
    children: ReactNode;
}

export function PwaProvider({ children }: Readonly<Props>) {
    // Is PWA
    const isPwa = window.matchMedia('(display-mode: standalone)').matches;

    // PWA Install
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPwaInstallButton, setShowPwaInstallButton] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            console.log('PWA: Event received');
            // event.preventDefault(); // Show the browser default install UI as well
            setInstallPrompt(event as BeforeInstallPromptEvent);
            setShowPwaInstallButton(true);
        };

        const handleAppInstalled = () => {
            console.log('PWA: Installed');
            setInstallPrompt(null);
            setShowPwaInstallButton(false);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = useCallback(async () => {
        if (!installPrompt) return;
        const promptEvent = installPrompt;
        const result = await promptEvent.prompt();
        console.log(`PWA: The install prompt outcome is ${result.outcome}`);
        setInstallPrompt(null);
        setShowPwaInstallButton(false);
        window.location.reload();
    }, [installPrompt]);

    // RENDER
    return (
        <>
            <PwaReloadPrompt />
            <PwaContext.Provider value={
                useMemo<PwaContextType>(() => ({
                    isPwa,
                    showPwaInstallButton,
                    handleInstallClick
                }), [isPwa, showPwaInstallButton, handleInstallClick])
            }>
                {children}
            </PwaContext.Provider>
        </>
    );
}

// PWA Install
type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<{ outcome: 'accepted' | 'dismissed', platform?: string }>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
    platforms?: Promise<string[]>;
}
