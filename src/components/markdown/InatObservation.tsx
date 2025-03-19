import inatLogo from '@/assets/images/inaturalist/inat-logo.png';
import { useObservationFindQuery } from '@/redux/api/inatApi';
import { Box, Heading, HStack, IconButton, Image, Separator, Show, Skeleton, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Attribution } from '../custom/Attribution';
import { ImageZoomPopup } from '../custom/ImageZoomPopup';
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
                        padding={2}
                        borderWidth={1}
                        borderRadius='sm'
                        boxShadow='sm'
                        borderColor='border'
                        marginY={1}
                        position='relative'
                        alignItems='flex-start'
                        gap={0}
                    >
                        <HStack width='full' alignItems='flex-start'>
                            <Box position='relative' minWidth={{ base: 90, sm: 130, md: 180, lg: 220 }}>
                                <Image
                                    src={obs.photos[photoNumber]?.url?.replace('/square.', '/medium.') ?? inatLogo}
                                    alt={obs.species_guess ?? 'iNaturalist'}
                                    objectFit='cover'
                                    borderRadius='sm'
                                    boxSize={{ base: 90, sm: 130, md: 180, lg: 220 }}
                                />
                                <ImageZoomPopup
                                    url={obs.photos[photoNumber]?.url?.replace('/square.', '/original.') ?? inatLogo}
                                    attribution={obs.photos[photoNumber].attribution}
                                />
                            </Box>
                            <Box width='100%' overflow='hidden'>
                                <Heading size='md' truncate lineHeight='1em'>
                                    {obs.taxon.preferred_common_name ?? obs.taxon.name}
                                </Heading>
                                <Text fontStyle='italic' fontSize='sm' truncate lineHeight='0.8em'>
                                    {obs.taxon.name}
                                </Text>
                                <Text fontSize='sm' color='fg.muted' truncate marginEnd='auto' lineHeight='0.8em'>
                                    {obs.observed_on_string}
                                </Text>
                                <Text fontSize='xx-small' color='fg.muted' truncate marginEnd='auto' lineHeight='1.1em'>
                                    {obs.place_guess}
                                    <br />
                                    {obs.location}
                                </Text>
                                {summary &&
                                    <>
                                        <Separator variant='dotted' size='sm' />
                                        <Text lineHeight='1.1em'>
                                            {summary}
                                        </Text>
                                    </>
                                }
                            </Box>
                        </HStack>
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
                                        <FaAngleLeft />
                                    </IconButton>
                                    <IconButton
                                        size='2xs'
                                        variant='ghost'
                                        focusVisibleRing='none'
                                        onClick={() => setPhotoNumber(Math.min(obs.photos.length - 1, photoNumber + 1))}
                                        disabled={photoNumber >= obs.photos.length - 1}
                                    >
                                        <FaAngleRight />
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
