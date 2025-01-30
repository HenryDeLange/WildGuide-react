import Markdown from 'markdown-to-jsx';
import { AnnotatedImage } from './AnnotatedImage';
import { InatObservation } from './InatObservation';
import { InatTaxon } from './InatTaxon';
import './markdown.css';
import { Popup } from './Popup';

type Props = {
    content: string;
}

export function ExtendedMarkdown({ content }: Readonly<Props>) {
    return (
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
    );
}
