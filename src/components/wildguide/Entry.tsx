import { useTranslation } from 'react-i18next';

type Props = {
    guideId: number;
    entryId: number;
}

export function Entry({ guideId, entryId }: Readonly<Props>) {
    const { t } = useTranslation();

    return (
        <></>
    );
}
