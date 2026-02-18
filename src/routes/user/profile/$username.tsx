import { ProtectedRoute } from '@/components/custom/ProtectedRoute';
import { Profile } from '@/components/wildguide/user/Profile';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/user/profile/$username')({
    component: Component
});

function Component() {
    const { username } = Route.useParams();
    return (
        <ProtectedRoute>
            <Profile username={username} />
        </ProtectedRoute>
    );
}
