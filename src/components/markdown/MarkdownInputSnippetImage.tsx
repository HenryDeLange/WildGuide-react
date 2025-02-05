import { Box, Code, DataListItem, DataListItemLabel, DataListItemValue, DataListRoot, Heading, HStack, Input, Separator, Text, Textarea, VStack } from '@chakra-ui/react';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardButton, ClipboardRoot } from '../ui/clipboard';
import { InfoTip } from '../ui/toggle-tip';
import { AnnotatedImage } from './AnnotatedImage';

export function MarkdownInputSnippetImage() {
    const { t } = useTranslation();
    const [url, setUrl] = useState('');
    const [annotations, setAnnotations] = useState(EXAMPLE_ANNOTATIONS);
    const handleInputUrl = useCallback((event: ChangeEvent<HTMLInputElement>) => setUrl(event.target.value), []);
    const handleInputAnnotations = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => setAnnotations(event.target.value), []);
    const annotationDetails = useMemo(() => [
        {
            name: 'type',
            info: t('markdownSnippetsAnnotatedImageAnnotationTypeDetails'),
            data: t('markdownSnippetsAnnotatedImageAnnotationTypeData')
        },
        {
            name: 'size',
            info: t('markdownSnippetsAnnotatedImageAnnotationSizeDetails'),
            data: t('markdownSnippetsAnnotatedImageAnnotationSizeData')
        },
        {
            name: 'top',
            info: t('markdownSnippetsAnnotatedImageAnnotationTopDetails'),
            data: t('markdownSnippetsAnnotatedImageAnnotationTopData')
        },
        {
            name: 'left',
            info: t('markdownSnippetsAnnotatedImageAnnotationLeftDetails'),
            data: t('markdownSnippetsAnnotatedImageAnnotationLeftData')
        },
        {
            name: 'color',
            info: t('markdownSnippetsAnnotatedImageAnnotationColorDetails'),
            data: t('markdownSnippetsAnnotatedImageAnnotationColorData')
        },
        {
            name: 'border',
            info: t('markdownSnippetsAnnotatedImageAnnotationBorderDetails'),
            data: t('markdownSnippetsAnnotatedImageAnnotationBorderData')
        },
        {
            name: 'rotation',
            info: t('markdownSnippetsAnnotatedImageAnnotationRotationDetails'),
            data: t('markdownSnippetsAnnotatedImageAnnotationRotationData')
        },
        {
            name: 'text',
            info: t('markdownSnippetsAnnotatedImageAnnotationTextDetails'),
            data: t('markdownSnippetsAnnotatedImageAnnotationTextData')
        }
    ], [t]);
    return (
        <Box>
            <Heading size='md'>{t('markdownSnippetsAnnotatedImageUrl')}</Heading>
            <Input
                value={url}
                onChange={handleInputUrl}
                placeholder={t('markdownSnippetsAnnotatedImageUrl')}
            />
            <Box marginTop={2}>
                <Heading size='md'>{t('markdownSnippetsAnnotatedImageAnnotations')}</Heading>
                <Text>{t('markdownSnippetsAnnotatedImageAnnotationsDetails')}</Text>
            </Box>
            <HStack>
                <Textarea
                    fontFamily='monospace'
                    minWidth='40%'
                    width='60%'
                    height={250}
                    value={annotations}
                    onChange={handleInputAnnotations}
                    placeholder={EXAMPLE_ANNOTATIONS}
                />
                <DataListRoot orientation='horizontal' gap={1}>
                    {annotationDetails.map(item =>
                        <DataListItem key={item.name}>
                            <DataListItemLabel fontFamily='monospace'>
                                {item.name}
                                <InfoTip showArrow positioning={{ placement: 'right' }}>
                                    {item.info}
                                </InfoTip>
                            </DataListItemLabel>
                            <DataListItemValue>
                                <Code>
                                    {item.data}
                                </Code>
                            </DataListItemValue>
                        </DataListItem>
                    )}
                </DataListRoot>
            </HStack>
            <Separator marginY={4} size='lg' variant='dashed' />
            {url && annotations &&
                <HStack>
                    <AnnotatedImage url={url} annotations={annotations} />
                    <VStack>
                        <Code>
                            {`<AnnotatedImage url="${url}" annotations={${annotations}} />`}
                        </Code>
                        <ClipboardRoot value={`<AnnotatedImage url="${url}" annotations={${annotations}} />`}>
                            <ClipboardButton />
                        </ClipboardRoot>
                    </VStack>
                </HStack>
            }
        </Box>
    );
}

const EXAMPLE_ANNOTATIONS = `[
  {
    "type": "circle",
    "size": 30,
    "top": 40,
    "left": 40,
    "color": "blue"
  },
  {
    "type": "square",
    "size": 20,
    "top": 20,
    "left": 20,
    "color": "red",
    "border": "white",
    "rotation": 45,
    "text": "tooltip"
  }
]`;
