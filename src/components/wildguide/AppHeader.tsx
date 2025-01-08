import inatLogo from '@/assets/images/inaturalist/inat-logo-subtle.png';
import logo from '@/assets/images/wildguide/logo.png';
import { authLogout, selectAuthRefreshToken, selectAuthUserId } from '@/auth/authSlice';
import { ChangeLanguage } from '@/i18n/ChangeLanguage';
import { useRefreshMutation } from '@/redux/api/wildguideApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Box, Flex, Heading, IconButton, Image, Show, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGithub } from 'react-icons/fa';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { NavLink } from '../custom/NavLink';
import { ColorModeButton } from '../ui/color-mode';

export function AppHeader() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Automatically login the user, if there is a stored refresh token
    const userId = useAppSelector(selectAuthUserId);
    const refreshToken = useAppSelector(selectAuthRefreshToken);
    const [doUserRefresh, { isLoading: refreshIsLoading }] = useRefreshMutation();
    useEffect(() => {
        if (!userId && refreshToken && refreshToken !== '' && !refreshIsLoading) {
            doUserRefresh();
        }
    }, [doUserRefresh, refreshIsLoading, refreshToken, userId]);

    // RENDER
    return (
        <Box id='app-header' as='header' bg={{ base: 'gray.100', _dark: 'gray.900' }} p={4}>
            <Flex alignItems='center' justifyContent='space-between' wrap={{ base: 'wrap', sm: 'nowrap' }} gap={4}>
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
                        <Heading size='3xl' display={{ base: 'none', md: 'block' }}>
                            {t('appTitle')}
                        </Heading>
                    </Stack>
                </NavLink>
                <Stack direction='row' gap={{ base: 2, sm: 6, md: 12 }} flex={3} alignItems='center' justifyContent='center'>
                    <NavLink to='/'>
                        {t('home')}
                    </NavLink>
                    <NavLink to='/about'>
                        {t('faq')}
                    </NavLink>
                    <NavLink to='/about'>
                        {t('about')}
                    </NavLink>
                </Stack>
                <Stack direction='row' gap={{ base: 1, sm: 2, md: 4 }} alignItems='center'>
                    <a
                        aria-label='iNaturalist'
                        href='https://www.inaturalist.org'
                        target='_blank'
                        rel='noopener'
                    >
                        <IconButton aria-label='iNaturalist' variant='ghost'>
                            <Image
                                src={inatLogo}
                                alt='iNaturalist'
                                boxSize={6}
                                borderRadius='full'
                                fit='cover'
                                loading='lazy'
                            />
                        </IconButton>
                    </a>
                    <a
                        aria-label='GitHub'
                        href='https://github.com/HenryDeLange/WildGuide-react'
                        target='_blank'
                        rel='noopener'
                    >
                        <IconButton variant='ghost'>
                            <FaGithub />
                        </IconButton>
                    </a>
                    <ChangeLanguage />
                    <ColorModeButton />
                </Stack>
                <Box display='flex' flex={1} justifyContent='flex-end'>
                    <Show when={userId === null}>
                        <NavLink
                            to='/login'
                            whiteSpace='nowrap'
                        >
                            <FiLogIn />
                            <Text>{t('login')}</Text>
                        </NavLink>
                    </Show>
                    <Show when={userId !== null}>
                        <NavLink
                            to='/'
                            whiteSpace='nowrap'
                            onClick={() => {
                                dispatch(authLogout());
                                navigate({ to: '/' });
                            }}
                        >
                            <FiLogOut />
                            <Text>{t('logout')}</Text>
                        </NavLink>
                    </Show>
                </Box>
            </Flex>
        </Box>
    );
}
