import { LoginForm } from '@/components/wildguide/LoginForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register')({
    component: Component
});

function Component() {
    return (
        <LoginForm registerMode />
    );
}
