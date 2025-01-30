import { AppHome } from '@/components/wildguide/AppHome';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: Component
});

function Component() {
    return (
        <AppHome />
    );
}
