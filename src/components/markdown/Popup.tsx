import { ReactNode } from 'react';
import { Button } from '../ui/button';
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../ui/popover';
import { MarkdownErrorBoundary } from './MarkdownErrorBoundary';

type Props = {
    text: string;
    content: ReactNode;
}

export function Popup({ text, content }: Readonly<Props>) {
    return (
        <MarkdownErrorBoundary>
            <PopoverRoot lazyMount>
                <PopoverTrigger asChild>
                    <Button variant='subtle' padding={1} height='fit'>
                        {text}
                    </Button>
                </PopoverTrigger>
                <PopoverContent width='auto' height='auto'>
                    <PopoverArrow />
                    <PopoverBody>
                        {content}
                    </PopoverBody>
                </PopoverContent>
            </PopoverRoot>
        </MarkdownErrorBoundary>
    );
}
