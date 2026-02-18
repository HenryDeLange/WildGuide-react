import { selectAuthUsername } from '@/auth/authSlice';
import { ProtectedRoute } from '@/components/custom/ProtectedRoute';
import { Profile } from '@/components/wildguide/user/Profile';
import { useAppSelector } from '@/redux/hooks';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/user/profile/')({
    component: Component
});

function Component() {
    const authUsername = useAppSelector(selectAuthUsername);
    return (
        <ProtectedRoute>
            <Profile username={authUsername!} />
        </ProtectedRoute>
    );
}
