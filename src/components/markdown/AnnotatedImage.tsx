import { Box, DialogRoot, HStack, IconButton, Image, Text, useBreakpointValue } from '@chakra-ui/react';
import NamedColors from 'color-name';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuZoomIn, LuZoomOut } from 'react-icons/lu';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tooltip } from '../ui/tooltip';
import { MarkdownErrorBoundary } from './MarkdownErrorBoundary';

const LINE_SIZE = 3;

type Props = {
    /** URL of the image */
    url: string;
    annotations: AnnotationParams[] | string; // When coming from the Markdown it will be a string
}

type AnnotationParams = {
    type: 'circle' | 'square' | 'line';
    /** The width (and height) of the shape */
    size: number;
    /** As % of image height */
    top: number;
    /** As % of image width */
    left: number;
    color: keyof typeof NamedColors;
    border?: keyof typeof NamedColors;
    /** Degrees to rotate */
    rotation?: number;
    /** Tooltip text */
    text?: string;
}

export function AnnotatedImage({ url, annotations }: Readonly<Props>) {
    const scale = useBreakpointValue({ base: 1, sm: 1.2, md: 1.5, lg: 1.85 }) ?? 1;
    const [zoom, setZoom] = useState(1);
    return (
        <MarkdownErrorBoundary>
            <Box position='relative' display='inline-block' border='1px solid' borderRadius={3} bgColor='gray.muted'>
                <Image
                    src={url}
                    objectFit='contain'
                    minWidth={250 * scale}
                    width={250 * scale}
                    height={250 * scale}
                />
                <DialogRoot lazyMount placement='center' motionPreset='slide-in-bottom' size='cover'>
                    <DialogTrigger asChild>
                        <Box position='absolute' top={1} right={1}>
                            <IconButton variant='ghost'>
                                <LuZoomIn />
                            </IconButton>
                        </Box>
                    </DialogTrigger>
                    <DialogContent bgColor='gray' width='100%' height='100%'>
                        <DialogTitle>
                            <HStack margin={2}>
                                <IconButton variant='ghost' onClick={() => setZoom(zoom * 1.5)}>
                                    <LuZoomIn />
                                </IconButton>
                                <IconButton variant='ghost' onClick={() => setZoom(zoom / 1.5)}>
                                    <LuZoomOut />
                                </IconButton>
                            </HStack>
                        </DialogTitle>
                        <DialogBody display='flex' justifyContent='center' alignItems='center' overflow='auto' margin={2} marginTop={0}>
                            <Image
                                src={url}
                                objectFit='contain'
                                width='auto'
                                height='auto'
                                maxWidth='100%'
                                maxHeight='80vh'
                                transform={`scale(${zoom})`}
                            />
                        </DialogBody>
                        <DialogCloseTrigger />
                    </DialogContent>
                </DialogRoot>
                <AnnotationsLayer annotations={annotations} scale={scale} />
            </Box>
        </MarkdownErrorBoundary>
    );
}

type AnnotationsProps = {
    annotations: AnnotationParams[] | string;
    scale: number;
}

function AnnotationsLayer({ annotations, scale }: Readonly<AnnotationsProps>) {
    const { t } = useTranslation();
    let parsedAnnotations: AnnotationParams[] = [];
    try {
        parsedAnnotations = typeof annotations === 'string'
            ? JSON.parse(annotations.replace(/^\{/, '').replace(/\}$/, '').replace(/\n/g, '')) // TODO: Try to handle this better (instead of this black-magic parsing)
            : annotations;
    }
    catch (error) {
        console.warn(error);
        return (
            <Text color='fg.error' position='absolute' top={2} left={2} bgColor='bg.error'>
                {t('markdownError')}
            </Text>
        );
    }
    return (
        <>
            {parsedAnnotations.map((annotation, index) => (
                <Annotation
                    key={`${index}_${annotation.type}_${annotation.top}_${annotation.left}_${annotation.size}`}
                    annotation={annotation}
                    scale={scale}
                />
            ))}
        </>
    )
}

type AnnotationProps = {
    annotation: AnnotationParams;
    scale: number;
}

function Annotation({ annotation, scale }: Readonly<AnnotationProps>) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [forceShowTooltip, setForceShowTooltip] = useState(false);
    const handleToggleForceShowTooltip = useCallback(() => setForceShowTooltip(!forceShowTooltip), [forceShowTooltip]);
    const handleOpenTooltip = useCallback(() => setShowTooltip(true), []);
    const handleCloseTooltip = useCallback(() => setShowTooltip(false), []);
    return (
        <Tooltip
            content={annotation.text}
            openDelay={0}
            closeDelay={0}
            disabled={!annotation.text}
            showArrow
            open={showTooltip || forceShowTooltip}
        >
            <Box
                onClick={handleToggleForceShowTooltip}
                onMouseEnter={handleOpenTooltip}
                onMouseLeave={handleCloseTooltip}
                // cursor={annotation.text && forceShowTooltip ? 'pointer' : undefined}
                position='absolute'
                top={`${annotation.top}%`}
                left={`${annotation.left}%`}
                width={`${annotation.size * scale}px`}
                height={annotation.type === 'line' ? `${LINE_SIZE * scale}px` : `${annotation.size * scale}px`}
                border={annotation.type === 'line' ? undefined : `${LINE_SIZE * scale}px solid ${annotation.color}`}
                borderRadius={annotation.type === 'circle' ? '50%' : annotation.type === 'square' ? `${LINE_SIZE * scale * 2}px` : undefined}
                backgroundColor={annotation.type === 'line' ? annotation.color : undefined}
                transform={annotation.rotation ? `rotate(${annotation.rotation}deg)` : undefined}
                boxShadow={`0 0 0 ${LINE_SIZE / 3 * scale}px ${annotation.border}`}
            />
        </Tooltip>
    );
}
