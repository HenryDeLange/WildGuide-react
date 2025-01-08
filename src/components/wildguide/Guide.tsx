import { selectAuthUserId } from '@/auth/authSlice';
import { useFindGuideOwnersQuery, useFindGuideQuery } from '@/redux/api/wildguideApi';
import { useAppSelector } from '@/redux/hooks';
import { Box, Heading, Show, Spinner, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCcw } from 'react-icons/lu';
import { MdEdit } from 'react-icons/md';
import { Button } from '../ui/button';
import { ErrorDisplay } from './ErrorDisplay';

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

    const handleEditGuide = useCallback(() => navigate({ to: '/guides/$guideId/edit' }), [navigate]);

    const handleRefresh = useCallback(() => {
        refetch();
        ownerRefetch();
    }, [ownerRefetch, refetch]);

    // RENDER
    return (
        <Box display='flex' justifyContent='center'>
            <ErrorDisplay error={isError ? error : undefined} />
            <Show when={!isLoading && !ownerIsLoading} fallback={<Spinner size='lg' margin={8} />}>
                {data &&
                    <Box width='100%' padding={4}>
                        <Stack direction='row'>
                            <Heading flex={1}>
                                {data.name}
                            </Heading>
                            {(ownerData && ownerData.includes(userId ?? -1)) &&
                                <Button
                                    size='lg'
                                    variant='ghost'
                                    color='fg.success'
                                    onClick={handleEditGuide}
                                    whiteSpace='nowrap'
                                >
                                    <MdEdit />
                                    <Text>
                                        {t('guideEdit')}
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
                        <Show when={data.description}>
                            <Text>
                                {data.description}
                            </Text>
                        </Show>
                        <Show when={data.inaturalistCriteria}>
                            <Text>
                                {data.inaturalistCriteria}
                            </Text>
                        </Show>
                    </Box>
                }
            </Show>
        </Box>
    );
}
