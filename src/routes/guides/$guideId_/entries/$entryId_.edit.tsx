import { EntryEdit } from '@/components/wildguide/EntryEdit';
import { ProtectedRoute } from '@/components/wildguide/ProtectedRoute';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/guides/$guideId_/entries/$entryId_/edit')({
    component: Component
});

function Component() {
    const { guideId, entryId } = Route.useParams();
    const gId = Number(guideId);
    const eId = Number(entryId);
    return (
        <ProtectedRoute>
            <EntryEdit
                guideId={!isNaN(gId) ? gId : -1}
                entryId={!isNaN(eId) ? eId : -1}
            />
        </ProtectedRoute>
    );
}
