import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/guide')({
    component: Guide
});

function Guide() {
    return (
        <div>Hello "/guide"!</div>
    );
}
