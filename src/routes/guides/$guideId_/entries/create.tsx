import { ProtectedRoute } from '@/components/custom/ProtectedRoute';
import { EntryNew } from '@/components/wildguide/entry/EntryNew';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/guides/$guideId_/entries/create')({
    component: Component
});

function Component() {
    const { guideId } = Route.useParams();
    const gId = Number(guideId);
    return (
        <ProtectedRoute>
            <EntryNew guideId={gId} />
        </ProtectedRoute>
    );
}
