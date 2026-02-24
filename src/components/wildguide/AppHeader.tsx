import inatLogo from '@/assets/images/inaturalist/inat-logo-subtle.png';
import { authLogout, selectAuth, selectAuthUserId } from '@/auth/authSlice';
import { ChangeLanguage } from '@/i18n/ChangeLanguage';
import { useFindUserInfoQuery } from '@/redux/api/wildguideApi';
import { useDownloadIconBlobQuery, wildguideApiExtended } from '@/redux/api/wildguideApiExtended';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Avatar, Box, CloseButton, DrawerContext, DrawerPositioner, Flex, Heading, HStack, IconButton, Image, Menu, Portal, Separator, Show, Stack, Text, useBreakpointValue, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { t } from 'i18next';
import { LogIn, LogOut, Menu as MenuIcon, UserRoundPen } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from '../custom/NavLink';
import { ColorModeButton, useColorModeValue } from '../ui/color-mode';
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from '../ui/drawer';
import GitHubLogo from './../../assets/images/github/github.svg?react';
import logo from '/logo.png';

export function AppHeader() {
    const { t } = useTranslation();
    const useMobileLayout = useBreakpointValue({ base: true, md: false });
    const userId = useAppSelector(selectAuthUserId);
    return (
        <Box id='app-header' as='header' bg={{ base: 'gray.100', _dark: 'gray.900' }} paddingY={2} paddingX={4}>
            <Flex alignItems='center' justifyContent='space-between' gap={4}>
                <Flex gap={2}>
                    {useMobileLayout &&
                        <MobileMenu />
                    }
                    <NavLink to='/'>
                        <Stack direction='row' gap={{ base: 1, sm: 2 }} alignItems='center'>
                            <Image
                                alt='WildGuide Logo'
                                src={logo}
                                boxSize={10}
                                borderRadius='full'
                                fit='cover'
                                loading='lazy'
                            />
                            <Heading size={{ base: 'lg', sm: '3xl' }} truncate>
                                {t('appTitle')}
                            </Heading>
                        </Stack>
                    </NavLink>
                </Flex>
                {!useMobileLayout &&
                    <DesktopMenu />
                }
                {useMobileLayout && (
                    userId ? <UserAvatar /> : <LoginControl variant='small' />
                )}
            </Flex>
        </Box>
    );
}

function DesktopMenu() {
    const { t } = useTranslation();
    const userId = useAppSelector(selectAuthUserId);
    return (
        <>
            <Stack direction='row' gap={{ base: 2, sm: 6, md: 12 }} flex={3} alignItems='center' justifyContent='center'>
                <NavLink to='/guides'>
                    {t('guides')}
                </NavLink>
                <NavLink to='/about'>
                    {t('about')}
                </NavLink>
            </Stack>
            <HStack flex={1} gap={{ base: 1, sm: 2, md: 4 }} alignItems='center' justifyContent='center'>
                <InaturalistLink />
                <GitHubLink />
            </HStack>
            <HStack flex={1} gap={{ base: 1, sm: 2, md: 4 }} alignItems='center' justifyContent='center'>
                <ChangeLanguage />
                <ColorModeButton />
            </HStack>
            {!userId &&
                <LoginControl />
            }
            <UserAvatar />
        </>
    );
}

function MobileMenu() {
    const { t } = useTranslation();
    return (
        <DrawerRoot placement='start' size='xs'>
            <DrawerBackdrop />
            <DrawerTrigger asChild>
                <IconButton variant='ghost' focusVisibleRing='none' marginLeft={-2}>
                    <MenuIcon />
                </IconButton>
            </DrawerTrigger>
            <DrawerPositioner >
                <DrawerContent>
                    <DrawerCloseTrigger />
                    <DrawerHeader>
                        <DrawerTitle>
                            {t('appTitle')}
                        </DrawerTitle>
                    </DrawerHeader>
                    <DrawerBody>
                        <DrawerContext>
                            {(store) => (
                                <>
                                    <LoginControl action={() => store.setOpen(false)} />
                                    <Separator marginY={4} />
                                    <VStack gap={6} alignItems='flex-start' width='full'>
                                        <NavLink
                                            to='/guides'
                                            fontSize='md'
                                            width='full'
                                            onClick={() => store.setOpen(false)}
                                        >
                                            {t('guides')}
                                        </NavLink>
                                        <NavLink
                                            to='/about' fontSize='md'
                                            width='full'
                                            onClick={() => store.setOpen(false)}
                                        >
                                            {t('about')}
                                        </NavLink>
                                    </VStack>
                                </>
                            )}
                        </DrawerContext>
                    </DrawerBody>
                    <DrawerFooter>
                        <ChangeLanguage />
                        <ColorModeButton />
                        <InaturalistLink />
                        <GitHubLink />
                    </DrawerFooter>
                    <DrawerCloseTrigger asChild>
                        <CloseButton />
                    </DrawerCloseTrigger>
                </DrawerContent>
            </DrawerPositioner>
        </DrawerRoot>
    );
}

function LoginControl({ action, variant = 'full' }: { action?: () => void; variant?: 'full' | 'small'; }) {
    const userId = useAppSelector(selectAuthUserId);
    return (
        <Box justifyContent='flex-end'>
            <Show when={userId === null}>
                <HStack gap={4}>
                    {variant === 'full' &&
                        <NavLink to='/register' whiteSpace='nowrap' onClick={action}>
                            <Text color='fg.muted'>{t('register')}</Text>
                        </NavLink>
                    }
                    <NavLink to='/login' whiteSpace='nowrap' onClick={action}>
                        <LogIn />
                        <Text fontWeight='semibold'>{t('login')}</Text>
                    </NavLink>
                </HStack>
            </Show>
        </Box>
    );
}

function InaturalistLink() {
    return (
        <IconButton asChild aria-label='iNaturalist' variant='ghost' size='sm'>
            <a
                aria-label='iNaturalist'
                href='https://www.inaturalist.org'
                target='_blank'
                rel='noopener'
            >
                <Image
                    src={inatLogo}
                    alt='iNaturalist'
                    boxSize={6}
                    borderRadius='full'
                    fit='contain'
                    loading='lazy'
                />
            </a>
        </IconButton>
    );
}

function GitHubLink() {
    const fillColor = useColorModeValue('#000', '#fff')
    return (
        <IconButton asChild variant='ghost' size='sm'>
            <a
                aria-label='GitHub'
                href='https://github.com/HenryDeLange/WildGuide-react'
                target='_blank'
                rel='noopener'
            >
                <GitHubLogo fill={fillColor} />
            </a>
        </IconButton>
    );
}

function UserAvatar() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const auth = useAppSelector(selectAuth);
    const { data } = useFindUserInfoQuery({
        username: auth.username ?? ''
    }, {
        skip: !auth.userId
    });
    const {
        data: userIcon,
        isFetching: userIconIsFetching,
        isError: userIconIsError
    } = useDownloadIconBlobQuery({
        iconCategory: 'USER',
        iconCategoryId: auth.userId ?? -1
    }, {
        skip: !auth.userId
    });
    const handleProfile = useCallback(() => {
        navigate({ to: '/user/profile' });
    }, [navigate]);
    const handleLogout = useCallback(() => {
        dispatch(authLogout());
        dispatch(wildguideApiExtended.util.invalidateTags(['Icons']));
        navigate({ to: '/' });
    }, [dispatch, navigate]);
    return (
        <>
            {auth.userId && data &&
                <Menu.Root positioning={{ placement: 'bottom' }}>
                    <Menu.Trigger rounded='full' focusRing='outside' cursor='pointer'>
                        <Avatar.Root>
                            <Avatar.Fallback name={data.username} />
                            {!userIconIsError && !userIconIsFetching && userIcon &&
                                <Avatar.Image src={userIcon} />
                            }
                        </Avatar.Root>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content border='1px solid' borderColor='fg.subtle'>
                                <Heading textAlign='center'>
                                    {data.username}
                                </Heading>
                                <Text textAlign='center' color='fg.muted'>
                                    {data.description}
                                </Text>
                                <Menu.Separator />
                                <Menu.Item value='profile' cursor='pointer' onClick={handleProfile}>
                                    <UserRoundPen />
                                    {t('userProfile')}
                                </Menu.Item>
                                <Menu.Item value='logout' cursor='pointer' onClick={handleLogout}>
                                    <LogOut />
                                    {t('logout')}
                                </Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            }
        </>
    );
}
