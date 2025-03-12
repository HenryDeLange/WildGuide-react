import { Box } from '@chakra-ui/react';
import Markdown from 'markdown-to-jsx';
import { AnnotatedImage } from './AnnotatedImage';
import { InatObservation } from './InatObservation';
import { InatTaxon } from './InatTaxon';
import './markdown.css';
import { MarkdownErrorBoundary } from './MarkdownErrorBoundary';
import { Popup } from './Popup';

type Props = {
    content: string;
}

export function ExtendedMarkdown({ content }: Readonly<Props>) {
    return (
        <MarkdownErrorBoundary>
            <Box
                marginY={4}
                paddingY={1}
                paddingX={3}
                borderWidth={1}
                borderRadius='sm'
                boxShadow='md'
                borderColor='border'
            >
                <Markdown
                    className='markdown'
                    options={{
                        forceWrapper: true,
                        forceBlock: true,
                        overrides: {
                            InatObservation: { component: InatObservation },
                            InatTaxon: { component: InatTaxon },
                            Popup: { component: Popup },
                            AnnotatedImage: { component: AnnotatedImage }
                        }
                    }}
                >
                    {content}
                </Markdown>
            </Box>
        </MarkdownErrorBoundary>
    );
}
