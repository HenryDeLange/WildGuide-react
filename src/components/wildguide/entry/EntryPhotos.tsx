import inatLogo from '@/assets/images/inaturalist/inat-logo.png';
import { InfiniteVirtualGrid } from '@/components/custom/InfiniteVirtualGrid';
import { ToggleTip } from '@/components/ui/toggle-tip';
import { Photo, useObservationsFindQuery } from '@/redux/api/inatApi';
import { Box, IconButton, Image } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { LuCopyright } from 'react-icons/lu';

type Props = {
    scientificName: string;
    inaturalistTaxon?: number;
    inaturalistProject?: number;
}

export function EntryPhotos({ scientificName, inaturalistTaxon, inaturalistProject }: Readonly<Props>) {
    const [page, setPage] = useState<number>(1);
    const [pageQueue, setPageQueue] = useState<number[]>([1]);
    const [items, setItems] = useState<ObsPhoto[]>([]);

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
                const newItems = (data?.results
                    .flatMap(obs => obs.photos.map(photo => ({
                        observation_id: obs.id,
                        ...photo
                    }))) ?? [])
                    .filter(item => !existingIds.has(item.id));
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

    return (
        <Box>
            <InfiniteVirtualGrid
                data={items}
                loading={isFetching}
                loadMoreItems={handleLoadMoreItems}
                gridSize={GRID_SIZE}
                renderItem={(item) => (
                    <Box boxSize={GRID_SIZE} position='relative'>
                        <Image
                            src={item.medium_url ?? item.url?.replace('/square.', '/medium.')}
                            objectFit='cover'
                            borderRadius='sm'
                            width={GRID_SIZE}
                            height={GRID_SIZE}
                        />
                        {item.attribution &&
                            <Box position='absolute' bottom={1} right={1}>
                                <ToggleTip content={item.attribution}>
                                    <IconButton
                                        size='2xs'
                                        variant='ghost'
                                        color='fg.subtle'
                                        focusVisibleRing='none'
                                    >
                                        <LuCopyright />
                                    </IconButton>
                                </ToggleTip>
                            </Box>
                        }
                        <Box position='absolute' bottom={1} left={1}>
                            <IconButton
                                size='2xs'
                                variant='ghost'
                                aria-label='iNaturalist'
                                focusVisibleRing='none'
                                asChild
                            >
                                <a
                                    aria-label='iNaturalist'
                                    href={`https://www.inaturalist.org/observations/${item.observation_id}`}
                                    target='_blank'
                                    rel='noopener'
                                >
                                    <Image
                                        src={inatLogo}
                                        alt='iNaturalist'
                                        objectFit='contain'
                                        borderRadius='md'
                                        width='1.5em'
                                        height='1.5emx'
                                        loading='lazy'
                                    />
                                </a>
                            </IconButton>
                        </Box>
                    </Box>
                )}
            />
        </Box>
    );
}

const PAGE_SIZE = 50;
const GRID_SIZE = 200;

type ObsPhoto = Photo & {
    observation_id: number;
}
