import { Guide, useFindGuidesQuery, wildguideApi } from '@/redux/api/wildguideApi';
import { useAppDispatch } from '@/redux/hooks';
import { Box, Heading, HStack, IconButton, Separator, Show, Spinner, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCcw } from 'react-icons/lu';
import { InfiniteVirtualGrid } from '../custom/InfiniteVirtualGrid';
import { useHeights } from './hooks';

export function GuideList() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const { content } = useHeights();

    const [page, setPage] = useState<number>(0);
    const [pageQueue, setPageQueue] = useState<number[]>([]);
    const [items, setItems] = useState<Guide[]>([]);

    const { data, isLoading, isFetching } = useFindGuidesQuery({ page });
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
            return [...prev, ...newItems]
                .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        });
    }, [data]);

    const handleRefresh = useCallback(() => {
        dispatch(wildguideApi.util.invalidateTags(['Guides']));
        setItems([]);
        setPage(0);
    }, [dispatch]);

    // RENDER
    return (
        <Box height={content}>
            <Box id='grid-header'>
                <HStack justifyContent='space-between' padding={4}>
                    <Heading>
                        {t('guideGridTitle')}
                    </Heading>
                    <Box height='2em' display='flex' alignItems='center'>
                        <Show when={!isFetching} fallback={<Spinner size='md' />}>
                            <IconButton
                                aria-label={t('guideGridRefresh')}
                                size='md'
                                variant='ghost'
                                onClick={handleRefresh}
                            >
                                <LuRefreshCcw />
                            </IconButton>
                        </Show>
                    </Box>
                </HStack>
                <Separator />
            </Box>
            <Show when={!isLoading}>
                {data?.data &&
                    <InfiniteVirtualGrid
                        data={items}
                        renderItem={(item) => <ItemRenderer item={item} />}
                        loadMoreItems={() => {
                            const nextPage = page + 1;
                            if (nextPage <= (data.totalRecords / data.pageSize) && pageQueue.indexOf(nextPage) === -1) {
                                // console.log('Add page to queue:', nextPage, { page, pageQueue })
                                setPageQueue(prev => [...prev, nextPage]);
                            }
                            // else {
                            //     console.log('not processing page', nextPage)
                            // }
                        }}
                        loading={isFetching}
                    />
                }
            </Show>
        </Box >
    );
}

function ItemRenderer({ item }: Readonly<{ item: Guide }>) {
    return (
        <Box padding={2} margin={2}>
            <Heading>{item.name}</Heading>
            <Text>{item.visibility}</Text>
            <Text>{item.description ?? ''}</Text>
        </Box>
    );
}
