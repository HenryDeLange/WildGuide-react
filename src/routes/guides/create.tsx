import { GuideNew } from '@/components/wildguide/GuideNew';
import { ProtectedRoute } from '@/components/wildguide/ProtectedRoute';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/guides/create')({
    component: Component
});

function Component() {
    return (
        <ProtectedRoute>
            <GuideNew />
        </ProtectedRoute>
    );
}
