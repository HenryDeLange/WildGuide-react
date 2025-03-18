import { InatLinkDialog } from '@/components/custom/InatLinkDialog';
import { InputGroup } from '@/components/ui/input-group';
import { Taxon, useTaxaFindQuery } from '@/redux/api/inatApi';
import { Entry, useFindEntriesQuery } from '@/redux/api/wildguideApi';
import { Box, Input, Separator, Show, Spinner, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuSearch } from 'react-icons/lu';
import { MdAddCircleOutline } from 'react-icons/md';
import { useDebounce } from 'use-debounce';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { InfiniteVirtualList } from '../../custom/InfiniteVirtualList';
import { Button } from '../../ui/button';
import { useHeights } from '../hooks/uiHooks';
import { useIsOwner } from '../hooks/userHooks';
import { ENTRY_LIST_ITEM_HEIGHT, EntryListItem } from './EntryListItem';

type Props = {
    guideId: number;
    triggerRefresh: boolean;
    handleRefreshComplete: () => void;
    guideInatProject?: number;
    guideInatTaxon?: number;
}

export function EntryList({ guideId, triggerRefresh, handleRefreshComplete, guideInatProject, guideInatTaxon }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/$guideId' });

    const { window, appHeader, pageHeader } = useHeights();

    const {
        isOwner
    } = useIsOwner(guideId);

    const [page, setPage] = useState<number>(0);
    const [pageQueue, setPageQueue] = useState<number[]>([]);
    const [items, setItems] = useState<ListEntry[]>([]);
    const [taxaToLoad, setTaxaToLoad] = useState<number[]>([]);

    // TODO: In the future add a toggle to define at what taxon rank the data should be shown (fetched from iNat - species vs subspecies)
    const [filter, setFilter] = useState<string | undefined | null>(undefined);
    const [debouncedFilter] = useDebounce(filter, 500);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch
    } = useFindEntriesQuery({
        guideId,
        page,
        name: debouncedFilter ?? undefined
    });

    // TODO: Find a way to get back only the specified taxa (the iNat API will return all taxa and their children specified in taxon_id)
    const {
        data: taxaData,
        isFetching: taxaIsFetching
    } = useTaxaFindQuery({
        taxon_id: taxaToLoad,
        per_page: 500
    }, {
        skip: taxaToLoad.length === 0
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
                const existingIds = new Set(prev.map(listEntry => listEntry.entry.id));
                const newEntries = (data?.data ?? []).filter(dataItem => !existingIds.has(dataItem.id));
                const newEntryListItems: ListEntry[] = newEntries.map(entry => ({
                    entry: entry,
                    taxon: taxaData?.results.find(taxon => taxon.id === entry.inaturalistTaxon)
                }));
                const newItems = [...prev, ...newEntryListItems];
                setTaxaToLoad(newItems
                    .filter(listEntry => listEntry.taxon === undefined && listEntry.entry.inaturalistTaxon)
                    .map(listEntry => listEntry.entry.inaturalistTaxon!));
                return newItems;
            });
        }
    }, [isFetching, data?.data, taxaData?.results]);

    useEffect(() => {
        if (!taxaIsFetching && taxaData) {
            setItems((prev) => {
                const newItems = prev.map(listEntry => {
                    if (listEntry.entry.inaturalistTaxon && !listEntry.taxon) {
                        const taxon = taxaData.results.find(taxon => taxon.id === listEntry.entry.inaturalistTaxon);
                        return taxon ? { ...listEntry, taxon } : listEntry;
                    }
                    return listEntry;
                });
                setTaxaToLoad(newItems
                    .filter(listEntry => listEntry.taxon === undefined && listEntry.entry.inaturalistTaxon)
                    .map(listEntry => listEntry.entry.inaturalistTaxon!));
                return newItems;
            }
            );
        }
    }, [taxaIsFetching, taxaData]);

    useEffect(() => {
        if (debouncedFilter || debouncedFilter === null) {
            setItems([]);
            setTaxaToLoad([]);
            setPage(0);
            // dispatch(wildguideApi.util.invalidateTags(['Entries']));
            refetch();
        }
    }, [debouncedFilter, refetch]);

    const handleLoadMoreItems = useCallback((nextPage: number) => {
        if (nextPage <= ((data?.totalRecords ?? 0) / (data?.pageSize ?? 0)) && !pageQueue.includes(nextPage)) {
            setPageQueue(prev => [...prev, nextPage]);
        }
    }, [data?.pageSize, data?.totalRecords, pageQueue]);

    const handleCreate = useCallback(() => navigate({ to: '/guides/$guideId/entries/create' }), [navigate]);

    useEffect(() => {
        setPage(0);
        setPageQueue([]);
        setItems([]);
        setTaxaToLoad([]);
        // dispatch(wildguideApi.util.invalidateTags(['Entries']));
        refetch();
    }, [triggerRefresh, refetch]);

    useEffect(() => {
        if (triggerRefresh && !isLoading) {
            handleRefreshComplete();
        }
    }, [handleRefreshComplete, isLoading, triggerRefresh]);

    const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value.length > 0 ? event.target.value : null);
    }, []);

    const renderItem = useCallback((listEntry: ListEntry) => (
        <EntryListItem guideId={guideId} entry={listEntry.entry} inatTaxon={listEntry.taxon} />
    ), [guideId]);

    const hasNextPage = items.length < (data?.totalRecords ?? 0);

    // RENDER
    return (
        <Box>
            <Box id='grid-header'>
                <Stack direction='row' justifyContent='space-between' gap={8} padding={2}>
                    <InputGroup startElement={<LuSearch />}>
                        <Input type='search' size='md' value={filter ?? ''} onChange={handleSearch} />
                    </InputGroup>
                    <Stack direction={{ base: 'column', md: 'row' }} alignItems='flex-end' justifyContent='flex-end'>
                        {isOwner &&
                            <>
                                <InatLinkDialog
                                    guideId={guideId}
                                    inaturalistProject={guideInatProject}
                                    inaturalistTaxon={guideInatTaxon}
                                />
                                <Button
                                    size='lg'
                                    variant='ghost'
                                    color='fg.info'
                                    onClick={handleCreate}
                                    whiteSpace='nowrap'
                                >
                                    <MdAddCircleOutline />
                                    <Text>
                                        {t('newEntry')}
                                    </Text>
                                </Button>
                            </>
                        }
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
                }
            >
                <InfiniteVirtualList
                    data={items}
                    renderItem={renderItem}
                    hasNextPage={hasNextPage}
                    loadNextPage={handleLoadMoreItems}
                    loading={isFetching}
                    pageSize={data?.pageSize ?? 0}
                    totalCount={data?.totalRecords ?? 0}
                    itemHeight={ENTRY_LIST_ITEM_HEIGHT}
                    heightDelta={(window < 700 ? (-1 * (appHeader + pageHeader) + 16) : 9) + 8}
                />
            </Show>
        </Box >
    );
}

export type ListEntry = {
    entry: Entry;
    taxon?: Taxon;
}
