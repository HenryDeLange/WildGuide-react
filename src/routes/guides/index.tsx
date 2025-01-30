import { GuideList } from '@/components/wildguide/guide/GuideList';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/guides/')({
    component: Component
});

function Component() {
    return (
        <GuideList />
    );
}
