import { Entry } from '@/components/wildguide/Entry';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/guides/$guideId_/entries/$entryId')({
    component: Component
});

function Component() {
    const { guideId, entryId } = Route.useParams();
    const gId = Number(guideId);
    const eId = Number(entryId);
    return (
        <Entry
            guideId={!isNaN(gId) ? gId : -1}
            entryId={!isNaN(eId) ? eId : -1}
        />
    );
}
