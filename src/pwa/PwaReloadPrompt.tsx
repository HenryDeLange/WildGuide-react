import { useRegisterSW } from 'virtual:pwa-register/react';
import './PwaReloadPrompt.css';

// TODO: See https://vite-pwa-org.netlify.app/frameworks/react.html

export function PwaReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swScriptUrl, registration) {
            console.log('SW Registered', { swScriptUrl, registration })
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        }
    })

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    }

    return (
        <div className='ReloadPrompt-container'>
            {(offlineReady || needRefresh)
                && <div className='ReloadPrompt-toast'>
                    <div className='ReloadPrompt-message'>
                        {offlineReady
                            ? <span>WildGuide ready to work offline.</span>
                            : <span>New content available, click on reload button to update.</span>
                        }
                    </div>
                    {needRefresh &&
                        <button className='ReloadPrompt-toast-button' onClick={() => updateServiceWorker(true)}>
                            Reload
                        </button>
                    }
                    <button className='ReloadPrompt-toast-button' onClick={() => close()}>
                        Close
                    </button>
                </div>
            }
        </div>
    );
}
