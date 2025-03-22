import { Button, createListCollection, SelectContent, SelectControl, SelectHiddenSelect, SelectItem, SelectItemIndicator, SelectPositioner, SelectRoot, SelectTrigger } from '@chakra-ui/react';
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
            width='auto'
            padding={0}
            margin={0}
        >
            <SelectHiddenSelect />
            <SelectControl>
                <SelectTrigger cursor='pointer' asChild>
                    <Button variant='ghost' bgColor='transparent' _hover={{ bgColor: 'bg.muted' }}>
                        {i18n.language.toUpperCase()}
                    </Button>
                </SelectTrigger>
            </SelectControl>
            <SelectPositioner minWidth={24}>
                <SelectContent>
                    {languages.items.map((language) => (
                        <SelectItem key={language.value} item={language}>
                            {t(language.label)}
                            <SelectItemIndicator />
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectPositioner>
        </SelectRoot>
    );
}
