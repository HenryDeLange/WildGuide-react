import { ProtectedRoute } from '@/components/custom/ProtectedRoute';
import { ProfileEdit } from '@/components/wildguide/user/ProfileEdit';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/user/profile/$username_/edit')({
    component: Component
});

function Component() {
    return (
        <ProtectedRoute>
            <ProfileEdit />
        </ProtectedRoute>
    );
}
