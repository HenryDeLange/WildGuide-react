import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/guides/')({
    beforeLoad: () => {
        throw redirect({ from: '/guides', to: '/' });
    }
});
