import { Box, HStack, Stack, Textarea, VStack } from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ExtendedMarkdown } from './ExtendedMarkdown';
import { MarkdownInputSnippets } from './MarkdownInputSnippets';

type Props = {
    value?: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
}

export function MarkdownInput({ value, onChange, placeholder }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <Stack width='full' direction={{ base: 'column', md: 'row' }}>
            <HStack width='100%' alignItems='flex-start'>
                <Textarea
                    value={value}
                    onChange={onChange}
                    placeholder={t(placeholder)}
                    variant='outline'
                    minHeight={200}
                />
                <VStack>
                    <MarkdownInputSnippets />
                </VStack>
            </HStack>
            <Box width='full' height='fit' bgColor={{ _light: '#BBB9', _dark: '#2229' }}>
                <ExtendedMarkdown content={value} />
            </Box>
        </Stack>
    );
}
