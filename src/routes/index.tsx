import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: Component
});

function Component() {
    return (
        <div className="p-2">
            <h3>Welcome Home!</h3>
        </div>
    );
}
