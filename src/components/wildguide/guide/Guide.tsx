import inatLogo from '@/assets/images/inaturalist/inat-logo.png';
import { selectAuthUserId } from '@/auth/authSlice';
import { EditButton } from '@/components/custom/EditButton';
import { InatResultCard, InatSelector } from '@/components/custom/InatSelector';
import { OptionsMenu } from '@/components/custom/OptionsMenu';
import { ExtendedMarkdown } from '@/components/markdown/ExtendedMarkdown';
import { useProjectFindQuery } from '@/redux/api/inatApi';
import { useFindGuideOwnersQuery, useFindGuideQuery, useUpdateGuideMutation } from '@/redux/api/wildguideApi';
import { useAppSelector } from '@/redux/hooks';
import { Box, Heading, HStack, Icon, IconButton, Image, Show, Spinner, TabsContent, TabsList, TabsRoot, TabsTrigger, Text, VStack } from '@chakra-ui/react';
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

    const [
        doUpdate, {
            isLoading: updateIsLoading,
            isError: updateIsError,
            error: updateError
        }
    ] = useUpdateGuideMutation();

    const {
        data: projectData,
        isLoading: projectIsLoading
    } = useProjectFindQuery({ id: Number(data?.inaturalistCriteria ?? '0') }, {
        skip: !data?.inaturalistCriteria
    });
    const project = projectData?.total_results === 1 ? projectData.results[0] : undefined;

    const handleEdit = useCallback(() => navigate({ to: '/guides/$guideId/edit' }), [navigate]);

    const [entriesRefresh, setEntriesRefresh] = useState(false);
    const handleEntriesRefreshComplete = useCallback(() => setEntriesRefresh(false), []);
    const handleRefresh = useCallback(() => {
        setEntriesRefresh(true);
        refetch();
        ownerRefetch();
    }, [ownerRefetch, refetch]);

    const handleInatLink = useCallback((item: InatResultCard | null) => {
        if (data) {
            doUpdate({
                guideId,
                guideBase: {
                    ...data,
                    inaturalistCriteria: item?.id.toString() ?? undefined
                }
            });
        }
    }, [data, doUpdate, guideId]);

    // RENDER
    return (
        <Box display='flex' flexDirection='column' alignItems='center'>
            <ErrorDisplay error={isError ? error : ownerIsError ? ownerError : updateIsError ? updateError : undefined} />
            <Show when={!isLoading && !ownerIsLoading && !updateIsLoading} fallback={<Spinner size='lg' margin={8} />}>
                {data &&
                    <Box width='100%'>
                        <Box id='page-header'>
                            <HStack width='100%' flexWrap='wrap' paddingX={4} paddingTop={2}>
                                <HStack>
                                    <Show when={data.visibility === 'PRIVATE'}>
                                        <Tooltip content={t('newGuideVisibilityHelpPRIVATE')} showArrow>
                                            <Icon size='md'>
                                                <MdOutlineLock />
                                            </Icon>
                                        </Tooltip>
                                    </Show>
                                    <Heading size='3xl' alignSelf='flex-start'>
                                        {data.name}
                                    </Heading>
                                </HStack>
                                <Box flex='1' display='flex' justifyContent='flex-end'>
                                    <HStack
                                        wrap={{ base: 'wrap', sm: 'nowrap' }}
                                        alignItems='flex-end'
                                        justifyContent='flex-end'
                                    >
                                        {isOwner &&
                                            <>
                                                <InatSelector type='PROJECT' select={handleInatLink} />
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
                                </Box>
                            </HStack>
                        </Box>
                        <TabsRoot
                            size='lg' fitted
                            width='100%'
                            defaultValue={window.location.hash && window.location.hash.length > 1
                                ? window.location.hash.substring(1) : 'guide'}
                            variant='outline'
                            onValueChange={details => window.location.hash = details.value}
                            padding={2}
                        >
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
                                        {data.summary &&
                                            <Box
                                                marginBottom={4}
                                                paddingX={4}
                                                paddingY={2}
                                                borderWidth={1}
                                                borderRadius='sm'
                                                boxShadow='sm'
                                                borderColor='border'
                                            >
                                                <Text fontSize='lg'>
                                                    {data.summary}
                                                </Text>
                                            </Box>
                                        }
                                        {data.inaturalistCriteria &&
                                            <Show when={!projectIsLoading} fallback={<Spinner size='sm' margin={2} />}>
                                                {project &&
                                                    <Box
                                                        padding={2}
                                                        borderWidth={1}
                                                        borderRadius='sm'
                                                        boxShadow='sm'
                                                        borderColor='border'
                                                    >
                                                        <HStack>
                                                            <a
                                                                aria-label='iNaturalist'
                                                                href={`https://www.inaturalist.org/projects/${project.id}`}
                                                                target='_blank'
                                                                rel='noopener'
                                                            >
                                                                <IconButton aria-label='iNaturalist' variant='ghost'>
                                                                    <Image
                                                                        src={inatLogo}
                                                                        alt='iNaturalist'
                                                                        objectFit='contain'
                                                                        borderRadius='md'
                                                                        width='40px'
                                                                        height='40px'
                                                                        loading='lazy'
                                                                    />
                                                                </IconButton>
                                                            </a>
                                                            <Image
                                                                src={project.icon ?? inatLogo}
                                                                alt={project.title}
                                                                objectFit='cover'
                                                                borderRadius='md'
                                                                width='60px'
                                                                height='60px'
                                                            />
                                                            <Heading size='md'>
                                                                {project.title}
                                                            </Heading>
                                                        </HStack>
                                                    </Box>
                                                }
                                            </Show>
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
