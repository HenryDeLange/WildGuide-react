import { selectAuthUserId } from '@/auth/authSlice';
import { Guide, useFindGuidesQuery, wildguideApi } from '@/redux/api/wildguideApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Box, Heading, Separator, Show, Spinner, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCcw } from 'react-icons/lu';
import { MdAddCircleOutline } from 'react-icons/md';
import { InfiniteVirtualGrid } from '../custom/InfiniteVirtualGrid';
import { Button } from '../ui/button';
import { ErrorDisplay } from './ErrorDisplay';
import { GuideListItem } from './GuideListItem';
import { useHeights } from './hooks';

export function GuideList() {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/' });
    const dispatch = useAppDispatch();

    const { content } = useHeights();

    const userId = useAppSelector(selectAuthUserId);

    const [page, setPage] = useState<number>(0);
    const [pageQueue, setPageQueue] = useState<number[]>([]);
    const [items, setItems] = useState<Guide[]>([]);

    const { data, isLoading, isFetching, isError, error } = useFindGuidesQuery({ page });
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

    const handleCreate = useCallback(() => navigate({ to: '/guides/create' }), [navigate]);

    const handleRefresh = useCallback(() => {
        dispatch(wildguideApi.util.invalidateTags(['Guides']));
        setItems([]);
        setPage(0);
    }, [dispatch]);

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
                        renderItem={(item) => <GuideListItem item={item} />}
                        loadMoreItems={handleLoadMoreItems}
                        loading={isFetching}
                    />
                }
            </Show>
        </Box>
    );
}
