import { ProtectedRoute } from '@/components/custom/ProtectedRoute';
import { GuideNew } from '@/components/wildguide/guide/GuideNew';
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
