import logo from '@/assets/images/wildguide/logo.png';
import { authLogout, selectAuthUserId } from '@/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Box, Flex, Heading, IconButton, Image, Show, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaGithub } from 'react-icons/fa';
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { NavLink } from '../custom/NavLink';
import { ColorModeButton } from '../ui/color-mode';

export const AppHeader = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const userId = useAppSelector(selectAuthUserId);
    return (
        <Box as='header' bg={{ base: 'gray.100', _dark: 'gray.900' }} p={4}>
            <Flex alignItems='center' justifyContent='space-between' wrap={{ base: 'wrap', sm: 'nowrap' }}>
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
                        <Heading size='3xl' >
                            {t('appTitle')}
                        </Heading>
                    </Stack>
                </NavLink>
                <Stack direction='row' gap={{ base: 2, sm: 6, md: 12 }} alignItems='center'>
                    <NavLink to='/about'>
                        {t('FAQ')}
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
                        <NavLink to='/' onClick={() => dispatch(authLogout())}>
                            <FiLogOut /> {t('logout')}
                        </NavLink>
                    </Show>
                </Stack>
            </Flex>
        </Box>
    );
};
