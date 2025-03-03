import inatLogo from '@/assets/images/inaturalist/inat-logo.png';
import { useProjectsAutocompleteQuery, useTaxaAutocompleteQuery } from '@/redux/api/inatApi';
import { Box, DialogRootProvider, Fieldset, Heading, IconButton, Image, Input, Text, useDialog } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiTrash } from 'react-icons/fi';
import { useDebounce } from 'use-debounce';
import { Button } from '../ui/button';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Field } from '../ui/field';
import { InfiniteVirtualList } from './InfiniteVirtualList';

type Props = {
    type: 'PROJECT' | 'TAXON';
    select: (item: InatResultCard | null) => void;
}

export function InaturalistSelector({ type, select }: Readonly<Props>) {
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
                        {t('inaturalistLink')}
                    </Text>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('inaturalistLinkTitle')}
                    </DialogTitle>
                </DialogHeader>
                <DialogCloseTrigger />
                <DialogBody>
                    <InaturalistSearch type={type} select={select} closeDialog={handleCloseDialog} />
                </DialogBody>
                <DialogFooter>
                    <IconButton
                        _hover={{ color: 'fg.info' }}
                        variant='ghost'
                        size='xs'
                        onClick={() => {
                            select(null);
                            handleCloseDialog();
                        }}
                    >
                        <FiTrash />
                        <Text>{t('inaturalistClearResult')}</Text>
                    </IconButton>
                </DialogFooter>
            </DialogContent>
        </DialogRootProvider>
    );
}

function InaturalistSearch({ type, select, closeDialog }: Readonly<Props & { closeDialog: () => void; }>) {
    const { t } = useTranslation();

    const [inatText, setInatText] = useState('');
    const [debouncedInatText] = useDebounce(inatText, 500);

    const {
        data: projectData,
        isFetching: projectIsFetching
    } = useProjectsAutocompleteQuery({
        q: debouncedInatText,
        per_page: 200
    }, { skip: type !== 'PROJECT' || debouncedInatText.trim().length === 0 });

    const {
        data: taxaData,
        isFetching: taxaIsFetching
    } = useTaxaAutocompleteQuery({
        q: debouncedInatText,
        rank: ['family', 'genus', 'species', 'subspecies'],
        per_page: 30
    }, { skip: type !== 'TAXON' || debouncedInatText.trim().length === 0 });

    const loading = type === 'PROJECT' ? projectIsFetching : taxaIsFetching;
    const pageSize = (type === 'PROJECT' ? projectData?.per_page : taxaData?.per_page) ?? 0;
    const totalCount = (type === 'PROJECT' ? projectData?.total_results : taxaData?.total_results) ?? 0;

    const renderItem = useCallback((item: InatResultCard) => (
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
                alt={item.title}
            />
            <Box width='100%' overflow='hidden'>
                <Heading size='sm' truncate marginTop={-1}>
                    {item.title}
                </Heading>
                <Text fontSize='xs' truncate>
                    {item.subTitle}
                </Text>
                <Text fontSize='xs' color='fg.subtle' truncate>
                    {item.category}
                </Text>
            </Box>
        </Button>
    ), [closeDialog, select]);

    const handleLoadMoreItems = useCallback(() => console.warn('pagination of autocomplete not supported by iNaturalist'), []);

    const items: InatResultCard[] = useMemo(() => (
        (loading || debouncedInatText.trim().length === 0) ? []
            : (type === 'PROJECT'
                ? projectData?.results.map(result => ({
                    id: result.id,
                    title: result.title,
                    subTitle: result.description,
                    icon: result.icon,
                    category: result.project_type
                })) ?? []
                : taxaData?.results.map(result => ({
                    id: result.id,
                    title: result.preferred_common_name ?? result.name,
                    subTitle: result.name,
                    icon: result.default_photo?.square_url,
                    category: t(`entryScientificRank${result.rank.toUpperCase()}`)
                })) ?? []))
        , [debouncedInatText, loading, projectData?.results, t, taxaData?.results, type]);

    return (
        <Fieldset.Root disabled={false}>
            <Fieldset.Content gap={4}>
                <Field label={<Text fontSize='md'>{type === 'PROJECT' ? t('newGuideInaturalistCriteria') : t('newEntryInaturalistTaxon')}</Text>}>
                    <Input
                        value={inatText}
                        onChange={event => setInatText(event.target.value)}
                        placeholder={type === 'PROJECT' ? t('newGuideInaturalistCriteriaPlaceholder') : t('newEntryInaturalistTaxonPlaceholder')}
                        autoFocus
                    />
                </Field>
                {(items.length === 0 && !loading) &&
                    <Box display='flex' justifyContent='center' alignItems='center' height={LIST_HEIGHT}>
                        <Text fontSize='sm' color='fg.subtle' marginTop={LIST_HEIGHT * -0.5}>
                            {t('inaturalistNoResults')}
                        </Text>
                    </Box>
                }
                {(items.length > 0 || loading) &&
                    <InfiniteVirtualList
                        data={items}
                        renderItem={renderItem}
                        hasNextPage={false} // iNat autocomplete endpoint doesn't seem to support pagination
                        loadNextPage={(handleLoadMoreItems)}
                        loading={loading}
                        pageSize={pageSize}
                        totalCount={totalCount}
                        itemHeight={ITEM_HEIGHT}
                        height={LIST_HEIGHT}
                    />
                }
            </Fieldset.Content>
        </Fieldset.Root>
    );
}

export type InatResultCard = {
    id: number;
    title: string;
    subTitle?: string;
    icon?: string;
    category: string;
}

const ITEM_HEIGHT = 75;
const LIST_HEIGHT = ITEM_HEIGHT * 4.5;
