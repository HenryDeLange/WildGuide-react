import inatLogo from '@/assets/images/inaturalist/inat-logo-subtle.png';
import { selectAuthUserId } from '@/auth/authSlice';
import { InatResultCard, InaturalistSelector } from '@/components/custom/InaturalistSelector';
import { OptionsMenu } from '@/components/custom/OptionsMenu';
import { ExtendedMarkdown } from '@/components/markdown/ExtendedMarkdown';
import { useTaxonFindQuery } from '@/redux/api/inatApi';
import { useFindEntryQuery, useFindGuideOwnersQuery, useUpdateEntryMutation } from '@/redux/api/wildguideApi';
import { useAppSelector } from '@/redux/hooks';
import { Box, Heading, HStack, IconButton, Image, Show, Spinner, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MdEdit, MdKeyboardBackspace } from 'react-icons/md';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { Button } from '../../ui/button';

type Props = {
    guideId: number;
    entryId: number;
}

export function Entry({ guideId, entryId }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/$guideId/entries/$entryId' });

    const userId = useAppSelector(selectAuthUserId);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch
    } = useFindEntryQuery({ guideId, entryId });

    const {
        data: ownerData,
        isLoading: ownerIsLoading,
        isFetching: ownerIsFetching,
        isError: ownerIsError,
        error: ownerError,
        refetch: ownerRefetch
    } = useFindGuideOwnersQuery({ guideId });
    const isOwner = ownerData?.map(owner => owner.userId).includes(userId ?? -1) ?? false;

    const [
        doUpdate, {
            isLoading: updateIsLoading,
            isError: updateIsError,
            error: updateError
        }
    ] = useUpdateEntryMutation();

    const {
        data: taxonData,
        isLoading: taxonIsLoading
    } = useTaxonFindQuery({ id: data?.inaturalistTaxon ?? 0 }, {
        skip: !data?.inaturalistTaxon
    });
    const taxon = taxonData?.total_results === 1 ? taxonData.results[0] : undefined;

    const handleEdit = useCallback(() => navigate({ to: '/guides/$guideId/entries/$entryId/edit' }), [navigate]);
    const handleBack = useCallback(() => navigate({ to: '/guides/$guideId', replace: true }), [navigate]);

    const handleRefresh = useCallback(() => {
        refetch();
        ownerRefetch();
    }, [ownerRefetch, refetch]);

    const handleInatLink = useCallback((item: InatResultCard | null) => {
        if (data) {
            doUpdate({
                guideId,
                entryId,
                entryBase: {
                    ...data,
                    inaturalistTaxon: item?.id ?? undefined
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
                    <Box width='100%' paddingX={4} paddingY={2}>
                        <Box id='page-header'>
                            <HStack flex={1} flexWrap='wrap'>
                                <Heading size='4xl' alignSelf='flex-start'>
                                    {data.name}
                                </Heading>
                                <HStack flex={1} justifyContent='flex-end'>
                                    {isOwner &&
                                        <>
                                            <InaturalistSelector type='TAXON' select={handleInatLink} />
                                            <Button
                                                size='lg'
                                                variant='ghost'
                                                color='fg.info'
                                                onClick={handleEdit}
                                                whiteSpace='nowrap'
                                            >
                                                <MdEdit />
                                                <Text>
                                                    {t('editEntry')}
                                                </Text>
                                            </Button>
                                        </>
                                    }
                                    <OptionsMenu
                                        type='entry'
                                        guideId={guideId}
                                        entryId={entryId}
                                        handleRefresh={handleRefresh}
                                        isFetching={isFetching || ownerIsFetching}
                                    />
                                </HStack>
                            </HStack>
                            <HStack gap={6} color='fg.muted' marginTop={2} marginBottom={6}>
                                <Text fontSize='md' fontStyle='italic' fontWeight='semibold'>
                                    {data.scientificName}
                                </Text>
                                <Text fontSize='sm'>
                                    {`(${t(`entryScientificRank${data.scientificRank}`)})`}
                                </Text>
                            </HStack>
                            {data.summary &&
                                <Box
                                    marginY={4}
                                    paddingX={4}
                                    paddingY={2}
                                    borderWidth={1}
                                    borderRadius='sm'
                                    boxShadow='xs'
                                    borderColor='border.muted'
                                >
                                    <Text fontSize='lg'>
                                        {data.summary}
                                    </Text>
                                </Box>
                            }
                            {data.inaturalistTaxon &&
                                <Show when={!taxonIsLoading} fallback={<Spinner size='sm' margin={2} />}>
                                    {taxon &&
                                        <Box padding={2} borderWidth={1} borderRadius='sm' boxShadow='sm'>
                                            <HStack>
                                                <a
                                                    aria-label='iNaturalist'
                                                    href={`https://www.inaturalist.org/taxa/${taxon.id}`}
                                                    target='_blank'
                                                    rel='noopener'
                                                >
                                                    <IconButton aria-label='iNaturalist' variant='ghost'>
                                                        <Image
                                                            src={inatLogo}
                                                            alt='iNaturalist'
                                                            objectFit='contain'
                                                            borderRadius='md'
                                                            width='40px'
                                                            height='40px'
                                                            loading='lazy'
                                                        />
                                                    </IconButton>
                                                </a>
                                                <Image
                                                    src={taxon.default_photo?.square_url ?? inatLogo}
                                                    alt={taxon.preferred_common_name ?? taxon.name}
                                                    objectFit='cover'
                                                    borderRadius='md'
                                                    width='60px'
                                                    height='60px'
                                                />
                                                <VStack gap={0} textAlign='left'>
                                                    <Heading size='lg' width='100%'>
                                                        {taxon.preferred_common_name ?? taxon.name}
                                                    </Heading>
                                                    <HStack width='100%'>
                                                        <Text fontSize='md' color='fg.muted' fontStyle='italic'>
                                                            {taxon.name}
                                                        </Text>
                                                        <Text fontSize='sm' color='fg.muted'>
                                                            ({t(`entryScientificRank${taxon.rank.toUpperCase()}`)})
                                                        </Text>
                                                    </HStack>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                    }
                                </Show>
                            }
                            {data.description &&
                                <Box width='100%'>
                                    <ExtendedMarkdown content={data.description} />
                                </Box>
                            }
                        </Box>
                        <Button variant='plain' width='full' marginTop={6} onClick={handleBack} color='fg.muted'>
                            <MdKeyboardBackspace />
                            <Text>{t('entryBack')}</Text>
                        </Button>
                    </Box>
                }
            </Show>
        </Box>
    );
}
