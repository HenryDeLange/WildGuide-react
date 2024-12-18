import { Button } from '@/components/ui/button';
import { ColorModeButton } from '@/components/ui/color-mode';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export function ChangeLanguage() {
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    }; return (
        <Box textAlign='center' fontSize='xl'>
            <ColorModeButton />
            <hr />
            <p>{t('welcome')}</p>
            <Button onClick={() => changeLanguage('en')}>English</Button>
            <Button onClick={() => changeLanguage('af')}>Afrikaans</Button>
        </Box>
    );
}