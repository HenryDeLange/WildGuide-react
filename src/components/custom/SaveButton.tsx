import { Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdOutlineCheckCircle } from 'react-icons/md';
import { Button } from '../ui/button';

type Props = {
    titleKey: string;
    loading: boolean;
}

export function SaveButton({ titleKey, loading }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <Button
            type='submit'
            size='lg'
            variant='ghost'
            whiteSpace='nowrap'
            color='fg.success'
            loading={loading}
        >
            <MdOutlineCheckCircle />
            <Text>
                {t(titleKey)}
            </Text>
        </Button>
    );
}
