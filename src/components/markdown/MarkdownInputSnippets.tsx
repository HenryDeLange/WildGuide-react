import { Heading, IconButton, Separator, TabsContent, TabsList, TabsRoot, TabsTrigger } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BsChatSquareDots, BsMarkdown } from 'react-icons/bs';
import { LuFileCode2, LuImage, LuScanEye, LuTag } from 'react-icons/lu';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogRoot, DialogTitle, DialogTrigger } from '../ui/dialog';
import { MarkdownInputSnippetImage } from './MarkdownInputSnippetImage';
import { MarkdownInputSnippetInatObs } from './MarkdownInputSnippetInatObs';
import { MarkdownInputSnippetInatTax } from './MarkdownInputSnippetInatTax';
import { MarkdownInputSnippetPopup } from './MarkdownInputSnippetPopup';
import { MarkdownInputSnippetSyntax } from './MarkdownInputSnippetSyntax';

export function MarkdownInputSnippets() {
    const { t } = useTranslation();
    return (
        <DialogRoot lazyMount placement='center' motionPreset='slide-in-bottom' size='cover'>
            <DialogTrigger asChild>
                <IconButton variant='outline'>
                    <LuFileCode2 />
                </IconButton>
            </DialogTrigger>
            <DialogContent width='100%' height='100%' overflow='auto'>
                <DialogTitle>
                    <Heading margin={2}>
                        {t('markdownSnippets')}
                    </Heading>
                    <Separator />
                </DialogTitle>
                <DialogBody>
                    <TabsRoot lazyMount defaultValue='syntax'>
                        <TabsList>
                            <TabsTrigger value='syntax'>
                                <BsMarkdown />
                                {t('markdownSnippetsSyntax')}
                            </TabsTrigger>
                            <TabsTrigger value='observation'>
                                <LuScanEye />
                                {t('markdownSnippetsInatObservation')}
                            </TabsTrigger>
                            <TabsTrigger value='taxon'>
                                <LuTag />
                                {t('markdownSnippetsInatTaxon')}
                            </TabsTrigger>
                            <TabsTrigger value='image'>
                                <LuImage />
                                {t('markdownSnippetsAnnotatedImage')}
                            </TabsTrigger>
                            <TabsTrigger value='popup'>
                                <BsChatSquareDots />
                                {t('markdownSnippetsPopup')}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value='syntax'>
                            <MarkdownInputSnippetSyntax />
                        </TabsContent>
                        <TabsContent value='observation'>
                            <MarkdownInputSnippetInatObs />
                        </TabsContent>
                        <TabsContent value='taxon'>
                            <MarkdownInputSnippetInatTax />
                        </TabsContent>
                        <TabsContent value='image'>
                            <MarkdownInputSnippetImage />
                        </TabsContent>
                        <TabsContent value='popup'>
                            <MarkdownInputSnippetPopup />
                        </TabsContent>
                    </TabsRoot>
                </DialogBody>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
}
