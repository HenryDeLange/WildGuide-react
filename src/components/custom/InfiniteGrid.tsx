import { ComponentType, useCallback } from 'react';
import { FixedSizeGrid, GridChildComponentProps, GridItemKeySelector } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { useHeights } from '../wildguide/hooks';

type Props<T> = {
    items: T;
    ItemRenderer: ComponentType<GridChildComponentProps<T>>;
    itemKey: GridItemKeySelector<T>;
    itemCount: number;
    loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void>;
    hasNextPage: boolean;
    isItemLoaded: (index: number) => boolean;
    itemHeight: number;
    columnCount: number;
}

export function InfiniteGrid<T>({
    items,
    ItemRenderer,
    itemKey,
    itemCount,
    loadMoreItems,
    hasNextPage,
    isItemLoaded,
    itemHeight,
    columnCount
}: Readonly<Props<T>>) {
    const { grid: height } = useHeights();
    const itemWidth = window.innerWidth / columnCount - GAP;

    const isItemLoadedWithLoader = useCallback(
        (index: number) => !hasNextPage || index < itemCount ? isItemLoaded(index) : true,
        [hasNextPage, itemCount, isItemLoaded]
    );

    const loadMoreItemsWithLoader = useCallback(
        (startIndex: number, stopIndex: number) => {
            if (!hasNextPage || startIndex >= itemCount) return Promise.resolve();
            return loadMoreItems(startIndex, stopIndex);
        },
        [hasNextPage, itemCount, loadMoreItems]
    );

    const itemCountWithLoader = hasNextPage ? itemCount + 1 : itemCount;

    return (
        <InfiniteLoader
            itemCount={itemCountWithLoader}
            isItemLoaded={isItemLoadedWithLoader}
            loadMoreItems={loadMoreItemsWithLoader}
        >
            {({ onItemsRendered, ref }) => (
                <FixedSizeGrid
                    ref={ref}
                    height={height}
                    width={(itemWidth + GAP) * columnCount - GAP}
                    rowHeight={itemHeight + GAP}
                    columnWidth={itemWidth}
                    rowCount={Math.ceil(itemCountWithLoader / columnCount)}
                    columnCount={columnCount}
                    itemData={items}
                    onItemsRendered={({ visibleRowStartIndex, visibleRowStopIndex, overscanRowStartIndex, overscanRowStopIndex }) => {
                        onItemsRendered({
                            overscanStartIndex: overscanRowStartIndex,
                            overscanStopIndex: overscanRowStopIndex,
                            visibleStartIndex: visibleRowStartIndex,
                            visibleStopIndex: visibleRowStopIndex,
                        });
                    }}
                    itemKey={itemKey}
                >
                    {ItemRenderer}
                </FixedSizeGrid>
            )}
        </InfiniteLoader>
    );
}

const GAP = 10;
