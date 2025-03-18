import { Box, Show, SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import { ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHeights } from '../wildguide/hooks/uiHooks';

// TODO: Make the virtualizer work

type Props<T> = {
    data: T[];
    renderItem: (item: T) => ReactNode;
    loadMoreItems: () => void;
    loading: boolean;
    gridSize?: number;
};

export function InfiniteVirtualGrid<T>({ data, renderItem, loadMoreItems, loading, gridSize = 200 }: Readonly<Props<T>>) {
    const { t } = useTranslation();
    const { grid } = useHeights();

    const parentRef = useRef<HTMLDivElement>(null);

    // const rowVirtualizer = useVirtualizer({
    //     count: data.length,
    //     getScrollElement: () => parentRef.current,
    //     estimateSize: () => gridSize,
    //     overscan: 5
    // });

    useEffect(() => {
        const scrollElement = parentRef.current;
        if (scrollElement && ((scrollElement.scrollHeight - scrollElement.scrollTop) <= scrollElement.clientHeight)) {
            // console.log('Fill Screen Load')
            loadMoreItems();
        }
    }, [loadMoreItems]);

    useEffect(() => {
        const scrollElement = parentRef.current;
        const handleScroll = () => {
            if (scrollElement && ((scrollElement.scrollHeight - scrollElement.scrollTop) <= (scrollElement.clientHeight * 1.15))) {
                // console.log('Scrolling Load')
                loadMoreItems();
            }
        };

        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
            return () => scrollElement?.removeEventListener('scroll', handleScroll);
        }
    }, [loadMoreItems]);

    // RENDER
    return (
        <Box ref={parentRef} height={grid} overflowY='auto'>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} gap={4} margin={4}>
                {/* {rowVirtualizer.getVirtualItems().map(virtualRow => {
                    console.log('render Item:, ', virtualRow.index);
                    return (
                        <Box key={virtualRow.index} height={gridSize}>
                            {renderItem(data[virtualRow.index])}
                        </Box>
                    );
                })} */}
                {data.map((item, index) => {
                    return (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        <Box key={(item as any).id ?? index} height={gridSize}>
                            {renderItem(item)}
                        </Box>
                    );
                })}
                <Show when={loading}>
                    <Box gridColumn='1 / -1' textAlign='center'>
                        <Spinner size='md' />
                        <Text>{t('loading')}</Text>
                    </Box>
                </Show>
            </SimpleGrid>
        </Box>
    );
}
