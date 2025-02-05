import { ErrorDisplay } from '@/components/custom/ErrorDisplay';
import { AppHeader } from '@/components/wildguide/AppHeader';
import i18n from '@/i18n/i18n';
import { Box } from '@chakra-ui/react';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
    component: () => (
        <Box display='flex' flexDirection='column' height='100vh'>
            <AppHeader />
            <Box flex='1' overflow='auto'>
                <Outlet />
            </Box>
            {/* <TanStackRouterDevtools /> */}
        </Box>
    ),
    notFoundComponent: () => (
        <ErrorDisplay error={{ code: '404', message: i18n.t('errorPageNotFound') }} />
    ),
    errorComponent: ({ error }) => (
        <ErrorDisplay error={error} />
    )
});
