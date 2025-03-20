import { Box } from '@chakra-ui/react';
import Markdown from 'markdown-to-jsx';
import { AnnotatedImage } from './AnnotatedImage';
import { InatObservation } from './InatObservation';
import { InatTaxon } from './InatTaxon';
import { InatTaxonMap } from './InatTaxonMap';
import './markdown.css';
import { MarkdownErrorBoundary } from './MarkdownErrorBoundary';
import { Popup } from './Popup';

type Props = {
    content?: string;
}

export function ExtendedMarkdown({ content }: Readonly<Props>) {
    if (!content)
        return null;
    return (
        <MarkdownErrorBoundary>
            <Box
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
                            AnnotatedImage: { component: AnnotatedImage },
                            InatTaxonMap: { component: InatTaxonMap }
                        }
                    }}
                >
                    {content}
                </Markdown>
            </Box>
        </MarkdownErrorBoundary>
    );
}
