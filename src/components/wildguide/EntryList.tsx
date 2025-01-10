import { selectAuthUserId } from '@/auth/authSlice';
import { Guide, useFindEntriesQuery, wildguideApi } from '@/redux/api/wildguideApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Box, Heading, Separator, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCcw } from 'react-icons/lu';
import { MdAddCircleOutline } from 'react-icons/md';
import { Button } from '../ui/button';

// TODO: In the future add a toggle to define at what taxon rank the data should be shown (fetched from iNat - species vs subspecies)

type Props = {
    guideId: number;
}

export function EntryList({ guideId }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/$guideId' });
    const dispatch = useAppDispatch();

    const userId = useAppSelector(selectAuthUserId);

    const [page, setPage] = useState<number>(0);
    const [items, setItems] = useState<Guide[]>([]);

    const { data, isLoading, isFetching, isError } = useFindEntriesQuery({ guideId, page });

    const handleCreate = useCallback(() => navigate({ to: '/guides/$guideId/entries/create' }), [navigate]);

    const handleRefresh = useCallback(() => {
        dispatch(wildguideApi.util.invalidateTags(['Entries']));
        setItems([]);
        setPage(0);
    }, [dispatch]);

    // RENDER
    return (
        <Box bgColor='red.100'>
            <Box bgColor='yellow.100'>
                <Stack direction='row' justifyContent='space-between' gap={8}>
                    <Box marginX={4} marginY={2}>
                        <Heading>
                            {t('entryListTitle')}
                        </Heading>
                        <Text>
                            {t('entryListSubTitle')}
                        </Text>
                    </Box>
                    <Stack direction={{ base: 'column', md: 'row' }} alignItems='flex-end' justifyContent='flex-end'>
                        {userId !== null &&
                            <Button
                                size='lg'
                                variant='ghost'
                                color='fg.success'
                                onClick={handleCreate}
                                whiteSpace='nowrap'
                            >
                                <MdAddCircleOutline />
                                <Text>
                                    {t('newEntry')}
                                </Text>
                            </Button>
                        }
                        <Button
                            aria-label={t('entryListRefresh')}
                            size='md'
                            variant='ghost'
                            onClick={handleRefresh}
                            loading={isFetching}
                        >
                            <LuRefreshCcw />
                        </Button>
                    </Stack>
                </Stack>
                <Separator />
            </Box>
            <Box bgColor='orange.100'>
                
            </Box>
        </Box>
    );
}
