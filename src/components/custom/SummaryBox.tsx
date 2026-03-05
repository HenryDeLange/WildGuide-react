import { Blockquote, Float, useBreakpointValue } from '@chakra-ui/react';
import { Info } from 'lucide-react';

type Props = {
    summary?: string;
}

export function SummaryBox({ summary }: Readonly<Props>) {
    const useMobileLayout = useBreakpointValue({ base: true, md: false });
    if (!summary)
        return null;
    return (
        <Blockquote.Root variant='subtle' marginLeft={!useMobileLayout ? 6 : undefined} paddingLeft={2}>
            {!useMobileLayout &&
                <Float placement='middle-start' offsetX={-5}>
                    <Blockquote.Icon asChild>
                        <Info />
                    </Blockquote.Icon>
                </Float>
            }
            <Blockquote.Content fontSize='lg' whiteSpace='pre-line'>
                {summary}
            </Blockquote.Content>
        </Blockquote.Root>
    );
}
