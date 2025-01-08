import { GuideEdit } from '@/components/wildguide/GuideEdit';
import { ProtectedRoute } from '@/components/wildguide/ProtectedRoute';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/guides/$guideId_/edit')({
    component: Component
});

function Component() {
    const { guideId } = Route.useParams();
    const id = Number(guideId);
    return (
        <ProtectedRoute>
            <GuideEdit guideId={!isNaN(id) ? id : -1} />
        </ProtectedRoute>
    );
}
