import { Box, ClipboardRoot, Code, Heading, HStack, Input, Separator, VStack } from '@chakra-ui/react';
import { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { ClipboardButton } from '../ui/clipboard';
import { ExtendedMarkdown } from './ExtendedMarkdown';

export function MarkdownInputSnippetPopup() {
    const { t } = useTranslation();
    const [inputText, setInputText] = useState('');
    const [inputContent, setInputContent] = useState('');
    const [debouncedInputText] = useDebounce(inputText, 150);
    const [debouncedInputContent] = useDebounce(inputContent, 150);
    const handleInputText = useCallback((event: ChangeEvent<HTMLInputElement>) => setInputText(event.target.value), []);
    const handleInputContent = useCallback((event: ChangeEvent<HTMLInputElement>) => setInputContent(event.target.value), []);
    return (
        <Box>
            <Heading size='md'>{t('markdownSnippetsPopupText')}</Heading>
            <Input
                value={inputText}
                onChange={handleInputText}
                placeholder={t('markdownSnippetsPopupText')}
            />
            <Heading size='md'>{t('markdownSnippetsPopupContent')}</Heading>
            <Input
                value={inputContent}
                onChange={handleInputContent}
                placeholder={t('markdownSnippetsPopupContent')}
            />
            <Separator marginY={4} size='lg' variant='dashed' />
            {debouncedInputText && debouncedInputContent &&
                <HStack>
                    <ExtendedMarkdown content={`<Popup text="${debouncedInputText}" content={${debouncedInputContent}} />`} />

                    <VStack>
                        <Code>
                            {`<Popup text="${debouncedInputText}" content={${debouncedInputContent}} />`}
                        </Code>
                        <ClipboardRoot value={`<Popup text="${debouncedInputText}" content={${debouncedInputContent}} />`}>
                            <ClipboardButton />
                        </ClipboardRoot>
                    </VStack>
                </HStack>
            }
        </Box >
    );
}
