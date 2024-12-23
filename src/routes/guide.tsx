import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/guide')({
    component: Component
});

function Component() {
    return (
        <div>Hello "/guide"!</div>
    );
}
