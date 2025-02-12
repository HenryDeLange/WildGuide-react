import { selectAuthUserId } from '@/auth/authSlice';
import { InputGroup } from '@/components/ui/input-group';
import { Guide, useFindGuidesQuery, wildguideApi } from '@/redux/api/wildguideApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Box, Heading, Input, Separator, Show, Spinner, Stack, StackProps, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCcw, LuSearch } from 'react-icons/lu';
import { MdAddCircleOutline } from 'react-icons/md';
import { useDebounce } from 'use-debounce';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { InfiniteVirtualGrid } from '../../custom/InfiniteVirtualGrid';
import { Button } from '../../ui/button';
import { useHeights } from '../hooks/uiHooks';
import { GuideListItem } from './GuideListItem';

export function GuideList() {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/' });
    const dispatch = useAppDispatch();

    const { content } = useHeights();

    const userId = useAppSelector(selectAuthUserId);

    const [page, setPage] = useState<number>(0);
    const [pageQueue, setPageQueue] = useState<number[]>([]);
    const [items, setItems] = useState<Guide[]>([]);

    const [filter, setFilter] = useState<string | undefined | null>(undefined);
    const [debouncedFilter] = useDebounce(filter, 500);

    const { data, isLoading, isFetching, isError, error } = useFindGuidesQuery({ page, name: debouncedFilter ?? undefined });
    // console.log('rendering page:', page)

    useEffect(() => {
        if (!isFetching && pageQueue.length > 0) {
            // console.log('Process page from queue:', pageQueue[0]);
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

    useEffect(() => {
        if (debouncedFilter || debouncedFilter === null) {
            dispatch(wildguideApi.util.invalidateTags(['Guides']));
            setItems([]);
            setPage(0);
        }
    }, [debouncedFilter, dispatch]);

    const handleLoadMoreItems = useCallback(() => {
        const nextPage = page + 1;
        if (nextPage <= ((data?.totalRecords ?? 0) / (data?.pageSize ?? 0)) && !pageQueue.includes(nextPage)) {
            // console.log('Add page to queue:', nextPage, { page, pageQueue })
            setPageQueue(prev => [...prev, nextPage]);
        }
        // else {
        //     console.log('not processing page', nextPage)
        // }
    }, [data?.pageSize, data?.totalRecords, page, pageQueue]);

    const handleRenderItem = useCallback((item: Guide) => <GuideListItem item={item} />, []);

    const handleCreate = useCallback(() => navigate({ to: '/guides/create' }), [navigate]);

    const handleRefresh = useCallback(() => {
        dispatch(wildguideApi.util.invalidateTags(['Guides']));
        setItems([]);
        setPage(0);
    }, [dispatch]);

    const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value.length > 0 ? event.target.value : null);
    }, []);

    const controlDirection = useMemo<StackProps['direction']>(() => ({ base: 'column', md: 'row' }), []);

    // RENDER
    return (
        <Box height={content}>
            <Box id='grid-header'>
                <Stack direction='row' justifyContent='space-between' gap={8}>
                    <Box marginX={4} marginY={2}>
                        <Heading>
                            {t('guideGridTitle')}
                        </Heading>
                        <Text>
                            {t('guideGridSubTitle')}
                        </Text>
                    </Box>
                    <Stack
                        direction={controlDirection}
                        alignItems='flex-end'
                        justifyContent='flex-end'
                        margin={1}
                        marginRight={4}
                    >
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
                                    {t('newGuide')}
                                </Text>
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
                        <InputGroup startElement={<LuSearch />}>
                            <Input type='search' size='md' value={filter ?? ''} onChange={handleSearch} />
                        </InputGroup>
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
                {data?.data &&
                    <InfiniteVirtualGrid
                        data={items}
                        renderItem={handleRenderItem}
                        loadMoreItems={handleLoadMoreItems}
                        loading={isFetching}
                    />
                }
            </Show>
        </Box>
    );
}
