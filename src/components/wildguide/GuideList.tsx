import { Guide, useFindGuidesQuery } from '@/redux/api/wildguideApi';
import { Box, Heading, HStack, IconButton, Separator, Show, Spinner, Text, useBreakpointValue } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCcw } from 'react-icons/lu';
import { GridChildComponentProps } from 'react-window';
import { InfiniteGrid } from '../custom/InfiniteGrid';
import { useHeights } from './hooks';

export function GuideList() {
    const { t } = useTranslation();
    
    const { content } = useHeights();

    const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }) ?? 1;
    
    const [page, setPage] = useState(0);
    const [items, setItems] = useState<Guide[]>([]);

    const { data, isLoading, isFetching } = useFindGuidesQuery({ page });

    useEffect(() => {
        setItems((prev) => {
            const existingIds = new Set(prev.map(item => item.id));
            const newItems = (data?.data ?? []).filter(item => !existingIds.has(item.id));
            return [...prev, ...newItems]
                .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        });
    }, [data]);

    const handleRefresh = useCallback(() => {
        setPage(0);
        setItems([]);
    }, []);

    // ITEM
    const ItemRenderer = useMemo(() => ({ rowIndex, columnIndex, style, data }: Readonly<GridChildComponentProps<Guide[]>>) => {
        const index = rowIndex * columns + columnIndex;
        if (data.length <= index) {
            return null;
        }
        return (
            <div style={style}>
                <Box borderWidth={1} borderRadius={8} padding={4} margin={2}>
                    <Heading>{data[index].name}</Heading>
                    <Text>{data[index].visibility}</Text>
                    <Text>{data[index].description ?? ''}</Text>
                    <Text>Grid Index: {index + 1}</Text>
                    <Text>Guide ID: {data[index].id}</Text>
                </Box>
            </div>
        );
    }, [columns]);

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
                    <InfiniteGrid
                        items={items}
                        ItemRenderer={ItemRenderer}
                        itemCount={data.totalRecords}
                        loadMoreItems={async (startIndex, stopIndex) => {
                            console.log(startIndex, stopIndex);
                            if (!isFetching && (stopIndex >= page * data.pageSize)) {
                                console.log('loadMoreItems', page + 1);
                                setPage(page + 1);
                            }
                            // TODO: Fix issue where the last page increment is ignored if the previous one is still fetching (or if I don't wait then the last one will discard the previous ones)
                        }}
                        hasNextPage={data.pageNumber * data.pageSize < data.totalRecords}
                        isItemLoaded={(index) => index < data.data.length}
                        itemHeight={200}
                        columnCount={columns}
                        itemKey={({ columnIndex, rowIndex, data }) => {
                            const index = rowIndex * columns + columnIndex;
                            return data[index]?.id ?? `gridIndex-${index}`;
                        }}
                    />
                }
            </Show>
        </Box >
    );
}
