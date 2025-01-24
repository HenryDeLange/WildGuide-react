import { Entry } from '@/redux/api/wildguideApi';
import { Box, Heading, Separator, Text, VStack } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '../../ui/tooltip';

type Props = {
    index: number;
    guideId: number;
    entry: Entry;
}

export const EntryListItem = memo(function EntryListItem({ index, guideId, entry }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <Box position='absolute' width='100%' height='100%' paddingY={4} paddingX={12}>
            <Link to='/guides/$guideId/entries/$entryId' params={{ guideId: guideId.toString(), entryId: entry.id.toString() }} >
                <VStack
                    _hover={{
                        backgroundColor: 'gray.100',
                        transform: 'scale(1.05)',
                        transition: 'all 0.2s ease-in-out'
                    }}
                    height='100%'
                    paddingX={3}
                    paddingY={2}
                    alignItems='flex-start'
                    borderWidth='1px'
                    borderRadius='lg'
                >
                    <Heading fontWeight='bold'>
                        {index + 1} {entry.name}
                    </Heading>
                    <Tooltip content={t(`entryScientificRank${entry.scientificRank}`)} showArrow>
                        <Heading fontStyle='italic' color='fg.muted'>
                            {entry.scientificName}
                        </Heading>
                    </Tooltip>
                    <Separator />
                    <Text>
                        {(entry.summary && entry.summary.trim().length > 0) ? entry.summary.trim() : ''}
                    </Text>
                </VStack>
            </Link>
        </Box>
    );
});

export const ENTRY_LIST_ITEM_HEIGHT = 200;
