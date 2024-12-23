import { NewGuide } from '@/components/wildguide/NewGuide';
import { ProtectedRoute } from '@/components/wildguide/ProtectedRoute';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/new-guide')({
    component: Component,
});

function Component() {
    return (
        <ProtectedRoute>
            <NewGuide />
        </ProtectedRoute>
    );
}
