import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Button } from '../ui/button';
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../ui/popover';

type Props = {
    text: string;
    content: ReactNode;
}

export function Popup({ text, content }: Readonly<Props>) {
    return (
        <PopoverRoot lazyMount>
            <PopoverTrigger asChild>
                <Button variant='subtle'>
                    {text}
                </Button>
            </PopoverTrigger>
            <PopoverContent width='auto' height='auto'>
                <PopoverArrow />
                <PopoverBody>
                    <Box className='no-inherit'>
                        {content}
                    </Box>
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    );
}
