import { Box, ClipboardRoot, Code, Heading, HStack, Input, Separator, VStack } from '@chakra-ui/react';
import { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { ClipboardButton } from '../ui/clipboard';
import { InatObservation } from './InatObservation';

export function MarkdownInputSnippetInatObs() {
    const { t } = useTranslation();
    const [input, setInput] = useState(0);
    const [debouncedInput] = useDebounce(input, 750);
    const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => setInput(Number(event.target.value)), []);
    return (
        <Box>
            <Heading size='md'>{t('markdownSnippetsInatObservationId')}</Heading>
            <Input
                value={input}
                onChange={handleInput}
                placeholder={t('markdownSnippetsInatObservationId')}
                type='number'
            />
            <Separator marginY={4} size='lg' variant='dashed' />
            {debouncedInput > 0 &&
                <HStack>
                    <InatObservation id={debouncedInput} />
                    <VStack>
                        <Code>
                            {`<InatObservation id="${debouncedInput}" />`}
                        </Code>
                        <ClipboardRoot value={`<InatObservation id="${debouncedInput}" />`}>
                            <ClipboardButton />
                        </ClipboardRoot>
                    </VStack>
                </HStack>
            }
        </Box >
    );
}
