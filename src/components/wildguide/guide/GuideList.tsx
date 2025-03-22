import { selectAuthUserId } from '@/auth/authSlice';
import { InputGroup } from '@/components/ui/input-group';
import { Guide, useFindGuidesQuery } from '@/redux/api/wildguideApi';
import { useAppSelector } from '@/redux/hooks';
import { Box, Heading, HStack, Input, Separator, Show, Spinner, Text, useBreakpointValue } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCcw, LuSearch } from 'react-icons/lu';
import { MdAddCircleOutline } from 'react-icons/md';
import { useDebounce } from 'use-debounce';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { InfiniteVirtualGrid } from '../../custom/InfiniteVirtualGrid';
import { Button } from '../../ui/button';
import { useHeights, useShowButtonLabels } from '../hooks/uiHooks';
import { GuideListItem } from './GuideListItem';

export function GuideList() {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/' });

    const { content } = useHeights();
    const showLabels = useShowButtonLabels();

    const userId = useAppSelector(selectAuthUserId);

    const [page, setPage] = useState<number>(0);
    const [pageQueue, setPageQueue] = useState<number[]>([0]);
    const [items, setItems] = useState<Guide[]>([]);

    const [filter, setFilter] = useState<string | undefined | null>(undefined);
    const [debouncedFilter] = useDebounce(filter, 500);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch
    } = useFindGuidesQuery({
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
            // dispatch(wildguideApi.util.invalidateTags(['Guides']));
            refetch();
        }
    }, [debouncedFilter, refetch]);

    const handleLoadMoreItems = useCallback(() => {
        const nextPage = page + 1;
        if (nextPage <= ((data?.totalRecords ?? 0) / (data?.pageSize ?? 0)) && !pageQueue.includes(nextPage)) {
            setPageQueue(prev => [...prev, nextPage]);
        }
    }, [data?.pageSize, data?.totalRecords, page, pageQueue]);

    const handleRenderItem = useCallback((item: Guide) => <GuideListItem item={item} />, []);

    const handleCreate = useCallback(() => navigate({ to: '/guides/create' }), [navigate]);

    const handleRefresh = useCallback(() => {
        setItems([]);
        setPage(0);
        // dispatch(wildguideApi.util.invalidateTags(['Guides']));
        refetch();
    }, [refetch]);

    const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value.length > 0 ? event.target.value : null);
    }, []);

    const gridHeight = useBreakpointValue({ base: content, md: undefined });

    // RENDER
    return (
        <Box>
            <Box id='grid-header'>
                <HStack wrap={{ base: 'wrap', lg: 'nowrap' }}>
                    <Box marginX={4} marginY={2}>
                        <Heading>
                            {t('guideGridTitle')}
                        </Heading>
                        {!userId &&
                            <Text fontSize='sm'>
                                {t('guideGridSubTitle')}
                            </Text>
                        }
                    </Box>
                    <Box flex='1' display='flex' justifyContent='flex-end'>
                        <HStack
                            wrap={{ base: 'wrap', sm: 'nowrap' }}
                            alignItems='flex-end'
                            justifyContent='flex-end'
                            margin={1}
                        >
                            {userId !== null &&
                                <Button
                                    size='md'
                                    variant='ghost'
                                    color='fg.info'
                                    onClick={handleCreate}
                                    whiteSpace='nowrap'
                                >
                                    <MdAddCircleOutline />
                                    {showLabels &&
                                        <Text>
                                            {t('newGuide')}
                                        </Text>
                                    }
                                </Button>
                            }
                            <Button
                                aria-label={t('guideGridRefresh')}
                                size='md'
                                variant='ghost'
                                onClick={handleRefresh}
                                loading={isFetching}
                            >
                                <LuRefreshCcw />
                            </Button>
                            <InputGroup startElement={<LuSearch />} minWidth={120}>
                                <Input type='search' size='md' value={filter ?? ''} onChange={handleSearch} />
                            </InputGroup>
                        </HStack>
                    </Box>
                </HStack>
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
                {data?.data &&
                    <InfiniteVirtualGrid
                        data={items}
                        renderItem={handleRenderItem}
                        loadMoreItems={handleLoadMoreItems}
                        loading={isFetching}
                        height={gridHeight}
                    />
                }
            </Show>
        </Box>
    );
}
