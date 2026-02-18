import inatLogo from '@/assets/images/inaturalist/inat-logo.png';
import { useObservationFindQuery } from '@/redux/api/inatApi';
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

export function InatObservation({ id, summary }: Readonly<Props>) {
    const { t } = useTranslation();

    const [photoNumber, setPhotoNumber] = useState(0);

    const {
        data,
        isFetching,
        isSuccess,
        isError
    } = useObservationFindQuery({ id });

    const obs = (!isFetching && isSuccess) ? data?.results[0] : undefined;
    const total = data?.total_results ?? 0;

    return (
        <MarkdownErrorBoundary>
            <Show when={!isFetching} fallback={<Skeleton height='4em' />}>
                {(isError || (isSuccess && total !== 1) || !obs) &&
                    <Text color='fg.error'>{t('markdownSnippetsInatObservationError')}</Text>
                }
                {obs &&
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
                                src={obs.photos[photoNumber]?.url?.replace('/square.', '/medium.') ?? inatLogo}
                                alt={obs.species_guess ?? 'iNaturalist'}
                                objectFit='cover'
                                borderLeftRadius='sm'
                                boxSize={{ base: 90, sm: 130, md: 180, lg: 220 }}
                            />
                            <ImageZoomPopup
                                url={obs.photos[photoNumber]?.url?.replace('/square.', '/original.') ?? inatLogo}
                                attribution={obs.photos[photoNumber].attribution}
                            />
                        </Box>
                        <Box width='100%' overflow='hidden' paddingLeft={2} paddingY={1}>
                            <Heading size='md' truncate>
                                {obs.taxon.preferred_common_name ?? obs.taxon.name}
                            </Heading>
                            <HStack>
                                <Text fontSize='xs' color='fg.muted' truncate display={{ base: 'none', sm: 'block' }}>
                                    {uppercaseFirst(obs.taxon.rank)}
                                </Text>
                                <Text fontStyle='italic' fontSize='sm' truncate>
                                    {obs.taxon.name}
                                </Text>
                            </HStack>
                            <Text fontSize='xs' color='fg.muted' truncate marginEnd='auto'>
                                {obs.observed_on_string}
                            </Text>
                            <Text fontSize='xx-small' color='fg.muted' truncate marginEnd='auto' display={{ base: 'none', sm: 'block' }}>
                                {obs.place_guess}
                                <br />
                                {obs.location}
                            </Text>
                            {summary &&
                                <>
                                    <Separator variant='dotted' size='sm' />
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
                                    href={`https://www.inaturalist.org/observations/${obs.id}`}
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
                            {obs.photos.length > 1 &&
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
                                        onClick={() => setPhotoNumber(Math.min(obs.photos.length - 1, photoNumber + 1))}
                                        disabled={photoNumber >= obs.photos.length - 1}
                                    >
                                        <ArrowBigRight />
                                    </IconButton>
                                </>
                            }
                            <Attribution attribution={`${obs.user.login} (${obs.user.name ?? obs.user.id})`} />
                        </VStack>
                    </HStack>
                }
            </Show>
        </MarkdownErrorBoundary >
    );
}
