import { Box, IconButton } from '@chakra-ui/react';
import { LuCopyright } from 'react-icons/lu';
import { ToggleTip } from '../ui/toggle-tip';

type Props = {
    attribution?: string;
}

export function Attribution({ attribution }: Readonly<Props>) {
    if (!attribution)
        return null;
    return (
        <Box position='absolute' bottom={1} right={1}>
            <ToggleTip content={attribution}>
                <IconButton
                    size='2xs'
                    variant='ghost'
                    color='fg.subtle'
                    focusVisibleRing='none'
                >
                    <LuCopyright />
                </IconButton>
            </ToggleTip>
        </Box>
    );
}