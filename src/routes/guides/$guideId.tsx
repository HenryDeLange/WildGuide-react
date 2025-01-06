import { Guide } from '@/components/wildguide/Guide';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/guides/$guideId')({
    component: Component
});

function Component() {
    const { guideId } = Route.useParams();
    const id = Number(guideId);
    return (
        <Guide guideId={!isNaN(id) ? id : -1} />
    );
}
