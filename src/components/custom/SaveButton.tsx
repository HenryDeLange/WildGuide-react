import { Text } from '@chakra-ui/react';
import { CircleCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

type Props = {
    titleKey: string;
    loading: boolean;
    disabled?: boolean;
}

export function SaveButton({ titleKey, loading, disabled }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <Button
            type='submit'
            size='lg'
            variant='ghost'
            whiteSpace='nowrap'
            color={disabled ? 'fg.info' : 'fg.success'}
            loading={loading}
            disabled={disabled}
        >
            <CircleCheck />
            <Text>
                {t(titleKey)}
            </Text>
        </Button>
    );
}
