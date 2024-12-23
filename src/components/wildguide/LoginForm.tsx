import { authLogin } from '@/auth/authSlice';
import { useLoginMutation, useRegisterMutation, UserLogin } from '@/redux/api/wildguideApi';
import { useAppDispatch } from '@/redux/hooks';
import { Box, Fieldset, Heading, Input, Show, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import CryptoJS from 'crypto-js';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';
import { LuKeyRound, LuUser } from 'react-icons/lu';
import { Button } from '../ui/button';
import { Field } from '../ui/field';
import { InputGroup } from '../ui/input-group';
import { PasswordInput } from '../ui/password-input';

export function LoginForm() {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/login' });

    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [confirmPassword, setConfirmPassword] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const [doUserLogin, { isLoading: loginIsLoading, isError: loginIsError }] = useLoginMutation();
    const [doUserRegister, { isLoading: registerIsLoading, isError: registerIsError }] = useRegisterMutation();

    const { register, handleSubmit, formState: { errors }, trigger } = useForm<UserLogin>({
        defaultValues: {
            username: '',
            password: ''
        }
    });

    useEffect(() => {
        if (mode === 'register' && confirmPassword) {
            trigger('password');
        }
    }, [confirmPassword, mode, trigger]);

    const onSubmit = handleSubmit(async (data) => {
        const hashedPassword = CryptoJS.SHA256(data.password).toString(CryptoJS.enc.Base64);
        const user = { ...data, password: hashedPassword };
        if (mode === 'register') {
            doUserRegister({ user })
                .unwrap().then(response => {
                    dispatch(authLogin(response));
                    navigate({ to: '/' });
                });
        }
        else {
            doUserLogin({ userLogin: user })
                .unwrap().then(response => {
                    dispatch(authLogin(response));
                    navigate({ to: '/' });
                });
        }
    });

    return (
        <Box maxW='md' mx='auto' mt={10} p={6} borderWidth={1} borderRadius='lg' boxShadow='lg'>
            <form onSubmit={onSubmit}>
                <VStack gap={4}>
                    <Fieldset.Root
                        invalid={loginIsError || registerIsError}
                        disabled={loginIsLoading || registerIsLoading}
                    >
                        <Fieldset.Legend>
                            <Show when={mode === 'login'}>
                                <Heading>{t('loginFormTitle')}</Heading>
                            </Show>
                            <Show when={mode === 'register'}>
                                <Heading>{t('loginFormTitleRegister')}</Heading>
                            </Show>
                        </Fieldset.Legend>
                        <Fieldset.HelperText>
                            <Show when={mode === 'login'}>
                                <Text>{t('loginFormDescription')}</Text>
                            </Show>
                            <Show when={mode === 'register'}>
                                <Text>{t('loginFormDescriptionRegister')}</Text>
                            </Show>
                        </Fieldset.HelperText>
                        <Fieldset.Content>
                            <Field
                                label={t('loginFormUsername')}
                                invalid={!!errors.username || loginIsError || registerIsError}
                                errorText={errors.username?.message}
                            >
                                <InputGroup flex='1' width='full' startElement={<LuUser />}>
                                    <Input
                                        {...register('username', {
                                            required: t('loginFormUsernameRequired'),
                                            minLength: { value: 4, message: t('loginFormUsernameInvalid') },
                                            maxLength: { value: 64, message: t('loginFormUsernameInvalid') }
                                        })}
                                        placeholder={t('loginFormUsernamePlaceholder')}
                                    />
                                </InputGroup>
                            </Field>
                            <Field
                                label={t('loginFormPassword')}
                                invalid={!!errors.password || loginIsError || registerIsError}
                                errorText={errors.password?.message}
                            >
                                <InputGroup flex='1' width='full' startElement={<LuKeyRound />}>
                                    <PasswordInput
                                        {...register('password', {
                                            required: t('loginFormPasswordRequired'),
                                            minLength: { value: 8, message: t('loginFormPasswordInvalid') },
                                            maxLength: { value: 128, message: t('loginFormPasswordInvalid') },
                                            validate: (value) => {
                                                if (mode === 'register') {
                                                    return value === confirmPassword || t('loginFormPasswordConfirmInvalid');
                                                }
                                                return true;
                                            }
                                        })}
                                        placeholder={t('loginFormPasswordPlaceholder')}
                                    />
                                </InputGroup>
                                <Show when={mode === 'register'}>
                                    <InputGroup flex='1' width='full' startElement={<LuKeyRound />}>
                                        <PasswordInput
                                            value={confirmPassword ?? ''}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder={t('loginFormPasswordConfirmPlaceholder')}
                                        />
                                    </InputGroup>
                                </Show>
                            </Field>
                            <Button type='submit' width='full' loading={loginIsLoading || registerIsLoading}>
                                <Show when={mode === 'login'}>
                                    <FiLogIn /> {t('login')}
                                </Show>
                                <Show when={mode === 'register'}>
                                    <FiUserPlus /> {t('register')}
                                </Show>
                            </Button>
                        </Fieldset.Content>
                        <Fieldset.ErrorText>
                            <Text>{t('loginFormError')}</Text>
                        </Fieldset.ErrorText>
                        <Show when={mode === 'login'}>
                            <Button
                                variant='ghost'
                                onClick={() => {
                                    setConfirmPassword(null);
                                    setMode('register');
                                }}
                            >
                                {t('loginFormRegister')}
                            </Button>
                        </Show>
                        <Show when={mode === 'register'}>
                            <Button
                                variant='ghost'
                                onClick={() => {
                                    setConfirmPassword(null);
                                    setMode('login');
                                }}
                            >
                                {t('loginFormLogin')}
                            </Button>
                        </Show>
                    </Fieldset.Root>
                </VStack>
            </form>
            {/* <DevTool control={control} /> */}
        </Box>
    );
}
