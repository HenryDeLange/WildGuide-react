import { Box, defineStyle, Field, Input, InputProps } from '@chakra-ui/react';

// TODO: Figure out how to support placeholder text better

type Props = Omit<InputProps, 'variant' | 'placeholder'> & { label: string; }

export function FloatingInput({ label, ...props }: Readonly<Props>) {
    return (
        <Field.Root>
            <Box pos='relative' w='full'>
                <Input className='peer' variant='flushed' {...props} placeholder='' />
                <Field.Label css={floatingStyles}>
                    {label}
                </Field.Label>
            </Box>
        </Field.Root>
    );
}

const floatingStyles = defineStyle({
    pos: 'absolute',
    top: '-3',
    fontWeight: 'semibold',
    pointerEvents: 'none',
    transition: 'position',
    _peerPlaceholderShown: {
        top: '2.5',
        width: 'full'
    },
    _peerFocusVisible: {
        top: '-3',
        width: 'fit-content'
    }
});
