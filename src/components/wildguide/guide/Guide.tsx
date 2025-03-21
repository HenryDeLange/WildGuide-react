import { selectAuthUserId } from '@/auth/authSlice';
import { EditButton } from '@/components/custom/EditButton';
import { InatLinkCard } from '@/components/custom/InatLinkCard';
import { InatSelector, InatSelectorTypes } from '@/components/custom/InatSelector';
import { OptionsMenu } from '@/components/custom/OptionsMenu';
import { SummaryBox } from '@/components/custom/SummaryBox';
import { ExtendedMarkdown } from '@/components/markdown/ExtendedMarkdown';
import { GuideBase, useCreateGuideStarMutation, useDeleteGuideStarMutation, useFindGuideQuery, useUpdateGuideMutation } from '@/redux/api/wildguideApi';
import { useAppSelector } from '@/redux/hooks';
import { Box, Heading, HStack, Icon, IconButton, Show, Spinner, Stack, TabsContent, TabsList, TabsRoot, TabsTrigger, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { LuBookText, LuLayoutList } from 'react-icons/lu';
import { MdOutlineLock } from 'react-icons/md';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { Tooltip } from '../../ui/tooltip';
import { EntryList } from '../entry/EntryList';
import { useIsOwner } from '../hooks/userHooks';
import { GuideLinkUsers } from './GuideLinkUsers';

type Props = {
    guideId: number;
}

export function Guide({ guideId }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/$guideId' });

    const userId = useAppSelector(selectAuthUserId);

    const {
        isOwner,
        isLoading: ownerIsLoading,
        isFetching: ownerIsFetching,
        isError: ownerIsError,
        error: ownerError,
        refetch: ownerRefetch
    } = useIsOwner(guideId);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch
    } = useFindGuideQuery({ guideId });

    const [
        doUpdate, {
            isLoading: updateIsLoading,
            isError: updateIsError,
            error: updateError
        }
    ] = useUpdateGuideMutation();

    const [
        doCreateStar, {
            isLoading: createStarIsLoading
        }
    ] = useCreateGuideStarMutation();

    const [
        doDeleteStar, {
            isLoading: deleteStarIsLoading
        }
    ] = useDeleteGuideStarMutation();

    const handleEdit = useCallback(() => navigate({ to: '/guides/$guideId/edit' }), [navigate]);

    const [entriesRefresh, setEntriesRefresh] = useState(false);
    const handleEntriesRefreshComplete = useCallback(() => setEntriesRefresh(false), []);
    const handleRefresh = useCallback(() => {
        setEntriesRefresh(true);
        refetch();
        ownerRefetch();
    }, [ownerRefetch, refetch]);

    const handleInatLink = useCallback((type: InatSelectorTypes, inatId: number | null) => {
        if (data) {
            const newLink: Partial<GuideBase> = type === 'PROJECT'
                ? { inaturalistProject: inatId ?? undefined }
                : { inaturalistTaxon: inatId ?? undefined };
            doUpdate({
                guideId,
                guideBase: {
                    ...data,
                    ...newLink
                }
            });
        }
    }, [data, doUpdate, guideId]);

    const handleStar = useCallback(() => {
        if (data?.starredByUser) {
            doDeleteStar({ guideId });
        }
        else {
            doCreateStar({ guideId });
        }
    }, [data?.starredByUser, doCreateStar, doDeleteStar, guideId]);

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
                                    {userId &&
                                        <IconButton
                                            variant='plain'
                                            onClick={handleStar}
                                            loading={createStarIsLoading || deleteStarIsLoading}
                                            color={data.starredByUser ? 'fg.info' : undefined}
                                        >
                                            {data.starredByUser ? <FaStar /> : <FaRegStar />}
                                        </IconButton>
                                    }
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
                                                <InatSelector type='TAXON' select={handleInatLink} />
                                                <GuideLinkUsers guideId={guideId} />
                                                <EditButton titleKey='editGuide' handleEdit={handleEdit} />
                                            </>
                                        }
                                        <OptionsMenu
                                            type='GUIDE'
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
                                    fontSize={{ base: '1em', sm: '1.3em' }}
                                    _selected={{ bgColor: 'bg.subtle' }}
                                    padding={1}
                                >
                                    <LuBookText />
                                    <Text truncate>
                                        {t('guideTab')}
                                    </Text>
                                </TabsTrigger>
                                <TabsTrigger
                                    value='entries'
                                    fontSize={{ base: '1em', sm: '1.3em' }}
                                    _selected={{ bgColor: 'bg.subtle' }}
                                    padding={1}
                                >
                                    <LuLayoutList />
                                    <Text truncate>
                                        {t('guideEntriesTab')}
                                    </Text>
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
                                <Stack width='100%' gap={2} padding={2}>
                                    <SummaryBox summary={data.summary} />
                                    <Stack>
                                        <InatLinkCard type='PROJECT' inatId={data.inaturalistProject} />
                                        <InatLinkCard type='TAXON' inatId={data.inaturalistTaxon} />
                                    </Stack>
                                    <ExtendedMarkdown content={data.description} />
                                </Stack>
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
                                    guideInatProject={data.inaturalistProject}
                                    guideInatTaxon={data.inaturalistTaxon}
                                />
                            </TabsContent>
                        </TabsRoot>
                    </Box>
                }
            </Show>
        </Box>
    );
}
