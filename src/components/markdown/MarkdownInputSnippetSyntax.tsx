import { Box, Separator, Text, Textarea } from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExtendedMarkdown } from './ExtendedMarkdown';

export function MarkdownInputSnippetSyntax() {
    const { t } = useTranslation();
    const [input, setInput] = useState('');
    return (
        <Box>
            <Text>
                {t('markdownSnippetsSyntaxDetails')}
            </Text>
            <Separator marginY={4} />
            <Textarea
                value={input}
                onChange={event => setInput(event.target.value)}
                placeholder={t('markdownSnippetsSyntaxInput')}
                height={{ base: 190, md: 270 }}
            />
            <Separator marginY={4} />
            <ExtendedMarkdown content={input} />
        </Box>
    );
}
