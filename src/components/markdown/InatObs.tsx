import inatLogo from '@/assets/images/inaturalist/inat-logo.png';
import { useObservationFindQuery } from '@/redux/api/inatApi';
import { Box, Card, IconButton, Image, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type Props = {
    obsId: number;
}

export function InatObs({ obsId }: Readonly<Props>) {
    const { t } = useTranslation();
    const { data, isLoading, isError } = useObservationFindQuery({ id: obsId });
    const obs = data?.results[0];
    const ratio = (obs?.photos[0].original_dimensions.width ?? 1) / (obs?.photos[0].original_dimensions.height ?? 1);
    return (
        <Card.Root flexDirection='row' overflow='hidden'>
            <Image
                objectFit='cover'
                width={{ base: 100, sm: 150, md: 200, lg: 250 }}
                height={{ base: 100 * ratio, sm: 150 * ratio, md: 200 * ratio, lg: 250 * ratio }}
                src={obs?.photos[0].url.replace('/square.', '/medium.') ?? inatLogo}
                alt={obs?.species_guess ?? 'iNaturalist'}
            />
            <Box overflow='auto' width='100%' height={{ base: 100 * ratio, sm: 150 * ratio, md: 200 * ratio, lg: 250 * ratio }}>
                <Card.Body height='100%'>
                    <Card.Title>
                        {obs?.species_guess ?? t('loading')}
                    </Card.Title>
                    <Card.Description>
                        <Text>
                            {obs?.user.name ?? '...'}
                        </Text>
                        <Text>
                            {obs?.place_guess ?? '...'}
                        </Text>
                    </Card.Description>
                    <Card.Footer flex={1} justifyContent='flex-end' alignItems='flex-end' padding={1}>
                        <a
                            aria-label='iNaturalist'
                            href={`https://www.inaturalist.org/observations/${obsId}`}
                            target='_blank'
                            rel='noopener'
                        >
                            <IconButton aria-label='iNaturalist' variant='ghost'>
                                <Image
                                    src={inatLogo}
                                    alt='iNaturalist'
                                    boxSize={12}
                                    borderRadius='full'
                                    fit='cover'
                                    loading='lazy'
                                />
                            </IconButton>
                        </a>
                    </Card.Footer>
                </Card.Body>
            </Box>
        </Card.Root>
    );
}
