import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/faq')({
    component: Faq
});

function Faq() {
    return (
        <div>Hello "/faq"!</div>
    );
}
