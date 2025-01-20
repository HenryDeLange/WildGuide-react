import inatLogo from '@/assets/images/inaturalist/inat-logo-subtle.png';
import { selectAuthUserId } from '@/auth/authSlice';
import { useFindGuideOwnersQuery, useFindGuideQuery } from '@/redux/api/wildguideApi';
import { useAppSelector } from '@/redux/hooks';
import { Box, Heading, HStack, Icon, Image, Separator, Show, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCcw } from 'react-icons/lu';
import { MdEdit, MdOutlineLock } from 'react-icons/md';
import { Button } from '../ui/button';
import { Tooltip } from '../ui/tooltip';
import { EntryList } from './EntryList';
import { ErrorDisplay } from './ErrorDisplay';
import { GuideLinkUsers } from './GuideLinkUsers';

type Props = {
    guideId: number;
}

export function Guide({ guideId }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/$guideId' });

    const userId = useAppSelector(selectAuthUserId);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch
    } = useFindGuideQuery({ guideId });

    const {
        data: ownerData,
        isLoading: ownerIsLoading,
        isFetching: ownerIsFetching,
        isError: ownerIsError,
        error: ownerError,
        refetch: ownerRefetch
    } = useFindGuideOwnersQuery({ guideId });

    const isOwner = ownerData?.map(owner => owner.userId).includes(userId ?? -1) ?? false;

    const handleEdit = useCallback(() => navigate({ to: '/guides/$guideId/edit' }), [navigate]);

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
                                <HStack flex={1}>
                                    <Show when={data.visibility === 'PRIVATE'}>
                                        <Tooltip content={t('newGuideVisibilityHelpPRIVATE')} showArrow>
                                            <Icon size='md'>
                                                <MdOutlineLock />
                                            </Icon>
                                        </Tooltip>
                                    </Show>
                                    <Heading>
                                        {data.name}
                                    </Heading>
                                </HStack>
                                {isOwner &&
                                    <>
                                        <GuideLinkUsers guideId={guideId} />
                                        <Button
                                            size='lg'
                                            variant='ghost'
                                            color='fg.info'
                                            onClick={handleEdit}
                                            whiteSpace='nowrap'
                                        >
                                            <MdEdit />
                                            <Text>
                                                {t('editGuide')}
                                            </Text>
                                        </Button>
                                    </>
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
                            {data.inaturalistCriteria &&
                                <Box width='fit-content' justifySelf='flex-end'>
                                    <a
                                        aria-label='iNaturalist'
                                        href={`https://www.inaturalist.org/projects/${data.inaturalistCriteria}`}
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
                                            <Text>{t('newGuideInaturalistCriteria')}</Text>
                                        </HStack>
                                    </a>
                                </Box>
                            }
                            {data.description &&
                                <Box marginY={4}>
                                    <Separator variant='dashed' />
                                    <Text paddingY={2}>
                                        {data.description}
                                    </Text>
                                    <Separator variant='dashed' />
                                </Box>
                            }
                        </Box>
                        <Separator />
                        <EntryList guideId={guideId} />
                    </VStack>
                }
            </Show>
        </Box>
    );
}
