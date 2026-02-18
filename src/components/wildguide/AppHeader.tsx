import inatLogo from '@/assets/images/inaturalist/inat-logo-subtle.png';
import { authLogout, selectAuth, selectAuthUserId } from '@/auth/authSlice';
import { ChangeLanguage } from '@/i18n/ChangeLanguage';
import { useFindUserInfoQuery } from '@/redux/api/wildguideApi';
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
import { getServerFileUrl } from '../utils';
import GitHubLogo from './../../assets/images/github/github.svg?react';
import logo from '/logo.png';

export function AppHeader() {
    const { t } = useTranslation();

    const useMobileLayout = useBreakpointValue({ base: true, md: false });

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
                {useMobileLayout &&
                    <UserAvatar />
                }
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
                <LoginLogoutControl />
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
                <IconButton variant='ghost' focusVisibleRing='none'>
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
                                    <LoginLogoutControl action={() => store.setOpen(false)} />
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

function LoginLogoutControl({ action }: { action?: () => void }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userId = useAppSelector(selectAuthUserId);
    const handleLogout = useCallback(() => {
        dispatch(authLogout());
        navigate({ to: '/' });
        action?.();
    }, [action, dispatch, navigate]);
    return (
        <Box justifyContent='flex-end'>
            <Show when={userId === null}>
                <HStack gap={4}>
                    <NavLink to='/register' whiteSpace='nowrap' onClick={action}>
                        <Text color='fg.muted'>{t('register')}</Text>
                    </NavLink>
                    <NavLink to='/login' whiteSpace='nowrap' onClick={action}>
                        <LogIn />
                        <Text fontWeight='semibold'>{t('login')}</Text>
                    </NavLink>
                </HStack>
            </Show>
            <Show when={userId !== null}>
                <NavLink to='/' whiteSpace='nowrap' onClick={handleLogout}>
                    <LogOut />
                    <Text>{t('logout')}</Text>
                </NavLink>
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
    const auth = useAppSelector(selectAuth);
    const { data } = useFindUserInfoQuery({
        username: auth.username ?? ''
    }, {
        skip: !auth.userId
    });
    return (
        <>
            {auth.userId && data &&
                <Menu.Root positioning={{ placement: 'bottom' }}>
                    <Menu.Trigger rounded='full' focusRing='outside' cursor='pointer'>
                        <Avatar.Root>
                            <Avatar.Fallback name={data.username} />
                            {data.image &&
                                <Avatar.Image src={getServerFileUrl(data.image)} />
                            }
                        </Avatar.Root>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content padding={2} border='1px solid' borderColor='fg.subtle'>
                                <Heading>
                                    {data.username}
                                </Heading>
                                <Text color='fg.muted'>
                                    {data.description}
                                </Text>
                                <Menu.Separator marginY={4} />
                                <NavLink to='/user/profile'>
                                    <UserRoundPen />
                                    {t('userProfile')}
                                </NavLink>
                                <Menu.Separator marginY={4} />
                                <LoginLogoutControl />
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            }
        </>
    );
}
