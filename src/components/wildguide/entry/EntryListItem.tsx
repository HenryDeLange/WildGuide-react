import inatLogo from '@/assets/images/inaturalist/inat-logo.png';
import { Taxon } from '@/redux/api/inatApi';
import { Entry } from '@/redux/api/wildguideApi';
import { Box, Heading, HStack, Image, Separator, Text, VStack } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    guideId: number;
    entry: Entry;
    inatTaxon?: Taxon;
}

export const EntryListItem = memo(function EntryListItem({ guideId, entry, inatTaxon }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <Box
            position='absolute'
            width='100%'
            height='100%'
            paddingY={{ base: 2, md: 3, lg: 4 }}
            paddingX={{ base: 4, md: 8, lg: 12, xl: 16 }}
        >
            <Link to='/guides/$guideId/entries/$entryId' params={{ guideId: guideId.toString(), entryId: entry.id.toString() }} >
                <VStack
                    _hover={{
                        backgroundColor: 'gray.100',
                        transform: 'scale(1.05)',
                        transition: 'all 0.2s ease-in-out'
                    }}
                    height='100%'
                    paddingX={2}
                    paddingY={1}
                    alignItems='flex-start'
                    borderWidth='1px'
                    borderRadius='lg'
                >
                    <Box width='100%' overflow='hidden'>
                        <Heading fontWeight='bold' truncate>
                            {entry.name}
                        </Heading>
                        <HStack gap={4} marginTop={-1}>
                            <Heading color='fg.subtle' truncate>
                                {t(`entryScientificRank${entry.scientificRank}`)}
                            </Heading>
                            <Heading color='fg.muted' truncate fontStyle='italic'>
                                {entry.scientificName}
                            </Heading>
                        </HStack>
                        <Separator />
                        <Text truncate>
                            {(entry.summary && entry.summary.trim().length > 0) ? entry.summary.trim() : ''}
                        </Text>
                    </Box>
                    {inatTaxon &&
                        <HStack width='100%' overflow='hidden'>
                            <Image
                                objectFit='cover'
                                borderRadius='md'
                                width={`${60}px`}
                                height={`${60}px`}
                                src={inatTaxon.default_photo?.square_url ?? inatLogo}
                                alt={inatTaxon.name}
                            />
                            <Box width='100%' overflow='hidden'>
                                <Heading size='sm' truncate marginTop={-1}>
                                    {inatTaxon.preferred_common_name ?? inatTaxon.name}
                                </Heading>
                                <HStack gap={2}>
                                    <Text color='fg.subtle' fontSize='xs' truncate>
                                        {t(`entryScientificRank${inatTaxon.rank.toUpperCase()}`)}
                                    </Text>
                                    <Text color='fg.muted' fontSize='xs' truncate fontStyle='italic'>
                                        {inatTaxon.name}
                                    </Text>
                                </HStack>
                            </Box>
                        </HStack>
                    }
                </VStack>
            </Link>
        </Box>
    );
});

export const ENTRY_LIST_ITEM_HEIGHT = 200;
