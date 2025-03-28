import inatLogo from '@/assets/images/inaturalist/inat-logo.png';
import { useProjectFindQuery, useTaxonFindQuery } from '@/redux/api/inatApi';
import { Box, Flex, Heading, HStack, IconButton, Image, Show, Skeleton, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { uppercaseFirst } from '../utils';
import { Attribution } from './Attribution';

export type InatLinkCardTypes = 'PROJECT' | 'TAXON';

type Props = {
    type: InatLinkCardTypes;
    inatId?: number;
}

export function InatLinkCard({ type, inatId }: Readonly<Props>) {
    const { t } = useTranslation();

    const {
        data: projectData,
        isLoading: projectIsLoading
    } = useProjectFindQuery({ id: inatId! }, {
        skip: !inatId || type !== 'PROJECT'
    });

    const {
        data: taxonData,
        isLoading: taxonIsLoading
    } = useTaxonFindQuery({ id: inatId! }, {
        skip: !inatId || type !== 'TAXON'
    });

    if (!inatId)
        return null;

    // RENDER
    const project = projectData?.total_results === 1 ? projectData.results[0] : undefined;
    const taxon = taxonData?.total_results === 1 ? taxonData.results[0] : undefined;
    const data: InatResult | undefined =
        (type === 'PROJECT' && project) ? {
            id: project.id,
            title: project.title,
            subTitle: project.description,
            icon: project.icon ?? inatLogo,
            category: uppercaseFirst(project.project_type),
            attribution: project.terms
        }
            : (type === 'TAXON' && taxon) ? {
                id: taxon.id,
                title: taxon.preferred_common_name ?? taxon.name,
                subTitle: taxon.name,
                icon: taxon.default_photo?.square_url ?? inatLogo,
                category: t(`entryScientificRank${taxon.rank.toUpperCase()}`),
                attribution: taxon.default_photo?.attribution
            }
                : undefined;

    return (
        <Show
            when={!projectIsLoading && !taxonIsLoading}
            fallback={<Skeleton height='4em' />}
        >
            {data &&
                <Box
                    padding={2}
                    borderWidth={1}
                    borderRadius='sm'
                    boxShadow='sm'
                    borderColor='border'
                    position='relative'
                >
                    <HStack>
                        <IconButton aria-label='iNaturalist' variant='ghost' asChild>
                            <a
                                aria-label='iNaturalist'
                                href={`https://www.inaturalist.org/${type === 'PROJECT' ? 'projects' : 'taxa'}/${data.id}`}
                                target='_blank'
                                rel='noopener'
                            >
                                <Image
                                    src={inatLogo}
                                    alt='iNaturalist'
                                    objectFit='contain'
                                    borderRadius='md'
                                    width='40px'
                                    height='40px'
                                    loading='lazy'
                                />
                            </a>
                        </IconButton>
                        <Image
                            src={data.icon ?? inatLogo}
                            alt={data.title}
                            objectFit='cover'
                            borderRadius='sm'
                            width='60px'
                            height='60px'
                        />
                        <Box width='100%' overflow='hidden'>
                            <Heading size='md' truncate>
                                {data.title}
                            </Heading>
                            <Text fontStyle='italic' fontSize='xs' truncate>
                                {data.subTitle}
                            </Text>
                            <Flex>
                                <Text fontSize='xs' color='fg.subtle' truncate marginEnd='auto'>
                                    {data.category}
                                </Text>
                                <Attribution attribution={data.attribution} />
                            </Flex>
                        </Box>
                    </HStack>
                </Box>
            }
        </Show>
    );
}

type InatResult = {
    id: number;
    title: string;
    subTitle?: string;
    icon?: string;
    category: string;
    attribution?: string;
}
