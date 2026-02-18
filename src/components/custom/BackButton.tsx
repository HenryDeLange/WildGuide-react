import { IconButton } from '@chakra-ui/react';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '../ui/tooltip';

type Props = {
    titleKey: string;
    handleBack: () => void;
}

export function BackButton({ titleKey, handleBack }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <Tooltip content={t(titleKey)}>
            <IconButton
                variant='ghost'
                onClick={handleBack}
                color='fg.muted'
                size='xs'
            >
                <ChevronLeft />
            </IconButton>
        </Tooltip>
    );
}
