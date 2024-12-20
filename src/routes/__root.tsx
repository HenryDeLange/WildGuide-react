import { AppHeader } from '@/components/wildguide/AppHeader';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
    component: () => (
        <>
            <AppHeader />
            <Outlet />
            <TanStackRouterDevtools />
        </>
    )
});
