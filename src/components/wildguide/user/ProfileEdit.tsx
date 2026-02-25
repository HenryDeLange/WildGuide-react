import { selectAuthUserId, selectAuthUsername } from '@/auth/authSlice';
import { BackButton } from '@/components/custom/BackButton';
import { ErrorDisplay } from '@/components/custom/ErrorDisplay';
import { FileUploadList } from '@/components/custom/FileUploadList';
import { SaveButton } from '@/components/custom/SaveButton';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { UpdateUserProfileApiArg, useCreateIconMutation, useFindUserInfoQuery, useUpdateUserProfileMutation } from '@/redux/api/wildguideApi';
import { useAppSelector } from '@/redux/hooks';
import { Box, Container, Fieldset, FileUpload, Heading, HStack, Separator, Show, Spinner, Text, Textarea } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { FileImage } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export function ProfileEdit() {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/user/profile/$username/edit' });

    const username = useAppSelector(selectAuthUsername);
    const userId = useAppSelector(selectAuthUserId);

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useFindUserInfoQuery({
        username: username!
    }, {
        skip: !username
    });

    const [
        doUpdateProfile, {
            isLoading: updateIsLoading,
            isError: updateIsError
        }
    ] = useUpdateUserProfileMutation();

    const [
        doCreateIcon, {
            isLoading: createIconIsLoading,
            isError: createIconIsError
        }
    ] = useCreateIconMutation();

    const { handleSubmit, formState: { errors, isDirty, isSubmitting }, reset, control } = useForm<UpdateUserProfileApiArg & { image?: File; }>();
    useEffect(() => {
        if (isSuccess) {
            reset({
                description: data.description,
                image: undefined
            });
        }
    }, [data, isSuccess, reset]);

    const onSubmit = handleSubmit(async (formValues) => {
        try {
            // Image
            if (formValues.image) {
                // Upload the new profile image
                const formData = new FormData();
                formData.append('file', formValues.image);
                await doCreateIcon({
                    iconCategory: 'USER',
                    iconCategoryId: userId!,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    body: formData as any
                }).unwrap();
            }
            // Description
            if (data?.description !== formValues.description) {
                await doUpdateProfile({ description: formValues.description }).unwrap();
            }
            // Navigate back after success
            handleBack();
        }
        catch (err) {
            console.error('Update Profile failed!', err);
        }
    });

    const handleBack = useCallback(() => navigate({ to: '/user/profile' }), [navigate]);

    return (
        <Container paddingTop={2} paddingBottom={6}>
            <ErrorDisplay error={isError ? error : undefined} />
            <Show when={!isLoading} fallback={<Spinner size='lg' margin={8} />}>
                <form onSubmit={onSubmit}>
                    <HStack paddingBottom={2} wrap={{ base: 'wrap', md: 'nowrap' }}>
                        <HStack width='100%' >
                            <BackButton titleKey='editUserProfileBack' handleBack={handleBack} />
                            <Box width='full'>
                                <Heading whiteSpace={{ base: 'wrap', sm: 'nowrap' }}>
                                    {t('editUserProfileTitle')}
                                </Heading>
                            </Box>
                        </HStack>
                        <HStack
                            width='100%'
                            wrap={{ base: 'wrap', sm: 'nowrap' }}
                            justifyContent='flex-end'
                            justifySelf='flex-end'
                        >
                            <SaveButton
                                titleKey='editUserProfileConfirm'
                                loading={isSubmitting || updateIsLoading || createIconIsLoading}
                                disabled={!isDirty || isSubmitting || updateIsLoading || createIconIsLoading}
                            />
                        </HStack>
                    </HStack>
                    <Separator />
                    <Fieldset.Root
                        invalid={updateIsError || createIconIsError}
                        disabled={isLoading || updateIsLoading || createIconIsLoading}
                        paddingTop={4}
                    >
                        <Fieldset.Content gap={6}>
                            <Fieldset.ErrorText>
                                <Text marginTop={6}>
                                    {t('editUserProfileError')}
                                </Text>
                            </Fieldset.ErrorText>
                            <Field
                                label={<Text fontSize='md'>{t('editUserProfileImage')}</Text>}
                                invalid={!!errors.image || createIconIsError}
                                errorText={errors.image?.message}
                            >
                                <Controller
                                    control={control}
                                    name='image'
                                    render={({ field }) => (
                                        <FileUpload.Root
                                            accept='image/*'
                                            onFileChange={(details) => {
                                                field.onChange(details.acceptedFiles?.[0] ?? undefined);
                                            }}
                                        >
                                            <FileUpload.HiddenInput />
                                            <FileUpload.Trigger asChild>
                                                <Button variant='outline' size='sm'>
                                                    <FileImage />
                                                    {t('editUserProfileImageUpload')}
                                                </Button>
                                            </FileUpload.Trigger>
                                            <FileUploadList disabled={field.disabled || createIconIsLoading} />
                                        </FileUpload.Root>
                                    )}
                                />
                            </Field>
                            <Field
                                label={<Text fontSize='md'>{t('editUserProfileDescription')}</Text>}
                                invalid={!!errors.description || updateIsError}
                                errorText={errors.description?.message}
                            >
                                <Controller
                                    control={control}
                                    name='description'
                                    render={({ field }) => (
                                        <Textarea
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={t('editUserProfileDescriptionPlaceholder')}
                                            variant='outline'
                                            minHeight={150}
                                        />
                                    )}
                                />
                            </Field>
                        </Fieldset.Content>
                    </Fieldset.Root>
                    {/* <DevTool control={control} placement='bottom-right' /> */}
                </form>
            </Show>
        </Container>
    );
}
