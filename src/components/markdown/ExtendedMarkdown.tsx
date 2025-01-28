import Markdown from 'markdown-to-jsx';
import { InatObservation } from './InatObservation';
import { InatTaxon } from './InatTaxon';
import './markdown.css';

type Props = {
    content: string;
}

export function ExtendedMarkdown({ content }: Readonly<Props>) {
    return (
        <Markdown
            className='markdown'
            options={{
                overrides: {
                    InatObservation: {
                        component: InatObservation
                    },
                    InatTaxon: {
                        component: InatTaxon
                    }
                }
            }}
        >
            {content}
        </Markdown>
    );
}
