import { Box, Spinner, Text } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ENTRY_LIST_ITEM_HEIGHT } from '../wildguide/EntryListItem';

// TODO: Maybe try to make the item sizes dynamic? (depends on how much of the summary to allow to be shown?)

type Props<T> = {
    data: T[];
    renderItem: (item: T, index: number) => ReactNode;
    hasNextPage: boolean;
    loadNextPage: (page: number) => void;
    loading: boolean;
    pageSize: number;
    totalCount: number;
};

export function InfiniteVirtualList<T>({ data, renderItem, hasNextPage, loadNextPage, loading, pageSize, totalCount }: Readonly<Props<T>>) {
    const { t } = useTranslation();

    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: hasNextPage ? data.length + 1 : data.length,
        // count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ENTRY_LIST_ITEM_HEIGHT,
        // estimateSize: index => (data[index] as any).summary ? 150 : 80,
        overscan: 1
    });

    const virtualItemsOnScreen = virtualizer.getVirtualItems();
    useEffect(() => {
        const lastItem = virtualItemsOnScreen[virtualItemsOnScreen.length - 1];
        if (data.length > 0 && hasNextPage && !loading && (lastItem.index >= (data.length - 1))) {
            const nextPage = Math.ceil(data.length / pageSize);
            loadNextPage(nextPage);
        }
    }, [hasNextPage, data.length, loading, virtualItemsOnScreen, loadNextPage, totalCount, pageSize]);

    // RENDER
    return (
        <Box>
            <div
                ref={parentRef}
                style={{
                    height: '500px',
                    width: '100%',
                    overflowY: 'auto',
                    contain: 'strict'
                }}
            >
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    {/* <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${virtualizer.getVirtualItems()[0]?.start ?? 0}px)`
                        }}
                    > */}
                    {virtualizer.getVirtualItems().map(virtualRow => {
                        const isLoaderRow = virtualRow.index > data.length - 1;
                        return (
                            <div
                                key={virtualRow.index}
                                // data-index={virtualRow.index}
                                // ref={virtualizer.measureElement}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`
                                }}
                            >
                                <Box height={ENTRY_LIST_ITEM_HEIGHT} position='absolute' width='100%'>
                                    {isLoaderRow &&
                                        <Box textAlign='center' marginTop={16}>
                                            <Spinner size='md' />
                                            <Text>{t('gridLoading')}</Text>
                                            {loading ? '...fetching...' : '!!! not fetching !!!'}
                                        </Box>
                                    }
                                    {!isLoaderRow &&
                                        renderItem(data[virtualRow.index], virtualRow.index)
                                    }
                                </Box>
                            </div>
                        );
                    })}
                    {/* </div> */}
                </div>
            </div>
        </Box>
    );
}
