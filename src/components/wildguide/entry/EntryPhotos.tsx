import { InfiniteVirtualGrid } from "@/components/custom/InfiniteVirtualGrid";
import { Photo, useObservationsFindQuery } from "@/redux/api/inatApi";
import { Box, Image } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

type Props = {
    scientificName: string;
    inaturalistTaxon?: number;
    inaturalistProject?: number;
}

export function EntryPhotos({ scientificName, inaturalistTaxon, inaturalistProject }: Readonly<Props>) {
    const [page, setPage] = useState<number>(1);
    const [pageQueue, setPageQueue] = useState<number[]>([1]);
    const [items, setItems] = useState<Photo[]>([]);

    const {
        data,
        isFetching
    } = useObservationsFindQuery({
        page: page,
        per_page: PAGE_SIZE,
        photos: true,
        order_by: 'votes',
        quality_grade: 'research',
        taxon_id: inaturalistTaxon ? [inaturalistTaxon] : undefined,
        project_id: inaturalistProject ? [inaturalistProject] : undefined,
        taxon_name: !inaturalistTaxon ? [scientificName] : undefined
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
                const newItems = (data?.results.flatMap(obs => obs.photos) ?? []).filter(item => !existingIds.has(item.id));
                return [...prev, ...newItems];
            });
        }
    }, [data?.results, isFetching]);

    const handleLoadMoreItems = useCallback(() => {
        const nextPage = page + 1;
        if (nextPage <= (((data?.total_results ?? 0) / PAGE_SIZE) + 1) && !pageQueue.includes(nextPage)) {
            setPageQueue(prev => [...prev, nextPage]);
        }
    }, [data?.total_results, page, pageQueue]);

    // TODO: Handle refresh
    // const handleRefresh = useCallback(() => {
    //     setItems([]);
    //     setPage(0);
    //     refetch();
    // }, [refetch]);

    console.log({ page, pageQueue, items, data })
    return (
        <Box>
            <InfiniteVirtualGrid
                data={items}
                loading={isFetching}
                loadMoreItems={handleLoadMoreItems}
                // TODO: Better render with attribution, etc. (also instead of function, should I use children?)
                renderItem={(item) => (
                    <Box>
                        <Image
                            src={item.medium_url ?? item.url?.replace('/square.', '/medium.')}
                            objectFit='cover'
                            borderRadius='sm'
                            width={200}
                            height={200}
                        />
                    </Box>
                )}
            />
        </Box>
    );
}

const PAGE_SIZE = 50;
