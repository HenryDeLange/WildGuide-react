import inatLogo from '@/assets/images/inaturalist/inat-logo.png';
import { useTaxonFindQuery } from '@/redux/api/inatApi';
import { Box, Heading, HStack, IconButton, Image, Separator, Show, Skeleton, Text, VStack } from '@chakra-ui/react';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Attribution } from '../custom/Attribution';
import { ImageZoomPopup } from '../custom/ImageZoomPopup';
import { uppercaseFirst } from '../utils';
import { MarkdownErrorBoundary } from './MarkdownErrorBoundary';

type Props = {
    id: number;
    summary?: string;
}

export function InatTaxon({ id, summary }: Readonly<Props>) {
    const { t } = useTranslation();

    const [photoNumber, setPhotoNumber] = useState(0);

    const {
        data,
        isFetching,
        isSuccess,
        isError
    } = useTaxonFindQuery({ id });

    const taxon = (!isFetching && isSuccess) ? data?.results[0] : undefined;
    const total = data?.total_results ?? 0;
    const totalPhotos = (taxon?.taxon_photos?.length ?? 0);

    return (
        <MarkdownErrorBoundary>
            <Show when={!isFetching} fallback={<Skeleton height='4em' />}>
                {(isError || (isSuccess && total !== 1) || !taxon) &&
                    <Text color='fg.error'>{t('markdownSnippetsInatTaxonError')}</Text>
                }
                {taxon &&
                    <HStack
                        borderWidth={1}
                        borderRadius='sm'
                        boxShadow='sm'
                        borderColor='border'
                        marginY={1}
                        position='relative'
                        alignItems='flex-start'
                        gap={0}
                    >
                        <Box position='relative' minWidth={{ base: 90, sm: 130, md: 180, lg: 220 }}>
                            <Image
                                src={taxon.taxon_photos?.[photoNumber]?.photo?.url?.replace('/square.', '/medium.') ?? inatLogo}
                                alt={taxon.name ?? 'iNaturalist'}
                                objectFit='cover'
                                borderLeftRadius='sm'
                                boxSize={{ base: 90, sm: 130, md: 180, lg: 220 }}
                            />
                            <ImageZoomPopup
                                url={taxon.taxon_photos?.[photoNumber]?.photo?.url?.replace('/square.', '/original.') ?? inatLogo}
                                attribution={taxon.taxon_photos?.[photoNumber]?.photo?.attribution}
                            />
                        </Box>
                        <Box width='100%' overflow='hidden' paddingLeft={2} paddingY={1}>
                            <Heading size='md' truncate>
                                {taxon.preferred_common_name ?? taxon.name}
                            </Heading>
                            <HStack>
                                <Text fontSize='xs' color='fg.muted' truncate display={{ base: 'none', sm: 'block' }}>
                                    {uppercaseFirst(taxon.rank)}
                                </Text>
                                <Text fontStyle='italic' fontSize='sm' truncate>
                                    {taxon.name}
                                </Text>
                            </HStack>
                            {summary &&
                                <>
                                    <Separator variant='dotted' size='sm' marginTop={2} marginBottom={-1}/>
                                    <Text fontSize='sm'>
                                        {summary}
                                    </Text>
                                </>
                            }
                        </Box>
                        <VStack justifyContent='flex-end' gap={{ base: 2, sm: 3, md: 4 }}>
                            <IconButton aria-label='iNaturalist' variant='ghost' size='xs'>
                                <a
                                    aria-label='iNaturalist'
                                    href={`https://www.inaturalist.org/taxa/${taxon.id}`}
                                    target='_blank'
                                    rel='noopener'
                                >
                                    <Image
                                        src={inatLogo}
                                        alt='iNaturalist'
                                        objectFit='contain'
                                        borderRadius='md'
                                        boxSize='2.5em'
                                        loading='lazy'
                                    />
                                </a>
                            </IconButton>
                            {totalPhotos > 1 &&
                                <>
                                    <IconButton
                                        size='2xs'
                                        variant='ghost'
                                        focusVisibleRing='none'
                                        onClick={() => setPhotoNumber(Math.max(0, photoNumber - 1))}
                                        disabled={photoNumber <= 0}
                                    >
                                        <ArrowBigLeft />
                                    </IconButton>
                                    <IconButton
                                        size='2xs'
                                        variant='ghost'
                                        focusVisibleRing='none'
                                        onClick={() => setPhotoNumber(Math.min(totalPhotos - 1, photoNumber + 1))}
                                        disabled={photoNumber >= totalPhotos - 1}
                                    >
                                        <ArrowBigRight />
                                    </IconButton>
                                </>
                            }
                            <Attribution attribution={taxon.taxon_photos?.[photoNumber]?.photo?.attribution} />
                        </VStack>
                    </HStack>
                }
            </Show>
        </MarkdownErrorBoundary >
    );
}
