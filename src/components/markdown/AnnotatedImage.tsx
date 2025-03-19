import { Box, Image, Text, useBreakpointValue } from '@chakra-ui/react';
import NamedColors from 'color-name';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Attribution } from '../custom/Attribution';
import { ImageZoomPopup } from '../custom/ImageZoomPopup';
import { Tooltip } from '../ui/tooltip';
import { MarkdownErrorBoundary } from './MarkdownErrorBoundary';

const IMAGE_SIZE = 180;
const LINE_SIZE = 3;

type Props = {
    /** URL of the image */
    url: string;
    annotations: AnnotationParams[] | string; // When coming from the Markdown it will be a string
    attribution?: string;
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

export function AnnotatedImage({ url, annotations, attribution }: Readonly<Props>) {
    const scale = useBreakpointValue({ base: 1, sm: 1.2, md: 1.5, lg: 1.85 }) ?? 1;
    return (
        <MarkdownErrorBoundary>
            <Box position='relative' display='inline-block' border='1px solid' borderRadius={3} bgColor='gray.muted'>
                <Image
                    src={url}
                    objectFit='contain'
                    minWidth={IMAGE_SIZE * scale}
                    width={IMAGE_SIZE * scale}
                    height={IMAGE_SIZE * scale}
                />
                <ImageZoomPopup url={url} />
                <AnnotationsLayer annotations={annotations} scale={scale} />
                <Attribution attribution={attribution} />
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
                cursor={annotation.text ? 'pointer' : undefined}
            />
        </Tooltip>
    );
}
