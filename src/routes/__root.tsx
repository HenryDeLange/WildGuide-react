import { ErrorDisplay } from '@/components/custom/ErrorDisplay';
import { AppHeader } from '@/components/wildguide/AppHeader';
import i18n from '@/i18n/i18n';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
    component: () => (
        <>
            <AppHeader />
            <Outlet />
            {/* <TanStackRouterDevtools /> */}
        </>
    ),
    notFoundComponent: () => (
        <ErrorDisplay error={{ code: '404', message: i18n.t('errorPageNotFound') }} />
    ),
    errorComponent: ({error}) => (
        <ErrorDisplay error={error} />
    )
});
