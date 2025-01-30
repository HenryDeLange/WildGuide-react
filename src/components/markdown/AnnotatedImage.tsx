import { Box, Image } from '@chakra-ui/react';
import NamedColors from 'color-name';
import { useCallback, useState } from 'react';
import { Tooltip } from '../ui/tooltip';

const LINE_SIZE = 5;

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
    left: number;
    color: keyof typeof NamedColors;
    border?: 'white' | 'black';
    /** Degrees to rotate */
    rotation?: number;
    text?: string;
}

export function AnnotatedImage({ url, annotations }: Readonly<Props>) {
    const parsedAnnotations: AnnotationParams[] = typeof annotations === 'string'
        ? JSON.parse(annotations.slice(1, -1).replace(/\n/g, '')) // TODO: Try to handle this better (instead of this black-magic parsing)
        : annotations;
    return (
        <Box position='relative' display='inline-block' border='1px solid' borderRadius={3}>
            <Image
                src={url}
                objectFit='contain'
                width={{ base: 100, sm: 150, md: 200, lg: 250 }}
                height={{ base: 100, sm: 150, md: 200, lg: 250 }}
            />
            {parsedAnnotations.map((annotation, index) => (
                <Annotation
                    key={`${index}_${annotation.type}_${annotation.top}_${annotation.left}_${annotation.size}`}
                    annotation={annotation}
                />
            ))}
        </Box>
    );
}

type AnnotationProps = {
    annotation: AnnotationParams;
}

function Annotation({ annotation }: Readonly<AnnotationProps>) {
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
                width={`${annotation.size}px`}
                height={`${annotation.type === 'line' ? LINE_SIZE : annotation.size}px`}
                border={annotation.type === 'line' ? undefined : `${LINE_SIZE}px solid ${annotation.color}`}
                borderRadius={annotation.type === 'circle' ? '50%' : '10%'}
                backgroundColor={annotation.type === 'line' ? annotation.color : undefined}
                transform={annotation.rotation ? `rotate(${annotation.rotation}deg)` : undefined}
                boxShadow={`0 0 0 2px ${annotation.border}`}
            />
        </Tooltip>
    );
}
