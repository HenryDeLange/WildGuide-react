import { Box, ClipboardRoot, Code, FieldsetRoot, Input, NumberInputControl, NumberInputInput, NumberInputRoot, NumberInputValueChangeDetails, Separator, Text, VStack } from '@chakra-ui/react';
import { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { ClipboardButton } from '../ui/clipboard';
import { Field } from '../ui/field';
import { ExtendedMarkdown } from './ExtendedMarkdown';

export function MarkdownInputSnippetInatTax() {
    const { t } = useTranslation();
    const [id, setId] = useState('');
    const [debouncedId] = useDebounce(id, 750);
    const handleId = useCallback((event: NumberInputValueChangeDetails) => setId(event.value), []);
    const [summary, setSummary] = useState('');
    const [debouncedSummary] = useDebounce(summary, 750);
    const handleSummary = useCallback((event: ChangeEvent<HTMLInputElement>) => setSummary(event.target.value), []);
    const componentString = `<InatTaxon id="${debouncedId}" ${debouncedSummary ? `summary="${debouncedSummary}"` : ''} />`;
    return (
        <Box>
            <FieldsetRoot>
                <Field label={<Text fontSize='md'>{t('markdownSnippetsInatTaxonId')}</Text>} required>
                    <NumberInputRoot
                        value={id}
                        onValueChange={handleId}
                    >
                        <NumberInputControl />
                        <NumberInputInput onFocus={(event) => event.target.select()} />
                    </NumberInputRoot>
                </Field>
                <Field label={<Text fontSize='md'>{t('markdownSnippetsSummary')}</Text>}>
                    <Input
                        value={summary}
                        onChange={handleSummary}
                    />
                </Field>
            </FieldsetRoot>
            <Separator marginY={4} size='lg' variant='dashed' />
            {debouncedId &&
                <VStack>
                    <Box width='full' bgColor={{ _light: '#BBB9', _dark: '#2229' }} marginTop={2}>
                        <ExtendedMarkdown content={componentString} />
                    </Box>
                    <VStack>
                        <Code>
                            {componentString}
                        </Code>
                        <ClipboardRoot value={componentString}>
                            <ClipboardButton />
                        </ClipboardRoot>
                    </VStack>
                </VStack>
            }
        </Box >
    );
}
