import inatLogo from '@/assets/images/inaturalist/inat-logo-subtle.png';
import { Taxon, useSpeciesCountsFindQuery } from '@/redux/api/inatApi';
import { Box, DialogRootProvider, Heading, Image, Text, useDialog } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { uppercaseFirst } from '../utils';
import { InfiniteVirtualList } from './InfiniteVirtualList';

type Props = {
    select: (item: InatLinkItem) => void;
    inaturalistProject?: number;
    inaturalistTaxon?: number;
};

export function InatLinkDialog({ select, inaturalistProject, inaturalistTaxon }: Readonly<Props>) {
    const { t } = useTranslation();
    const dialog = useDialog();
    const handleCloseDialog = useCallback(() => dialog.setOpen(false), [dialog]);
    return (
        <DialogRootProvider value={dialog} placement='center' lazyMount={true}>
            <DialogTrigger asChild>
                <Button size='lg' variant='ghost' whiteSpace='nowrap'>
                    <Image
                        src={inatLogo}
                        alt='iNaturalist'
                        boxSize={6}
                        borderRadius='full'
                        fit='cover'
                        loading='lazy'
                    />
                    <Text>
                        {t('newEntry')}
                    </Text>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader marginTop={-2} marginLeft={-2}>
                    <DialogTitle>
                        {t('inaturalistLinkTitle')}
                    </DialogTitle>
                </DialogHeader>
                <DialogCloseTrigger />
                <DialogBody padding={2} marginTop={-2}>
                    <InaturalistSearch
                        select={select}
                        closeDialog={handleCloseDialog}
                        inaturalistProject={inaturalistProject}
                        inaturalistTaxon={inaturalistTaxon}
                    />
                </DialogBody>
            </DialogContent>
        </DialogRootProvider>
    );
}

function InaturalistSearch({ select, closeDialog, inaturalistProject, inaturalistTaxon }: Readonly<Props & { closeDialog: () => void; }>) {
    const { t } = useTranslation();

    // TODO: Add a toggle to set what level to show entries for (species/subspecies)
    // TODO: Find a way to handle subspecies (iNat doesn't seem to provide subspecies count)

    const {
        data,
        isFetching
    } = useSpeciesCountsFindQuery({
        quality_grade: 'research',
        // hrank: 'genus',
        // rank: ['family', 'subfamily', 'tribe', 'subtribe', 'genus', 'subgenus', 'species', 'subspecies'],
        project_id: inaturalistProject ? [inaturalistProject] : undefined,
        taxon_id: inaturalistTaxon ? [inaturalistTaxon] : undefined,
        // TODO: Exclude already linked taxa
        without_taxon_id: undefined,
        page: 1,
        per_page: PAGE_SIZE
    });

    const pageSize = data?.per_page ?? 0;
    const totalCount = data?.total_results ?? 0;

    const renderItem = useCallback((item: InatLinkItem) => (
        <Button
            padding={1}
            height={ITEM_HEIGHT}
            onClick={() => {
                select(item);
                closeDialog();
            }}
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
    ), [closeDialog, select, t]);

    // TODO: implement the pagination
    const handleLoadMoreItems = useCallback(() => console.warn('pagination of autocomplete not supported by iNaturalist'), []);

    const items: InatLinkItem[] = useMemo(() => (
        (isFetching) ? []
            : data?.results.map(result => ({
                id: result.taxon.id,
                name: result.taxon.preferred_common_name ?? result.taxon.name,
                scientificName: result.taxon.name,
                icon: result.taxon.default_photo?.square_url,
                rank: result.taxon.rank
            })) ?? [])
        , [data?.results, isFetching]);

    return (
        <Box>
            {(items.length > 0 || isFetching) &&
                <InfiniteVirtualList
                    data={items}
                    renderItem={renderItem}
                    hasNextPage={false} // iNat autocomplete endpoint doesn't seem to support pagination
                    loadNextPage={(handleLoadMoreItems)}
                    loading={isFetching}
                    pageSize={pageSize}
                    totalCount={totalCount}
                    itemHeight={ITEM_HEIGHT}
                    height={LIST_HEIGHT}
                />
            }
        </Box>
    );
}

export type InatLinkItem = {
    id: number;
    name: string;
    scientificName: string;
    rank: Taxon['rank'];
    icon?: string;
}

const PAGE_SIZE = 50;
const ITEM_HEIGHT = 75;
const LIST_HEIGHT = ITEM_HEIGHT * 6.5;
