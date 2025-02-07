import { Box, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export function AppFaq() {
    const { t } = useTranslation();
    return (
        <Box margin={4}>
            <Heading>{t('faqTitle')}</Heading>
            ...TODO...
        </Box>
    );
}
