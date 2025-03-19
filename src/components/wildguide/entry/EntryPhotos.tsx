import inatLogo from '@/assets/images/inaturalist/inat-logo.png';
import { Attribution } from '@/components/custom/Attribution';
import { ImageZoomPopup } from '@/components/custom/ImageZoomPopup';
import { InfiniteVirtualGrid } from '@/components/custom/InfiniteVirtualGrid';
import { Photo, useObservationsFindQuery } from '@/redux/api/inatApi';
import { Box, HStack, IconButton, Image, Switch, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    scientificName: string;
    inaturalistTaxon?: number;
    inaturalistProject?: number;
}

export function EntryPhotos({ scientificName, inaturalistTaxon, inaturalistProject }: Readonly<Props>) {
    const { t } = useTranslation();

    const [page, setPage] = useState<number>(1);
    const [pageQueue, setPageQueue] = useState<number[]>([1]);
    const [items, setItems] = useState<ObsPhoto[]>([]);
    const [researchGradePhotosOnly, setResearchGradePhotosOnly] = useState(true);
    const [projectPhotosOnly, setProjectPhotosOnly] = useState(true);

    const {
        data,
        isFetching
    } = useObservationsFindQuery({
        photos: true,
        order_by: 'votes',
        quality_grade: researchGradePhotosOnly ? 'research' : undefined,
        taxon_id: inaturalistTaxon ? [inaturalistTaxon] : undefined,
        taxon_name: !inaturalistTaxon ? [scientificName] : undefined,
        project_id: projectPhotosOnly && inaturalistProject ? [inaturalistProject] : undefined,
        page: page,
        per_page: PAGE_SIZE
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
                        observationId: obs.id,
                        taxonName: obs.taxon.preferred_common_name ?? obs.taxon.name,
                        researchGrade: obs.quality_grade === 'research',
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

    return (
        <Box>
            <HStack id='grid-header' paddingX={2} paddingY={1} gap={8}>
                <Switch.Root
                    size='md'
                    checked={researchGradePhotosOnly}
                    onCheckedChange={(e) => {
                        setItems([]);
                        setPage(1);
                        setPageQueue([1]);
                        setResearchGradePhotosOnly(e.checked);
                    }}
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>{t('photosToggleResearchGrade')}</Switch.Label>
                </Switch.Root>
                {inaturalistProject &&
                    <Switch.Root
                        size='md'
                        checked={projectPhotosOnly}
                        onCheckedChange={(e) => {
                            setItems([]);
                            setPage(1);
                            setPageQueue([1]);
                            setProjectPhotosOnly(e.checked);

                        }}
                    >
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label>{t('photosToggleProject')}</Switch.Label>
                    </Switch.Root>
                }
            </HStack>
            <InfiniteVirtualGrid
                data={items}
                loading={isFetching}
                loadMoreItems={handleLoadMoreItems}
                gridSize={GRID_SIZE}
                heightDelta={4}
                renderItem={(item) => (
                    <Box boxSize={GRID_SIZE} position='relative'>
                        <Image
                            src={item.medium_url ?? item.url?.replace('/square.', '/medium.')}
                            objectFit='cover'
                            borderRadius='sm'
                            width={GRID_SIZE}
                            height={GRID_SIZE}
                        />
                        <Attribution attribution={item.attribution} />
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
                                    href={`https://www.inaturalist.org/observations/${item.observationId}`}
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
                        <ImageZoomPopup
                            url={(item.original_url ?? item.url?.replace('/square.', '/original.'))!}
                            attribution={item.attribution}
                        />
                        <Box position='absolute' top={1} left={1}>
                            <Text
                                truncate
                                color={item.researchGrade ? '#CFA' : '#FCA'}
                                textShadow='1px 1px 2px rgba(0, 0, 0, 0.85)'
                            >
                                {item.taxonName}
                            </Text>
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
    observationId: number;
    taxonName: string;
    researchGrade: boolean;
}
