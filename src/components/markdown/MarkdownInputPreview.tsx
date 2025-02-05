import { Heading, IconButton, Separator } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuBookOpenText } from 'react-icons/lu';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogRoot, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ExtendedMarkdown } from './ExtendedMarkdown';

type Props = {
    markdown: string;
}

export function MarkdownInputPreview({ markdown }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <DialogRoot lazyMount placement='center' motionPreset='slide-in-bottom' size='cover'>
            <DialogTrigger asChild>
                <IconButton variant='outline'>
                    <LuBookOpenText />
                </IconButton>
            </DialogTrigger>
            <DialogContent width='100%' height='100%' overflow='auto'>
                <DialogTitle>
                    <Heading margin={2}>
                        {t('markdownPreview')}
                    </Heading>
                    <Separator />
                </DialogTitle>
                <DialogBody>
                    <ExtendedMarkdown content={markdown} />
                </DialogBody>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
}
