import { Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCcw } from 'react-icons/lu';
import { Button } from '../ui/button';

type Props = {
    handleRefresh: () => void;
    loading: boolean;
    hideLabel?: boolean;
}

export function RefreshButton({ handleRefresh, loading, hideLabel }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <Button
            aria-label={t('refresh')}
            variant='ghost'
            whiteSpace='nowrap'
            onClick={handleRefresh}
            loading={loading}
            loadingText={t('loading')}
        >
            <LuRefreshCcw />
            {!hideLabel &&
                <Text>
                    {t('refresh')}
                </Text>
            }
        </Button>
    );
}
