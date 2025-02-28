import inatLogo from '@/assets/images/inaturalist/inat-logo-subtle.png';
import { selectAuthUserId } from '@/auth/authSlice';
import { EditButton } from '@/components/custom/EditButton';
import { InaturalistSelector } from '@/components/custom/InaturalistSelector';
import { OptionsMenu } from '@/components/custom/OptionsMenu';
import { ExtendedMarkdown } from '@/components/markdown/ExtendedMarkdown';
import { useFindGuideOwnersQuery, useFindGuideQuery } from '@/redux/api/wildguideApi';
import { useAppSelector } from '@/redux/hooks';
import { Box, Heading, HStack, Icon, Image, Show, Spinner, TabsContent, TabsList, TabsRoot, TabsTrigger, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuBookText, LuLayoutList } from 'react-icons/lu';
import { MdOutlineLock } from 'react-icons/md';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { Tooltip } from '../../ui/tooltip';
import { EntryList } from '../entry/EntryList';
import { GuideLinkUsers } from './GuideLinkUsers';

type Props = {
    guideId: number;
}

export function Guide({ guideId }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/$guideId' });

    const userId = useAppSelector(selectAuthUserId);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch
    } = useFindGuideQuery({ guideId });

    const {
        data: ownerData,
        isLoading: ownerIsLoading,
        isFetching: ownerIsFetching,
        isError: ownerIsError,
        error: ownerError,
        refetch: ownerRefetch
    } = useFindGuideOwnersQuery({ guideId });

    const isOwner = ownerData?.map(owner => owner.userId).includes(userId ?? -1) ?? false;

    const handleEdit = useCallback(() => navigate({ to: '/guides/$guideId/edit' }), [navigate]);

    const [entriesRefresh, setEntriesRefresh] = useState(false);
    const handleEntriesRefreshComplete = useCallback(() => setEntriesRefresh(false), []);
    const handleRefresh = useCallback(() => {
        setEntriesRefresh(true);
        refetch();
        ownerRefetch();
    }, [ownerRefetch, refetch]);

    // RENDER
    return (
        <Box display='flex' flexDirection='column' alignItems='center'>
            <ErrorDisplay error={isError ? error : ownerIsError ? ownerError : undefined} />
            <Show when={!isLoading && !ownerIsLoading} fallback={<Spinner size='lg' margin={8} />}>
                {data &&
                    <Box width='100%' paddingX={4} paddingY={2}>
                        <Box id='page-header'>
                            <HStack flex={1} flexWrap='wrap'>
                                <Show when={data.visibility === 'PRIVATE'}>
                                    <Tooltip content={t('newGuideVisibilityHelpPRIVATE')} showArrow>
                                        <Icon size='md'>
                                            <MdOutlineLock />
                                        </Icon>
                                    </Tooltip>
                                </Show>
                                <Heading size='4xl' alignSelf='flex-start'>
                                    {data.name}
                                </Heading>
                                <HStack flex={1} justifyContent='flex-end' flexWrap='wrap'>
                                    {isOwner &&
                                        <>
                                            <InaturalistSelector type='PROJECT' select={(id) => console.log('selected', id)} />
                                            <GuideLinkUsers guideId={guideId} />
                                            <EditButton handleEdit={handleEdit} />
                                        </>
                                    }
                                    <OptionsMenu
                                        type='guide'
                                        guideId={guideId}
                                        handleRefresh={handleRefresh}
                                        isFetching={isFetching || ownerIsFetching || entriesRefresh}
                                    />
                                </HStack>
                            </HStack>
                            {data.summary &&
                                <Box
                                    marginY={2}
                                    marginBottom={4}
                                    paddingX={4}
                                    paddingY={2}
                                    borderWidth={1}
                                    borderRadius='sm'
                                    boxShadow='xs'
                                    borderColor='border.muted'
                                >
                                    <Text fontSize='lg'>
                                        {data.summary}
                                    </Text>
                                </Box>
                            }
                        </Box>
                        <TabsRoot marginTop={2} size='lg' fitted width='100%' defaultValue='guide' variant='outline'>
                            <TabsList id='tab-header'>
                                <TabsTrigger
                                    value='guide'
                                    fontSize='1.3em'
                                    lineHeight='1em'
                                    _selected={{ bgColor: 'bg.subtle' }}
                                >
                                    <LuBookText />
                                    {t('guideTab')}
                                </TabsTrigger>
                                <TabsTrigger
                                    value='entries'
                                    fontSize='1.3em'
                                    lineHeight='1em'
                                    _selected={{ bgColor: 'bg.subtle' }}
                                >
                                    <LuLayoutList />
                                    {t('guideEntriesTab')}
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent
                                value='guide'
                                bgColor='bg.subtle'
                                borderColor='border'
                                borderWidth={1}
                                borderTopWidth={0}
                                borderRadius='sm'
                                padding={0}
                            >
                                <VStack width='100%'>
                                    <Box width='100%' paddingTop={4} paddingX={4}>
                                        {data.inaturalistCriteria &&
                                            <Box width='fit-content'>
                                                <a
                                                    aria-label='iNaturalist'
                                                    href={`https://www.inaturalist.org/projects/${data.inaturalistCriteria}`}
                                                    target='_blank'
                                                    rel='noopener'
                                                >
                                                    <HStack>
                                                        <Image
                                                            src={inatLogo}
                                                            alt='iNaturalist'
                                                            boxSize={6}
                                                            borderRadius='full'
                                                            fit='cover'
                                                            loading='lazy'
                                                        />
                                                        <Text>{t('newGuideInaturalistCriteria')}</Text>
                                                    </HStack>
                                                </a>
                                            </Box>
                                        }
                                        {data.description &&
                                            <ExtendedMarkdown content={data.description} />
                                        }
                                    </Box>
                                </VStack>
                            </TabsContent>
                            <TabsContent
                                value='entries'
                                bgColor='bg.subtle'
                                borderColor='border'
                                borderWidth={1}
                                borderTopWidth={0}
                                borderRadius='sm'
                                padding={0}
                            >
                                <EntryList
                                    guideId={guideId}
                                    triggerRefresh={entriesRefresh}
                                    handleRefreshComplete={handleEntriesRefreshComplete}
                                />
                            </TabsContent>
                        </TabsRoot>
                    </Box>
                }
            </Show>
        </Box>
    );
}
