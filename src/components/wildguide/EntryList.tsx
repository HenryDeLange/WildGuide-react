import { selectAuthUserId } from '@/auth/authSlice';
import { Entry, useFindEntriesQuery, wildguideApi } from '@/redux/api/wildguideApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Box, Heading, Separator, Show, Spinner, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCcw } from 'react-icons/lu';
import { MdAddCircleOutline } from 'react-icons/md';
import { InfiniteVirtualList } from '../custom/InfiniteVirtualList';
import { Button } from '../ui/button';
import { EntryListItem } from './EntryListItem';
import { ErrorDisplay } from './ErrorDisplay';

// TODO: In the future add a toggle to define at what taxon rank the data should be shown (fetched from iNat - species vs subspecies)

type Props = {
    guideId: number;
}

export function EntryList({ guideId }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/$guideId' });
    const dispatch = useAppDispatch();

    const userId = useAppSelector(selectAuthUserId);

    const [page, setPage] = useState<number>(0);
    const [pageQueue, setPageQueue] = useState<number[]>([]);
    const [items, setItems] = useState<Entry[]>([]);

    const { data, isLoading, isFetching, isError, error } = useFindEntriesQuery({ guideId, page });

    useEffect(() => {
        if (!isFetching && pageQueue.length > 0) {
            setPage(pageQueue[0]);
            setPageQueue((prevQueue) => prevQueue.slice(1));
        }
    }, [isFetching, pageQueue]);

    useEffect(() => {
        setItems((prev) => {
            const existingIds = new Set(prev.map(item => item.id));
            const newItems = (data?.data ?? []).filter(item => !existingIds.has(item.id));
            return [...prev, ...newItems];
        });
    }, [data?.data]);

    const handleLoadMoreItems = useCallback((nextPage: number) => {
        if (nextPage <= ((data?.totalRecords ?? 0) / (data?.pageSize ?? 0)) && !pageQueue.includes(nextPage)) {
            setPageQueue(prev => [...prev, nextPage]);
        }
    }, [data?.pageSize, data?.totalRecords, pageQueue]);

    const handleCreate = useCallback(() => navigate({ to: '/guides/$guideId/entries/create' }), [navigate]);

    const handleRefresh = useCallback(() => {
        setPage(0);
        setPageQueue([]);
        setItems([]);
        dispatch(wildguideApi.util.invalidateTags(['Entries']));
    }, [dispatch]);

    const renderItem = useCallback((item: Entry, index: number) => <EntryListItem guideId={guideId} entry={item} index={index} />,
        [guideId]);

    const hasNextPage = items.length < (data?.totalRecords ?? 0);

    // RENDER
    return (
        <Box>
            <Box>
                <Stack direction='row' justifyContent='space-between' gap={8}>
                    <Box marginX={4} marginY={2}>
                        <Heading>
                            {t('entryListTitle')}
                        </Heading>
                        <Text>
                            {t('entryListSubTitle')}
                        </Text>
                    </Box>
                    <Stack direction={{ base: 'column', md: 'row' }} alignItems='flex-end' justifyContent='flex-end'>
                        {userId !== null &&
                            <Button
                                size='lg'
                                variant='ghost'
                                color='fg.success'
                                onClick={handleCreate}
                                whiteSpace='nowrap'
                            >
                                <MdAddCircleOutline />
                                <Text>
                                    {t('newEntry')}
                                </Text>
                            </Button>
                        }
                        <Button
                            aria-label={t('entryListRefresh')}
                            size='md'
                            variant='ghost'
                            onClick={handleRefresh}
                            loading={isFetching}
                        >
                            <LuRefreshCcw />
                        </Button>
                    </Stack>
                </Stack>
                <Separator />
            </Box>
            <ErrorDisplay error={isError ? error : undefined} />
            <Show
                when={!isLoading}
                fallback={
                    <Box textAlign='center' margin={4}>
                        <Spinner size='lg' />
                    </Box>
                }>
                <InfiniteVirtualList
                    data={items}
                    renderItem={renderItem}
                    hasNextPage={hasNextPage}
                    loadNextPage={handleLoadMoreItems}
                    loading={isFetching}
                    pageSize={data?.pageSize ?? 0}
                    totalCount={data?.totalRecords ?? 0}
                />
            </Show>
        </Box>
    );
}
