import { ProtectedRoute } from '@/components/custom/ProtectedRoute';
import { Profile } from '@/components/wildguide/user/Profile';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/user/profile')({
    component: Component
});

function Component() {
    return (
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    );
}
