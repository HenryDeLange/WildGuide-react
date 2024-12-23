import logo from '@/assets/images/wildguide/logo.png';
import { authLogout, selectAuthRefreshToken, selectAuthUserId } from '@/auth/authSlice';
import { useRefreshMutation } from '@/redux/api/wildguideApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Box, Flex, Heading, IconButton, Image, Show, Stack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGithub } from 'react-icons/fa';
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { LuPlus } from 'react-icons/lu';
import { NavLink } from '../custom/NavLink';
import { ColorModeButton } from '../ui/color-mode';

export const AppHeader = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userId = useAppSelector(selectAuthUserId);
    const refreshToken = useAppSelector(selectAuthRefreshToken);
    const [doUserRefresh, { isLoading: refreshIsLoading }] = useRefreshMutation();
    useEffect(() => {
        if (!userId && refreshToken && refreshToken !== '' && !refreshIsLoading) {
            doUserRefresh();
        }
    }, [doUserRefresh, refreshIsLoading, refreshToken, userId]);
    return (
        <Box as='header' bg={{ base: 'gray.100', _dark: 'gray.900' }} p={4}>
            <Flex alignItems='center' justifyContent='space-between' wrap={{ base: 'wrap', sm: 'nowrap' }} gap={4}>
                <NavLink to='/'>
                    <Stack direction='row' gap={{ base: 1, sm: 2 }} alignItems='center' minWidth={'220'}>
                        <Image
                            alt='WildGuide Logo'
                            src={logo}
                            boxSize={10}
                            borderRadius='full'
                            fit='cover'
                            loading='lazy'
                        />
                        <Heading size='3xl' >
                            {t('appTitle')}
                        </Heading>
                    </Stack>
                </NavLink>
                <Stack direction='row' gap={{ base: 2, sm: 6, md: 12 }} alignItems='center'>
                    <Show when={userId !== null}>
                        <NavLink to='/new-guide' color='fg.success'>
                            <LuPlus />
                            {t('newGuide')}
                        </NavLink>
                    </Show>
                    <NavLink to='/about'>
                        {t('faq')}
                    </NavLink>
                    <NavLink to='/about'>
                        {t('about')}
                    </NavLink>
                </Stack>
                <Stack direction='row' gap={{ base: 2, sm: 6, md: 12 }} alignItems='center'>
                    <Stack direction='row' gap={{ base: 1, sm: 2, md: 4 }} alignItems='center'>
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
                        <ColorModeButton />
                    </Stack>
                    <Show when={userId === null}>
                        <NavLink to='/login'>
                            <FiLogIn /> {t('login')}
                        </NavLink>
                    </Show>
                    <Show when={userId !== null}>
                        <NavLink to='/' onClick={() => {
                            dispatch(authLogout());
                            navigate({ to: '/' });
                        }}>
                            <FiLogOut /> {t('logout')}
                        </NavLink>
                    </Show>
                </Stack>
            </Flex>
        </Box>
    );
};
