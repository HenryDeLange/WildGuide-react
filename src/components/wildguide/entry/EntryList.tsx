import { selectAuthUserId } from '@/auth/authSlice';
import { InputGroup } from '@/components/ui/input-group';
import { Entry, useFindEntriesQuery } from '@/redux/api/wildguideApi';
import { useAppSelector } from '@/redux/hooks';
import { Box, Input, Separator, Show, Spinner, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuSearch } from 'react-icons/lu';
import { MdAddCircleOutline } from 'react-icons/md';
import { useDebounce } from 'use-debounce';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { InfiniteVirtualList } from '../../custom/InfiniteVirtualList';
import { Button } from '../../ui/button';
import { ENTRY_LIST_ITEM_HEIGHT, EntryListItem } from './EntryListItem';

type Props = {
    guideId: number;
    triggerRefresh: boolean;
    handleRefreshComplete: () => void;
}

export function EntryList({ guideId, triggerRefresh, handleRefreshComplete }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/$guideId' });

    const userId = useAppSelector(selectAuthUserId);

    const [page, setPage] = useState<number>(0);
    const [pageQueue, setPageQueue] = useState<number[]>([]);
    const [items, setItems] = useState<Entry[]>([]);

    // TODO: In the future add a toggle to define at what taxon rank the data should be shown (fetched from iNat - species vs subspecies)
    const [filter, setFilter] = useState<string | undefined | null>(undefined);
    const [debouncedFilter] = useDebounce(filter, 500);

    const { data, isLoading, isFetching, isError, error, refetch } = useFindEntriesQuery({
        guideId,
        page,
        name: debouncedFilter ?? undefined
    });

    useEffect(() => {
        if (!isFetching && pageQueue.length > 0) {
            setPage(pageQueue[0]);
            setPageQueue((prevQueue) => prevQueue.slice(1));
        }
    }, [isFetching, pageQueue]);

    useEffect(() => {
        if (!isFetching) {
            setItems((prev) => {
                const existingIds = new Set(prev.map(item => item.id));
                const newItems = (data?.data ?? []).filter(item => !existingIds.has(item.id));
                return [...prev, ...newItems];
            });
        }
    }, [data?.data, isFetching]);

    useEffect(() => {
        if (debouncedFilter || debouncedFilter === null) {
            setItems([]);
            setPage(0);
            // dispatch(wildguideApi.util.invalidateTags(['Entries']));
            refetch();
        }
    }, [debouncedFilter, refetch]);

    const handleLoadMoreItems = useCallback((nextPage: number) => {
        if (nextPage <= ((data?.totalRecords ?? 0) / (data?.pageSize ?? 0)) && !pageQueue.includes(nextPage)) {
            setPageQueue(prev => [...prev, nextPage]);
        }
    }, [data?.pageSize, data?.totalRecords, pageQueue]);

    const handleCreate = useCallback(() => navigate({ to: '/guides/$guideId/entries/create' }), [navigate]);

    useEffect(() => {
        setPage(0);
        setPageQueue([]);
        setItems([]);
        // dispatch(wildguideApi.util.invalidateTags(['Entries']));
        refetch();
    }, [triggerRefresh, refetch]);

    useEffect(() => {
        if (triggerRefresh && !isLoading) {
            handleRefreshComplete();
        }
    }, [handleRefreshComplete, isLoading, triggerRefresh]);

    const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value.length > 0 ? event.target.value : null);
        // TODO: Implement the rest of the filter logic
    }, []);

    const renderItem = useCallback((item: Entry, index: number) => (
        <EntryListItem guideId={guideId} entry={item} index={index} />
    ), [guideId]);

    const hasNextPage = items.length < (data?.totalRecords ?? 0);

    // RENDER
    return (
        <Box>
            <Box id='grid-header'>
                <Stack direction='row' justifyContent='space-between' gap={8} padding={2}>
                    <InputGroup startElement={<LuSearch />}>
                        <Input type='search' size='md' value={filter ?? ''} onChange={handleSearch} />
                    </InputGroup>
                    <Stack direction={{ base: 'column', md: 'row' }} alignItems='flex-end' justifyContent='flex-end'>
                        {userId !== null &&
                            <Button
                                size='lg'
                                variant='ghost'
                                color='fg.info'
                                onClick={handleCreate}
                                whiteSpace='nowrap'
                            >
                                <MdAddCircleOutline />
                                <Text>
                                    {t('newEntry')}
                                </Text>
                            </Button>
                        }
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
                    itemHeight={ENTRY_LIST_ITEM_HEIGHT}
                    heightDelta={18}
                />
            </Show>
        </Box>
    );
}
