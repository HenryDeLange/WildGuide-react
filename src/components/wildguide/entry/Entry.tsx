import inatLogo from '@/assets/images/inaturalist/inat-logo-subtle.png';
import { selectAuthUserId } from '@/auth/authSlice';
import { OptionsMenu } from '@/components/custom/OptionsMenu';
import { ExtendedMarkdown } from '@/components/markdown/ExtendedMarkdown';
import { useFindEntryQuery, useFindGuideOwnersQuery } from '@/redux/api/wildguideApi';
import { useAppSelector } from '@/redux/hooks';
import { Box, Heading, HStack, Image, Show, Spinner, Text } from '@chakra-ui/react';
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

    const handleEdit = useCallback(() => navigate({ to: '/guides/$guideId/entries/$entryId/edit' }), [navigate]);
    const handleBack = useCallback(() => navigate({ to: '/guides/$guideId', replace: true }), [navigate]);

    const handleRefresh = useCallback(() => {
        refetch();
        ownerRefetch();
    }, [ownerRefetch, refetch]);

    // RENDER
    return (
        <Box display='flex' flexDirection='column' alignItems='center'>
            <ErrorDisplay error={isError ? error : ownerIsError ? ownerError : undefined} />
            <Show when={!isLoading && !ownerIsLoading} fallback={<Spinner size='lg' margin={8} />}>
                {data &&
                    <Box width='100%' paddingX={4} paddingY={2}>
                        <Box id='page-header'>
                            <HStack flex={1} flexWrap='wrap'>
                                <Heading size='3xl'>
                                    {data.name}
                                </Heading>
                                <HStack flex={1} justifyContent='flex-end'>
                                    {isOwner &&
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
                                    {`(${t(`entryScientificRank${data.scientificRank}`).toLowerCase()})`}
                                </Text>
                            </HStack>
                            {data.summary &&
                                <Box
                                    marginY={4}
                                    marginBottom={6}
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
                                <Box width='fit-content'>
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
