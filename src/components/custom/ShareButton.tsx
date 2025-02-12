import { Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuShare2 } from 'react-icons/lu';
import { Button } from '../ui/button';

type Props = {
    value: string;
    hideLabel?: boolean;
}

export function ShareButton({ value, hideLabel }: Readonly<Props>) {
    const { t } = useTranslation();
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: t('appTitle'),
                url: value
            }).catch(console.error);
        }
        else {
            navigator.clipboard.writeText(value);
            alert(t('copyDone'));
        }
    };
    return (
        <Button
            aria-label={t('shareUrl')}
            variant='ghost'
            whiteSpace='nowrap'
            onClick={handleShare}
        >
            <LuShare2 />
            {!hideLabel &&
                <Text>
                    {t('shareUrl')}
                </Text>
            }
        </Button>
    );
}
