import { authLogin } from '@/auth/authSlice';
import { useLoginMutation, useRegisterMutation, UserLogin } from '@/redux/api/wildguideApi';
import { useAppDispatch } from '@/redux/hooks';
import { Box, Fieldset, Heading, Input, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import CryptoJS from 'crypto-js';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';
import { LuKeyRound, LuUser } from 'react-icons/lu';
import { NavLink } from '../custom/NavLink';
import { Button } from '../ui/button';
import { Field } from '../ui/field';
import { InputGroup } from '../ui/input-group';
import { PasswordInput } from '../ui/password-input';

type Props = {
    registerMode?: boolean;
}

export function LoginForm({ registerMode }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: registerMode ? '/register' : '/login' });
    const dispatch = useAppDispatch();

    const [confirmPassword, setConfirmPassword] = useState<string | null>(null);

    const [
        doUserLogin, {
            isLoading: loginIsLoading,
            isError: loginIsError
        }
    ] = useLoginMutation();
    const [doUserRegister, {
        isLoading: registerIsLoading,
        isError: registerIsError
    }
    ] = useRegisterMutation();

    const { register, handleSubmit, formState: { errors }, trigger } = useForm<UserLogin>({
        defaultValues: {
            username: '',
            password: ''
        }
    });

    useEffect(() => {
        if (registerMode && confirmPassword) {
            trigger('password');
        }
    }, [confirmPassword, registerMode, trigger]);

    const onSubmit = handleSubmit(async (data) => {
        const hashedPassword = CryptoJS.SHA256(data.password).toString(CryptoJS.enc.Base64);
        const user = { ...data, password: hashedPassword };
        if (registerMode) {
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
                            <Heading>
                                {t(registerMode ? 'loginFormTitleRegister' : 'loginFormTitle')}
                            </Heading>
                        </Fieldset.Legend>
                        <Fieldset.HelperText marginTop={1}>
                            <Text>
                                {t(registerMode ? 'loginFormDescriptionRegister' : 'loginFormDescription')}
                            </Text>
                        </Fieldset.HelperText>
                        <Fieldset.Content>
                            <Field
                                label={<Text fontSize='md'>{t('loginFormUsername')}</Text>}
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
                                        autoFocus
                                    />
                                </InputGroup>
                            </Field>
                            <Field
                                label={<Text fontSize='md'>{t('loginFormPassword')}</Text>}
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
                                                if (registerMode) {
                                                    return value === confirmPassword || t('loginFormPasswordConfirmInvalid');
                                                }
                                                return true;
                                            }
                                        })}
                                        placeholder={t('loginFormPasswordPlaceholder')}
                                    />
                                </InputGroup>
                                {registerMode &&
                                    <InputGroup flex='1' width='full' startElement={<LuKeyRound />}>
                                        <PasswordInput
                                            id='confirm-password'
                                            value={confirmPassword ?? ''}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder={t('loginFormPasswordConfirmPlaceholder')}
                                        />
                                    </InputGroup>
                                }
                            </Field>
                            <Button type='submit' width='full' loading={loginIsLoading || registerIsLoading}>
                                {registerMode ? <FiUserPlus /> : <FiLogIn />}
                                {t(registerMode ? 'register' : 'login')}
                            </Button>
                        </Fieldset.Content>
                        <Fieldset.ErrorText>
                            <Text>{t('loginFormError')}</Text>
                        </Fieldset.ErrorText>
                        <Box alignSelf='center' fontSize='sm' marginTop={8}>
                            <NavLink to={registerMode ? '/login' : '/register'}>
                                {t(registerMode ? 'loginFormLogin' : 'loginFormRegister')}
                            </NavLink>
                        </Box>
                    </Fieldset.Root>
                </VStack>
            </form>
            {/* <DevTool control={control} /> */}
        </Box>
    );
}
