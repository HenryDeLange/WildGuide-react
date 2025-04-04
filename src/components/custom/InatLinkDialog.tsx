import inatLogo from '@/assets/images/inaturalist/inat-logo-subtle.png';
import { convertInatToEntryRank } from '@/redux/api/apiMapper';
import { Taxon, useSpeciesCountsFindQuery } from '@/redux/api/inatApi';
import { useCreateEntryMutation, useFindEntriesScientificNamesQuery } from '@/redux/api/wildguideApi';
import { Box, DialogRootProvider, Fieldset, Heading, Image, Input, Show, Spinner, Stack, Switch, Text, useDialog } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { Button } from '../ui/button';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Field } from '../ui/field';
import { uppercaseFirst } from '../utils';
import { useShowButtonLabels } from '../wildguide/hooks/uiHooks';
import { InfiniteVirtualList } from './InfiniteVirtualList';

type Props = {
    guideId: number;
    inaturalistProject?: number;
    inaturalistTaxon?: number;
};

export function InatLinkDialog({ guideId, inaturalistProject, inaturalistTaxon }: Readonly<Props>) {
    const { t } = useTranslation();

    const showLabels = useShowButtonLabels();

    const dialog = useDialog();

    const handleCloseDialog = useCallback(() => dialog.setOpen(false), [dialog]);

    if (!inaturalistProject && !inaturalistTaxon)
        return null;
    return (
        <DialogRootProvider value={dialog} placement='center' lazyMount={true}>
            <DialogTrigger asChild>
                <Button size='md' variant='ghost' whiteSpace='nowrap' padding={showLabels ? undefined : 0}>
                    <Image
                        src={inatLogo}
                        alt='iNaturalist'
                        boxSize={6}
                        borderRadius='full'
                        fit='cover'
                        loading='lazy'
                    />
                    {showLabels &&
                        <Text>
                            {t('newEntryInatImport')}
                        </Text>
                    }
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader marginTop={-4} marginLeft={-4}>
                    <DialogTitle>
                        {t('newEntryInatImport')}
                    </DialogTitle>
                </DialogHeader>
                <DialogCloseTrigger />
                <DialogBody padding={2} marginTop={-2}>
                    <InaturalistList
                        guideId={guideId}
                        closeDialog={handleCloseDialog}
                        inaturalistProject={inaturalistProject}
                        inaturalistTaxon={inaturalistTaxon}
                    />
                </DialogBody>
            </DialogContent>
        </DialogRootProvider>
    );
}

type InaturalistListProps = Props & {
    closeDialog: () => void;
}

function InaturalistList({ guideId, closeDialog, inaturalistProject, inaturalistTaxon }: Readonly<InaturalistListProps>) {
    const { t } = useTranslation();

    const [inatText, setInatText] = useState('');
    const [debouncedInatText] = useDebounce(inatText, 500);
    const [showOnlyNewInatTaxa, setShowOnlyNewInatTaxa] = useState(true);

    const [page, setPage] = useState<number>(1);
    const [pageQueue, setPageQueue] = useState<number[]>([1]);
    const [items, setItems] = useState<InatLinkItem[]>([]);

    const {
        data: excludeTaxaData,
        isSuccess: excludeTaxaIsSuccess,
        isFetching: excludeTaxaIsFetching
    } = useFindEntriesScientificNamesQuery({ guideId });

    const {
        data,
        isFetching,
        refetch
    } = useSpeciesCountsFindQuery({
        q: debouncedInatText,
        // quality_grade: 'research',
        hrank: showOnlyNewInatTaxa ? 'species' : undefined,
        // rank: ['family', 'subfamily', 'tribe', 'subtribe', 'genus', 'subgenus', 'species', 'subspecies'],
        project_id: inaturalistProject ? [inaturalistProject] : undefined,
        taxon_id: inaturalistTaxon ? [inaturalistTaxon] : undefined,
        without_taxon_id: excludeTaxaData ? excludeTaxaData.map(exclude => exclude.inaturalistTaxon) : undefined,
        page: page,
        per_page: PAGE_SIZE
    }, {
        skip: !excludeTaxaIsSuccess || excludeTaxaIsFetching
    });

    const [
        doCreate, {
            isLoading: createIsLoading,
            isError: createIsError
        }
    ] = useCreateEntryMutation();

    const handleCreateEntry = useCallback((item: InatLinkItem) => {
        doCreate({
            guideId,
            entryBase: {
                name: item.name,
                scientificName: item.scientificName,
                scientificRank: convertInatToEntryRank(item.rank) ?? 'SPECIES',
                inaturalistTaxon: item.id
            }
        })
            .unwrap().then(() => closeDialog());
    }, [closeDialog, doCreate, guideId]);

    useEffect(() => {
        if (!isFetching && pageQueue.length > 0) {
            setPage(pageQueue[0]);
            setPageQueue((prevQueue) => prevQueue.slice(1));
        }
    }, [isFetching, pageQueue]);

    useEffect(() => {
        if (debouncedInatText || debouncedInatText === null) {
            setItems([]);
            setPage(0);
            refetch();
        }
    }, [debouncedInatText, refetch]);

    useEffect(() => {
        if (!isFetching) {
            setItems((prev) => {
                const existingIds = new Set(prev.map(item => item.id));
                const newItems = (data?.results.map(result => ({
                    id: result.taxon.id,
                    name: result.taxon.preferred_common_name ?? result.taxon.name,
                    scientificName: result.taxon.name,
                    icon: result.taxon.default_photo?.square_url,
                    rank: result.taxon.rank
                })) ?? []).filter(item => !existingIds.has(item.id));
                return [...prev, ...newItems];
            });
        }
    }, [data?.results, isFetching]);

    const renderItem = useCallback((item: InatLinkItem) => (
        <Button
            padding={1}
            height={ITEM_HEIGHT}
            onClick={() => handleCreateEntry(item)}
            width='100%'
            textAlign='left'
            variant='surface'
        >
            <Image
                objectFit='cover'
                borderRadius='md'
                width={`${ITEM_HEIGHT - 8}px`}
                height={`${ITEM_HEIGHT - 8}px`}
                src={item.icon ?? inatLogo}
                alt={item.name}
            />
            <Box width='100%' overflow='hidden'>
                <Heading size='sm' truncate marginTop={-1}>
                    {item.name}
                </Heading>
                <Text fontStyle='italic' fontSize='xs' truncate>
                    {item.scientificName}
                </Text>
                <Text fontSize='xs' color='fg.subtle' truncate>
                    {t(`entryScientificRank${item.rank.toUpperCase()}`, { defaultValue: uppercaseFirst(item.rank) })}
                </Text>
            </Box>
        </Button>
    ), [handleCreateEntry, t]);

    const handleLoadMoreItems = useCallback(() => {
        const nextPage = page + 1;
        if (nextPage <= (((data?.total_results ?? 0) / PAGE_SIZE) + 1) && !pageQueue.includes(nextPage)) {
            setPageQueue(prev => [...prev, nextPage]);
        }
    }, [data?.total_results, page, pageQueue]);

    const totalCount = data?.total_results ?? 0;
    const hasNextPage = items.length < (data?.total_results ?? 0);

    return (
        <Fieldset.Root invalid={createIsError} disabled={createIsLoading}>
            <Fieldset.ErrorText>
                <Text>
                    {t('newEntryError')}
                </Text>
            </Fieldset.ErrorText>
            <Fieldset.Content gap={4}>
                <Show
                    when={!createIsLoading}
                    fallback={
                        <Box textAlign='center' marginY={4}>
                            <Spinner size='md' />
                        </Box>
                    }
                >
                    <Stack direction='row' gap={4}>
                        <Field label={<Text fontSize='md'>{t('newEntryInaturalistTaxon')}</Text>}>
                            <Input
                                value={inatText}
                                onChange={event => setInatText(event.target.value)}
                                placeholder={t('newEntryInaturalistTaxonPlaceholder')}
                            />
                        </Field>
                        <Field label={<Text fontSize='md'>{t('inaturalistLinkOnlyShowNew')}</Text>} flex={0} textWrap='nowrap' alignItems='center'>
                            <Switch.Root
                                size='md'
                                checked={showOnlyNewInatTaxa}
                                onCheckedChange={(e) => {
                                    setItems([]);
                                    setPage(1);
                                    setPageQueue([1]);
                                    setShowOnlyNewInatTaxa(e.checked);
                                }}
                                paddingTop={2}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control />
                                <Switch.Label />
                            </Switch.Root>
                        </Field>
                    </Stack>
                    {(items.length === 0 && !isFetching) &&
                        <Box display='flex' justifyContent='center' alignItems='center' height={LIST_HEIGHT}>
                            <Text fontSize='sm' color='fg.subtle' marginTop={LIST_HEIGHT * -0.5}>
                                {t('inaturalistNoResults')}
                            </Text>
                        </Box>
                    }
                    {(items.length > 0 || isFetching) &&
                        <InfiniteVirtualList
                            data={items}
                            renderItem={renderItem}
                            hasNextPage={hasNextPage}
                            loadNextPage={(handleLoadMoreItems)}
                            loading={isFetching}
                            pageSize={PAGE_SIZE}
                            totalCount={totalCount}
                            itemHeight={ITEM_HEIGHT}
                            height={LIST_HEIGHT}
                        />
                    }
                </Show>
            </Fieldset.Content>
        </Fieldset.Root>
    );
}

export type InatLinkItem = {
    id: number;
    name: string;
    scientificName: string;
    rank: Taxon['rank'];
    icon?: string;
}

const PAGE_SIZE = 20;
const ITEM_HEIGHT = 75;
const LIST_HEIGHT = ITEM_HEIGHT * 6.5;
