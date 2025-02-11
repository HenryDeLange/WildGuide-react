import inatLogo from '@/assets/images/inaturalist/inat-logo-subtle.png';
import { selectAuthUserId } from '@/auth/authSlice';
import { ExtendedMarkdown } from '@/components/markdown/ExtendedMarkdown';
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import { useFindGuideOwnersQuery, useFindGuideQuery } from '@/redux/api/wildguideApi';
import { useAppSelector } from '@/redux/hooks';
import { Box, Heading, HStack, Icon, Image, QrCode, Separator, Show, Spinner, Stack, TabsContent, TabsList, TabsRoot, TabsTrigger, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LuBookText, LuLayoutList, LuQrCode, LuRefreshCcw } from 'react-icons/lu';
import { MdEdit, MdOutlineLock } from 'react-icons/md';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { Button } from '../../ui/button';
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

    const handleRefresh = useCallback(() => {
        refetch();
        ownerRefetch();
    }, [ownerRefetch, refetch]);

    // RENDER
    return (
        <Box display='flex' flexDirection='column' alignItems='center'>
            <ErrorDisplay error={isError ? error : ownerIsError ? ownerError : undefined} />
            <Show when={!isLoading && !ownerIsLoading} fallback={<Spinner size='lg' margin={8} />}>
                {data &&
                    <Box width='100%' paddingY={2} paddingX={4}>
                        <HStack flex={1}>
                            <Show when={data.visibility === 'PRIVATE'}>
                                <Tooltip content={t('newGuideVisibilityHelpPRIVATE')} showArrow>
                                    <Icon size='md'>
                                        <MdOutlineLock />
                                    </Icon>
                                </Tooltip>
                            </Show>
                            <Heading size='4xl'>
                                {data.name}
                            </Heading>
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
                        <TabsRoot marginTop={2} size='lg' fitted width='100%' defaultValue='guide' variant='outline'>
                            <TabsList>
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
                            >
                                <VStack width='100%'>
                                    <Box width='100%' paddingTop={4} paddingX={4}>
                                        <Stack direction='row'>
                                            {isOwner &&
                                                <>
                                                    <GuideLinkUsers guideId={guideId} />
                                                    <Button
                                                        size='lg'
                                                        variant='ghost'
                                                        color='fg.info'
                                                        onClick={handleEdit}
                                                        whiteSpace='nowrap'
                                                    >
                                                        <MdEdit />
                                                        <Text>
                                                            {t('editGuide')}
                                                        </Text>
                                                    </Button>
                                                </>
                                            }
                                            <PopoverRoot lazyMount>
                                                <PopoverTrigger asChild>
                                                    <Box>
                                                        <Tooltip content={t('qrButton')} >
                                                            <Button variant='ghost' whiteSpace='nowrap'>
                                                                <LuQrCode />
                                                            </Button>
                                                        </Tooltip>
                                                    </Box>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <PopoverArrow />
                                                    <PopoverBody>
                                                        <PopoverTitle width='100%' textAlign='center'>
                                                            <Heading>
                                                                {t('qrTitleGuide')}
                                                            </Heading>
                                                        </PopoverTitle>
                                                        <Separator marginY={4} />
                                                        <Box>
                                                            <QrCode.Root value={`${window.location.origin}/guides/${guideId}`} size='lg' width='100%'>
                                                                <QrCode.Frame fill='black' backgroundColor='white' width='100%'>
                                                                    <QrCode.Pattern />
                                                                </QrCode.Frame>
                                                                <QrCode.DownloadTrigger asChild fileName='qr-code.png' mimeType='image/png'>
                                                                    <Button variant='outline' size='xs' mt='3' width='100%'>
                                                                        {t('qrDownload')}
                                                                    </Button>
                                                                </QrCode.DownloadTrigger>
                                                            </QrCode.Root>
                                                        </Box>
                                                    </PopoverBody>
                                                </PopoverContent>
                                            </PopoverRoot>
                                            <Tooltip content={t('guideGridRefresh')}>
                                                <Button
                                                    aria-label={t('guideGridRefresh')}
                                                    size='md'
                                                    variant='ghost'
                                                    onClick={handleRefresh}
                                                    loading={isFetching || ownerIsFetching}
                                                >
                                                    <LuRefreshCcw />
                                                </Button>
                                            </Tooltip>
                                        </Stack>
                                        {data.inaturalistCriteria &&
                                            <Box width='fit-content' justifySelf='flex-end'>
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
                            >
                                <EntryList guideId={guideId} />
                            </TabsContent>
                        </TabsRoot>
                    </Box>
                }
            </Show>
        </Box>
    );
}
