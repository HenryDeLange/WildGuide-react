import { AppHeader } from '@/components/wildguide/AppHeader';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
    component: () => (
        <>
            <AppHeader />
            <Outlet />
            {/* <TanStackRouterDevtools /> */}
        </>
    )
});
