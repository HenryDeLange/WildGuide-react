import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/guides/$guideId_/entries/')({
    beforeLoad: () => {
        throw redirect({ from: '/guides/$guideId/entries', to: '/guides/$guideId' });
    }
});
