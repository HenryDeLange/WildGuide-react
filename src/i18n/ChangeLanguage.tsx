import { createListCollection, SelectContent, SelectItem, SelectRoot, SelectTrigger, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const languages = createListCollection({
    items: [
        { label: 'languageEN', value: 'en' },
        { label: 'languageAF', value: 'af' }
    ]
});

export function ChangeLanguage() {
    const { t, i18n } = useTranslation();
    return (
        <SelectRoot
            collection={languages}
            value={[i18n.language]}
            onValueChange={(event) => i18n.changeLanguage(event.value[0])}
            variant='subtle'
            size='xs'
        >
            <SelectTrigger>
                <Text cursor='pointer' fontWeight='semibold'>
                    {i18n.language.toUpperCase()}
                </Text>
            </SelectTrigger>
            <SelectContent position='absolute'>
                {languages.items.map((language) => (
                    <SelectItem key={language.value} item={language}>
                        {t(language.label)}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    );
}