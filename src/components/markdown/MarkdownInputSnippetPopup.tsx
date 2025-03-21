import { Box, ClipboardRoot, Code, FieldsetRoot, Input, Separator, Text, VStack } from '@chakra-ui/react';
import { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { ClipboardButton } from '../ui/clipboard';
import { Field } from '../ui/field';
import { ExtendedMarkdown } from './ExtendedMarkdown';

export function MarkdownInputSnippetPopup() {
    const { t } = useTranslation();
    const [inputText, setInputText] = useState('');
    const [inputContent, setInputContent] = useState('');
    const [debouncedInputText] = useDebounce(inputText, 150);
    const [debouncedInputContent] = useDebounce(inputContent, 150);
    const handleInputText = useCallback((event: ChangeEvent<HTMLInputElement>) => setInputText(event.target.value), []);
    const handleInputContent = useCallback((event: ChangeEvent<HTMLInputElement>) => setInputContent(event.target.value), []);
    const componentString = `<Popup text="${debouncedInputText}" content={${debouncedInputContent}} />`;
    return (
        <Box>
            <FieldsetRoot>
                <Field label={<Text fontSize='md'>{t('markdownSnippetsPopupText')}</Text>} required>
                    <Input
                        value={inputText}
                        onChange={handleInputText}
                    />
                </Field>
                <Field label={<Text fontSize='md'>{t('markdownSnippetsPopupContent')}</Text>} required>
                    <Input
                        value={inputContent}
                        onChange={handleInputContent}
                    />
                </Field>
            </FieldsetRoot>
            <Separator marginY={4} size='lg' variant='dashed' />
            <Separator marginY={4} size='lg' variant='dashed' />
            {debouncedInputText && debouncedInputContent &&
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
