import { Box, ClipboardRoot, Code, FieldsetRoot, HStack, NumberInputControl, NumberInputInput, NumberInputRoot, NumberInputValueChangeDetails, Separator, Text, VStack } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { InatSelector, InatSelectorTypes } from '../custom/InatSelector';
import { ClipboardButton } from '../ui/clipboard';
import { Field } from '../ui/field';
import { ExtendedMarkdown } from './ExtendedMarkdown';

export function MarkdownInputSnippetInatTaxMap() {
    const { t } = useTranslation();
    const [id, setId] = useState<string | undefined>(undefined);
    const [debouncedId] = useDebounce(id, 750);
    const handleId = useCallback((event: NumberInputValueChangeDetails) => setId(event.value), []);
    const [latitude, setLatitude] = useState<string | undefined>(undefined);
    const [debouncedLatitude] = useDebounce(latitude, 750);
    const handleLatitude = useCallback((event: NumberInputValueChangeDetails) => setLatitude(event.value), []);
    const [longitude, setLongitude] = useState<string | undefined>(undefined);
    const [debouncedLongitude] = useDebounce(longitude, 750);
    const handleLongitude = useCallback((event: NumberInputValueChangeDetails) => setLongitude(event.value), []);
    const [zoom, setZoom] = useState<string | undefined>(undefined);
    const [debouncedZoom] = useDebounce(zoom, 750);
    const handleZoom = useCallback((event: NumberInputValueChangeDetails) => setZoom(event.value), []);
    const componentString = `<InatTaxonMap id="${debouncedId}"${debouncedLatitude ? ` latitude="${debouncedLatitude}"` : ''}${debouncedLongitude ? ` longitude="${debouncedLongitude}"` : ''}${debouncedZoom ? ` zoom="${debouncedZoom}"` : ''} />`;
    return (
        <Box>
            <FieldsetRoot>
                <Field label={<Text fontSize='md'>{t('markdownSnippetsInatTaxon')}</Text>} required>
                    <HStack>
                        <NumberInputRoot
                            value={id}
                            onValueChange={handleId}
                        >
                            <NumberInputControl />
                            <NumberInputInput onFocus={(event) => event.target.select()} />
                        </NumberInputRoot>
                        <InatSelector type='TAXON' select={(_type: InatSelectorTypes, inatId: number | null) => setId(inatId?.toString())} />
                    </HStack>
                </Field>
                <Field label={<Text fontSize='md'>{t('markdownSnippetsInatTaxonMapLatitude')}</Text>}>
                    <NumberInputRoot
                        value={latitude}
                        onValueChange={handleLatitude}
                    >
                        <NumberInputControl />
                        <NumberInputInput onFocus={(event) => event.target.select()} />
                    </NumberInputRoot>
                </Field>
                <Field label={<Text fontSize='md'>{t('markdownSnippetsInatTaxonMapLongitude')}</Text>}>
                    <NumberInputRoot
                        value={longitude}
                        onValueChange={handleLongitude}
                    >
                        <NumberInputControl />
                        <NumberInputInput onFocus={(event) => event.target.select()} />
                    </NumberInputRoot>
                </Field>
                <Field label={<Text fontSize='md'>{t('markdownSnippetsInatTaxonMapZoom')}</Text>}>
                    <NumberInputRoot
                        value={zoom}
                        onValueChange={handleZoom}
                    >
                        <NumberInputControl />
                        <NumberInputInput onFocus={(event) => event.target.select()} />
                    </NumberInputRoot>
                </Field>
            </FieldsetRoot>
            <Separator marginY={4} size='lg' variant='dashed' />
            {debouncedId &&
                <VStack>
                    <Box width='full' bgColor={{ _light: '#BBB9', _dark: '#2229' }} marginTop={2}>
                        <ExtendedMarkdown key={componentString} content={componentString} />
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
