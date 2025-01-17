import inatLogo from '@/assets/images/inaturalist/inat-logo-subtle.png';
import { selectAuthUserId } from '@/auth/authSlice';
import { useFindEntryQuery, useFindGuideOwnersQuery } from '@/redux/api/wildguideApi';
import { useAppSelector } from '@/redux/hooks';
import { Box, Heading, HStack, Image, Separator, Show, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCcw } from 'react-icons/lu';
import { MdEdit, MdKeyboardBackspace } from 'react-icons/md';
import { Button } from '../ui/button';
import { ErrorDisplay } from './ErrorDisplay';

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

    const handleEdit = useCallback(() => navigate({ to: '/guides/$guideId/entries/$entryId/edit' }), [navigate]);
    const handleBack = useCallback(() => navigate({ to: '/guides/$guideId', replace: true }), [navigate]);

    const handleRefresh = useCallback(() => {
        refetch();
        ownerRefetch();
    }, [ownerRefetch, refetch]);

    // RENDER
    return (
        <Box display='flex' justifyContent='center'>
            <ErrorDisplay error={isError ? error : ownerIsError ? ownerError : undefined} />
            <Show when={!isLoading && !ownerIsLoading} fallback={<Spinner size='lg' margin={8} />}>
                {data &&
                    <VStack width='100%'>
                        <Box width='100%' paddingTop={4} paddingX={4}>
                            <Stack direction='row'>
                                <Heading flex={1}>
                                    {data.name}
                                </Heading>
                                {(ownerData && ownerData.includes(userId ?? -1)) &&
                                    <Button
                                        size='lg'
                                        variant='ghost'
                                        color='fg.success'
                                        onClick={handleEdit}
                                        whiteSpace='nowrap'
                                    >
                                        <MdEdit />
                                        <Text>
                                            {t('editEntry')}
                                        </Text>
                                    </Button>
                                }
                                <Button
                                    aria-label={t('guideGridRefresh')}
                                    size='md'
                                    variant='ghost'
                                    onClick={handleRefresh}
                                    loading={isFetching || ownerIsFetching}
                                >
                                    <LuRefreshCcw />
                                </Button>
                            </Stack>
                            <HStack gap={4} color='fg.muted' fontSize='md'>
                                <Text>
                                    {t(`entryScientificRank${data.scientificRank}`)}:
                                </Text>
                                <Text fontStyle='italic' fontWeight='semibold'>
                                    {data.scientificName}
                                </Text>
                                {data.inaturalistTaxon &&
                                    <Box width='fit-content' marginLeft={8}>
                                        <a
                                            aria-label='iNaturalist'
                                            href={`https://www.inaturalist.org/taxa/${data.inaturalistTaxon}`}
                                            target='_blank'
                                            rel='noopener'
                                        >
                                            <HStack>
                                                <Image
                                                    src={inatLogo}
                                                    alt='iNaturalist'
                                                    boxSize={6}
                                                    borderRadius='full'
                                                    fit='cover'
                                                    loading='lazy'
                                                />
                                                <Text>
                                                    {t('newEntryInaturalistTaxon')}
                                                </Text>
                                            </HStack>
                                        </a>
                                    </Box>
                                }
                            </HStack>
                            {data.summary &&
                                <Box marginY={4}>
                                    <Heading size='sm'>
                                        {t('newEntrySummary')}
                                    </Heading>
                                    <Separator variant='dashed' />
                                    <Text paddingY={2}>
                                        {data.summary}
                                    </Text>
                                    <Separator variant='dashed' />
                                </Box>
                            }
                            {data.description &&
                                <Box marginY={4}>
                                    <Heading size='sm'>
                                        {t('newEntryDescription')}
                                    </Heading>
                                    <Separator variant='dashed' />
                                    <Text paddingY={2}>
                                        {data.description}
                                    </Text>
                                    <Separator variant='dashed' />
                                </Box>
                            }
                        </Box>
                        <Button variant='plain' width='full' marginTop={6} onClick={handleBack} color='fg.muted'>
                            <MdKeyboardBackspace />
                            <Text>{t('entryBack')}</Text>
                        </Button>
                    </VStack>
                }
            </Show>
        </Box>
    );
}
