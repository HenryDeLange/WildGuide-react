import inatLogo from '@/assets/images/inaturalist/inat-logo-subtle.png';
import logo from '@/assets/images/wildguide/logo.png';
import { authLogout, selectAuthUserId } from '@/auth/authSlice';
import { ChangeLanguage } from '@/i18n/ChangeLanguage';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Box, CloseButton, DrawerContext, DrawerPositioner, Flex, Heading, HStack, IconButton, Image, Separator, Show, Stack, Text, useBreakpointValue, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { t } from 'i18next';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGithub } from 'react-icons/fa';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { MdOutlineMenu } from 'react-icons/md';
import { NavLink } from '../custom/NavLink';
import { ColorModeButton } from '../ui/color-mode';
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from '../ui/drawer';

export function AppHeader() {
    const { t } = useTranslation();

    const useMobileLayout = useBreakpointValue({ base: true, md: false });

    return (
        <Box id='app-header' as='header' bg={{ base: 'gray.100', _dark: 'gray.900' }} paddingY={2} paddingX={4}>
            <Flex alignItems='center' justifyContent='space-between' gap={4}>
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
                {!useMobileLayout &&
                    <DesktopMenu />
                }
                {useMobileLayout &&
                    <MobileMenu />
                }
            </Flex>
        </Box>
    );
}

function DesktopMenu() {
    const { t } = useTranslation();
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
            <LoginLogoutControl />
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
                    <MdOutlineMenu />
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
                        <FiLogIn />
                        <Text fontWeight='semibold'>{t('login')}</Text>
                    </NavLink>
                </HStack>
            </Show>
            <Show when={userId !== null}>
                <NavLink to='/' whiteSpace='nowrap' onClick={handleLogout}>
                    <FiLogOut />
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
    return (
        <IconButton asChild variant='ghost' size='sm'>
            <a
                aria-label='GitHub'
                href='https://github.com/HenryDeLange/WildGuide-react'
                target='_blank'
                rel='noopener'
            >
                <FaGithub />
            </a>
        </IconButton>
    );
}
