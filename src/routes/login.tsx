import { LoginForm } from '@/components/wildguide/LoginForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
    component: Component
});

function Component() {
    return (
        <LoginForm />
    );
}
