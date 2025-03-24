import { DialogRootProps, Heading, IconButton, Separator, TabsContent, TabsList, TabsRoot, TabsTrigger, Text, useBreakpointValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BsChatSquareDots, BsGlobeEuropeAfrica, BsMarkdown } from 'react-icons/bs';
import { LuFileQuestion, LuImage, LuScanEye, LuTag } from 'react-icons/lu';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogRoot, DialogTitle, DialogTrigger } from '../ui/dialog';
import { MarkdownInputSnippetImage } from './MarkdownInputSnippetImage';
import { MarkdownInputSnippetInatObs } from './MarkdownInputSnippetInatObs';
import { MarkdownInputSnippetInatTax } from './MarkdownInputSnippetInatTax';
import { MarkdownInputSnippetInatTaxMap } from './MarkdownInputSnippetInatTaxMap';
import { MarkdownInputSnippetPopup } from './MarkdownInputSnippetPopup';
import { MarkdownInputSnippetSyntax } from './MarkdownInputSnippetSyntax';

export function MarkdownInputSnippets() {
    const { t } = useTranslation();
    const sizeWorkAround: DialogRootProps['size'] = useBreakpointValue({ base: 'full', lg: 'cover' }); // Setting the size like this seems to work better, for some reason
    return (
        <DialogRoot lazyMount placement='center' motionPreset='slide-in-bottom' size={sizeWorkAround}>
            <DialogTrigger asChild>
                <IconButton variant='outline' color='fg.info'>
                    <LuFileQuestion />
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
                                <BsMarkdown size={20} />
                                <Text display={{ base: 'none', lg: 'block' }}>
                                    {t('markdownSnippetsSyntax')}
                                </Text>
                            </TabsTrigger>
                            <TabsTrigger value='observation'>
                                <LuScanEye size={20} />
                                <Text display={{ base: 'none', md: 'block' }} truncate>
                                    {t('markdownSnippetsInatObservation')}
                                </Text>
                            </TabsTrigger>
                            <TabsTrigger value='taxon'>
                                <LuTag size={20} />
                                <Text display={{ base: 'none', md: 'block' }} truncate>
                                    {t('markdownSnippetsInatTaxon')}
                                </Text>
                            </TabsTrigger>
                            <TabsTrigger value='map'>
                                <BsGlobeEuropeAfrica size={20} />
                                <Text display={{ base: 'none', md: 'block' }} truncate>
                                    {t('markdownSnippetsInatTaxonMap')}
                                </Text>
                            </TabsTrigger>
                            <TabsTrigger value='image'>
                                <LuImage size={20} />
                                <Text display={{ base: 'none', md: 'block' }} truncate>
                                    {t('markdownSnippetsAnnotatedImage')}
                                </Text>
                            </TabsTrigger>
                            <TabsTrigger value='popup'>
                                <BsChatSquareDots size={20} />
                                <Text display={{ base: 'none', md: 'block' }} truncate>
                                    {t('markdownSnippetsPopup')}
                                </Text>
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
                        <TabsContent value='map'>
                            <MarkdownInputSnippetInatTaxMap />
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
