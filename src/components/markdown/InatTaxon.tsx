import inatLogo from '@/assets/images/inaturalist/inat-logo.png';
import { useTaxonFindQuery } from '@/redux/api/inatApi';
import { Box, Card, IconButton, Image, Show, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MarkdownErrorBoundary } from './MarkdownErrorBoundary';

type Props = {
    id: number;
}

export function InatTaxon({ id }: Readonly<Props>) {
    const { t } = useTranslation();
    const { data, isFetching, isSuccess, isError } = useTaxonFindQuery({ id });
    const taxon = (!isFetching && isSuccess) ? data?.results[0] : undefined;
    const total = data?.total_results ?? 0;
    return (
        <MarkdownErrorBoundary>
            <Show
                when={!isError && (isFetching || (isSuccess && total === 1))}
                fallback={<Text color='fg.error'>{t('markdownSnippetsInatTaxonError')}</Text>}
            >
                <div className='no-inherit'>
                    <Card.Root flexDirection='row' overflow='hidden'>
                        <Image
                            objectFit='cover'
                            width={{ base: 100, sm: 150, md: 200, lg: 250 }}
                            height={{ base: 100, sm: 150, md: 200, lg: 250 }}
                            src={taxon?.default_photo?.medium_url ?? inatLogo}
                            alt={taxon?.name ?? 'iNaturalist'}
                        />
                        <Box overflow='auto' width='100%' height={{ base: 100, sm: 150, md: 200, lg: 250 }}>
                            <Card.Body height='100%'>
                                <Card.Title>
                                    {!taxon ? t('loading') : taxon.preferred_common_name ?? taxon.name}
                                </Card.Title>
                                <Card.Description>
                                    <Text>
                                        {taxon?.name ?? '...'}
                                    </Text>
                                    <Text>
                                        {taxon?.rank ?? '...'}
                                    </Text>
                                </Card.Description>
                                <Card.Footer flex={1} justifyContent='flex-end' alignItems='flex-end' padding={1}>
                                    <a
                                        aria-label='iNaturalist'
                                        href={`https://www.inaturalist.org/taxa/${id}`}
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
                </div>
            </Show>
        </MarkdownErrorBoundary>
    );
}
