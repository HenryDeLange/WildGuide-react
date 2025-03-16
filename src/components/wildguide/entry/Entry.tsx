import { BackButton } from '@/components/custom/BackButton';
import { EditButton } from '@/components/custom/EditButton';
import { InatLinkCard } from '@/components/custom/InatLinkCard';
import { InatSelector, InatSelectorTypes } from '@/components/custom/InatSelector';
import { OptionsMenu } from '@/components/custom/OptionsMenu';
import { RangeMap } from '@/components/map/RangeMap';
import { ExtendedMarkdown } from '@/components/markdown/ExtendedMarkdown';
import { convertInatRanks } from '@/redux/api/apiMapper';
import { useTaxonFindQuery } from '@/redux/api/inatApi';
import { useFindEntryQuery, useFindGuideQuery, useUpdateEntryMutation } from '@/redux/api/wildguideApi';
import { Box, Heading, HStack, Show, Spinner, TabsContent, TabsList, TabsRoot, TabsTrigger, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BsGlobeEuropeAfrica } from 'react-icons/bs';
import { LuBookText } from 'react-icons/lu';
import { MdOutlinePhoto } from 'react-icons/md';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { useIsOwner } from '../hooks/userHooks';
import { EntryPhotos } from './EntryPhotos';

type Props = {
    guideId: number;
    entryId: number;
}

export function Entry({ guideId, entryId }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/$guideId/entries/$entryId' });

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
                                    <Heading size='3xl' alignSelf='flex-start'>
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
                                    fontSize='1.3em'
                                    lineHeight='1em'
                                    _selected={{ bgColor: 'bg.subtle' }}
                                >
                                    <LuBookText />
                                    {t('entryTab')}
                                </TabsTrigger>
                                <TabsTrigger
                                    value='map'
                                    fontSize='1.3em'
                                    lineHeight='1em'
                                    _selected={{ bgColor: 'bg.subtle' }}
                                >
                                    <BsGlobeEuropeAfrica />
                                    {t('entryMapTab')}
                                </TabsTrigger>
                                <TabsTrigger
                                    value='photos'
                                    fontSize='1.3em'
                                    lineHeight='1em'
                                    _selected={{ bgColor: 'bg.subtle' }}
                                >
                                    <MdOutlinePhoto />
                                    {t('entryPhotoTab')}
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
                                <VStack width='100%'>
                                    <Box width='100%' paddingTop={4} paddingX={4}>
                                        {data.summary &&
                                            <Box
                                                marginBottom={4}
                                                paddingX={4}
                                                paddingY={2}
                                                borderWidth={1}
                                                borderRadius='sm'
                                                boxShadow='sm'
                                                borderColor='border'
                                            >
                                                <Text fontSize='lg'>
                                                    {data.summary}
                                                </Text>
                                            </Box>
                                        }
                                        {data.inaturalistTaxon &&
                                            <InatLinkCard type='TAXON' inatId={data.inaturalistTaxon} />
                                        }
                                        {data.description &&
                                            <ExtendedMarkdown content={data.description} />
                                        }
                                    </Box>
                                </VStack>
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
                                    <Box padding={1}>
                                        <RangeMap
                                            taxonId={data.inaturalistTaxon}
                                            rank={convertInatRanks(taxon.rank) ?? data.scientificRank}
                                            parentId={taxon.parent_id}
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
                                    inaturalistTaxon={data.inaturalistTaxon}
                                    inaturalistProject={guideData?.inaturalistProject}
                                />
                            </TabsContent>
                        </TabsRoot>
                    </Box>
                }
            </Show>
        </Box>
    );
}
