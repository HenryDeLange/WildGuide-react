import { AppFaq } from '@/components/wildguide/AppFaq';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/faq')({
    component: Component
});

function Component() {
    return (
        <AppFaq />
    );
}
