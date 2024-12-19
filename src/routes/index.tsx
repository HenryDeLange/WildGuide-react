import { ChangeLanguage } from '@/i18n/ChangeLanguage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div className="p-2">
            <h3>Welcome Home!</h3>
            <ChangeLanguage />
        </div>
    )
}
