import { BackButton } from '@/components/custom/BackButton';
import { EditButton } from '@/components/custom/EditButton';
import { InatLinkCard } from '@/components/custom/InatLinkCard';
import { InatSelector, InatSelectorTypes } from '@/components/custom/InatSelector';
import { OptionsMenu } from '@/components/custom/OptionsMenu';
import { SummaryBox } from '@/components/custom/SummaryBox';
import { RangeMap } from '@/components/map/RangeMap';
import { ExtendedMarkdown } from '@/components/markdown/ExtendedMarkdown';
import { ToggleTip } from '@/components/ui/toggle-tip';
import { convertInatToEntryRank } from '@/redux/api/apiMapper';
import { useTaxonFindQuery } from '@/redux/api/inatApi';
import { useFindEntryQuery, useFindGuideQuery, useUpdateEntryMutation } from '@/redux/api/wildguideApi';
import { Box, Heading, HStack, IconButton, Show, Spinner, Stack, TabsContent, TabsList, TabsRoot, TabsTrigger, Text, useBreakpointValue } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { BookText, Globe, ImageIcon, ShieldX } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { useHeights } from '../hooks/uiHooks';
import { useIsOwner } from '../hooks/userHooks';
import { EntryPhotos } from './EntryPhotos';

type Props = {
    guideId: number;
    entryId: number;
}

export function Entry({ guideId, entryId }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/$guideId/entries/$entryId' });

    const { content, tabHeader } = useHeights();

    const {
        isOwner,
        isLoading: ownerIsLoading,
        isFetching: ownerIsFetching,
        isError: ownerIsError,
        error: ownerError,
        refetch: ownerRefetch
    } = useIsOwner(guideId);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch
    } = useFindEntryQuery({ guideId, entryId });

    const [
        doUpdate, {
            isLoading: updateIsLoading,
            isError: updateIsError,
            error: updateError
        }
    ] = useUpdateEntryMutation();

    const {
        data: guideData
    } = useFindGuideQuery({ guideId });

    const {
        data: taxonData
    } = useTaxonFindQuery({ id: data?.inaturalistTaxon ?? 0 }, {
        skip: !data?.inaturalistTaxon
    });
    const taxon = taxonData?.total_results === 1 ? taxonData.results[0] : undefined;

    const handleEdit = useCallback(() => navigate({ to: '/guides/$guideId/entries/$entryId/edit' }), [navigate]);
    const handleBack = useCallback(() => navigate({ to: '/guides/$guideId', hash: 'entries' }), [navigate]);

    const handleRefresh = useCallback(() => {
        refetch();
        ownerRefetch();
    }, [ownerRefetch, refetch]);

    const handleInatLink = useCallback((_type: InatSelectorTypes, inatId: number | null) => {
        if (data) {
            doUpdate({
                guideId,
                entryId,
                entryBase: {
                    ...data,
                    inaturalistTaxon: inatId ?? undefined
                }
            });
        }
    }, [data, doUpdate, entryId, guideId]);

    const inatTaxonMismatch = taxon?.name.toLowerCase() !== data?.scientificName.toLowerCase()
        || taxon?.rank.toLowerCase() !== data?.scientificRank.toLowerCase();

    const tabContentHeight = useBreakpointValue({ base: content - tabHeader, md: undefined });

    // RENDER
    return (
        <Box display='flex' flexDirection='column' alignItems='center'>
            <ErrorDisplay error={isError ? error : ownerIsError ? ownerError : updateIsError ? updateError : undefined} />
            <Show when={!isLoading && !ownerIsLoading && !updateIsLoading} fallback={<Spinner size='lg' margin={8} />}>
                {data &&
                    <Box width='100%'>
                        <Box id='page-header'>
                            <HStack width='100%' flexWrap='wrap' paddingX={4} paddingTop={2}>
                                <HStack>
                                    <BackButton titleKey='entryBack' handleBack={handleBack} />
                                    <Heading size={{base: 'lg', sm: '2xl', md: '3xl'}} alignSelf='flex-start'>
                                        {data.name}
                                    </Heading>
                                </HStack>
                                <Box flex='1' display='flex' justifyContent='flex-end'>
                                    <HStack
                                        wrap={{ base: 'wrap', sm: 'nowrap' }}
                                        alignItems='flex-end'
                                        justifyContent='flex-end'
                                    >
                                        {isOwner &&
                                            <>
                                                <InatSelector type='TAXON' select={handleInatLink} restrictRank ancestor={guideData?.inaturalistTaxon} />
                                                <EditButton titleKey='editEntry' handleEdit={handleEdit} />
                                            </>
                                        }
                                        <OptionsMenu
                                            type='ENTRY'
                                            guideId={guideId}
                                            entryId={entryId}
                                            handleRefresh={handleRefresh}
                                            isFetching={isFetching || ownerIsFetching}
                                        />
                                    </HStack>
                                </Box>
                            </HStack>
                            <HStack gap={4} paddingY={2} paddingX={8}>
                                <Text color='fg.subtle'>
                                    {t(`entryScientificRank${data.scientificRank}`)}
                                </Text>
                                <Text color='fg.muted' fontStyle='italic' fontWeight='semibold' fontSize='lg'>
                                    {data.scientificName}
                                </Text>
                                {inatTaxonMismatch &&
                                    <ToggleTip
                                        content={
                                            <Text fontSize='md' color='fg.warning' maxWidth='90vw'>
                                                {t('entryInatMismatch')}
                                            </Text>
                                        }
                                    >
                                        <IconButton
                                            variant='ghost'
                                            color='fg.warning'
                                            padding={0}
                                            marginTop={0}
                                            focusVisibleRing='none'
                                        >
                                            <ShieldX />
                                        </IconButton>
                                    </ToggleTip>
                                }
                            </HStack>
                        </Box>
                        <TabsRoot
                            size='lg' fitted
                            width='100%'
                            defaultValue={window.location.hash && window.location.hash.length > 1
                                ? window.location.hash.substring(1) : 'entry'}
                            variant='outline'
                            onValueChange={details => window.location.hash = details.value}
                            padding={2}
                            lazyMount
                        >
                            <TabsList id='tab-header'>
                                <TabsTrigger
                                    value='entry'
                                    fontSize={{ base: '1em', sm: '1.3em' }}
                                    _selected={{ bgColor: 'bg.subtle' }}
                                    padding={1}
                                >
                                    <BookText />
                                    <Text truncate>
                                        {t('entryTab')}
                                    </Text>
                                </TabsTrigger>
                                <TabsTrigger
                                    value='map'
                                    fontSize={{ base: '1em', sm: '1.3em' }}
                                    _selected={{ bgColor: 'bg.subtle' }}
                                    padding={1}
                                >
                                    <Globe />
                                    <Text truncate>
                                        {t('entryMapTab')}
                                    </Text>
                                </TabsTrigger>
                                <TabsTrigger
                                    value='photos'
                                    fontSize={{ base: '1em', sm: '1.3em' }}
                                    _selected={{ bgColor: 'bg.subtle' }}
                                    padding={1}
                                >
                                    <ImageIcon />
                                    <Text truncate>
                                        {t('entryPhotoTab')}
                                    </Text>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent
                                value='entry'
                                bgColor='bg.subtle'
                                borderColor='border'
                                borderWidth={1}
                                borderTopWidth={0}
                                borderRadius='sm'
                                padding={0}
                            >
                                <Stack width='100%' gap={2} padding={2}>
                                    <SummaryBox summary={data.summary} />
                                    <InatLinkCard type='TAXON' inatId={data.inaturalistTaxon} />
                                    <ExtendedMarkdown content={data.description} />
                                </Stack>
                            </TabsContent>
                            <TabsContent
                                value='map'
                                bgColor='bg.subtle'
                                borderColor='border'
                                borderWidth={1}
                                borderTopWidth={0}
                                borderRadius='sm'
                                padding={0}
                            >
                                {data.inaturalistTaxon && taxon &&
                                    <Box padding={2}>
                                        <RangeMap
                                            taxonId={data.inaturalistTaxon}
                                            rank={convertInatToEntryRank(taxon.rank) ?? data.scientificRank}
                                            parentId={taxon.parent_id}
                                            height={tabContentHeight}
                                        />
                                    </Box>
                                }
                            </TabsContent>
                            <TabsContent
                                value='photos'
                                bgColor='bg.subtle'
                                borderColor='border'
                                borderWidth={1}
                                borderTopWidth={0}
                                borderRadius='sm'
                                padding={0}
                            >
                                <EntryPhotos
                                    scientificName={data.scientificName}
                                    inaturalistTaxon={data.inaturalistTaxon}
                                    inaturalistProject={guideData?.inaturalistProject}
                                    height={tabContentHeight ? (tabContentHeight - 24) : undefined}
                                />
                            </TabsContent>
                        </TabsRoot>
                    </Box>
                }
            </Show>
        </Box>
    );
}
