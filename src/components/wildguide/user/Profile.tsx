import { selectAuthUserId, selectAuthUsername } from '@/auth/authSlice';
import { BackButton } from '@/components/custom/BackButton';
import { ErrorDisplay } from '@/components/custom/ErrorDisplay';
import { SaveButton } from '@/components/custom/SaveButton';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { UpdateUserProfileApiArg, useCreateFileMutation, useFindUserInfoQuery, useUpdateUserProfileMutation } from '@/redux/api/wildguideApi';
import { useAppSelector } from '@/redux/hooks';
import { Box, Container, Fieldset, FileUpload, Float, Heading, HStack, Separator, Show, Spinner, Text, Textarea, useFileUploadContext } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { FileImage, X } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type FormType = UpdateUserProfileApiArg & { image: Blob; };

export function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/user/profile' });

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
        doCreateFile, {
            isLoading: createFileIsLoading,
            isError: createFileIsError
        }
    ] = useCreateFileMutation();

    const { handleSubmit, formState: { errors, isDirty }, reset, control } = useForm<FormType>();
    useEffect(() => {
        if (isSuccess) {
            reset({ description: data.description });
        }
    }, [data, isSuccess, reset]);

    const onSubmit = handleSubmit(async (data) => {
        doUpdateProfile({ description: data.description });
        
        if (data.image) {
            const formData = new FormData();
            formData.append('file', data.image);
            
            doCreateFile({
                fileCategory: 'USER',
                fileCategoryId: userId!.toString(),
                body: formData as any
            });
        }
    });

    const handleBack = useCallback(() => navigate({ to: '/' }), [navigate]);

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
                                loading={isLoading}
                                disabled={!isDirty}
                            />
                        </HStack>
                    </HStack>
                    <Separator />
                    <Fieldset.Root
                        invalid={updateIsError || createFileIsError}
                        disabled={isLoading || updateIsLoading || createFileIsLoading}
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
                                invalid={!!errors.image || isError}
                                errorText={errors.image?.message}
                            >
                                <Controller
                                    control={control}
                                    name='image'
                                    render={({ field }) => (
                                        <FileUpload.Root
                                            accept='image/*'
                                            onFileChange={(details) => {
                                                const file = details.acceptedFiles[0];
                                                if (file) {
                                                    field.onChange(file as Blob);
                                                }
                                            }}
                                        >
                                            <FileUpload.HiddenInput />
                                            <FileUpload.Trigger asChild>
                                                <Button variant='outline' size='sm'>
                                                    <FileImage />
                                                    {t('editUserProfileImageUpload')}
                                                </Button>
                                            </FileUpload.Trigger>
                                            <FileUploadList />
                                        </FileUpload.Root>
                                    )}
                                />
                            </Field>
                            <Field
                                label={<Text fontSize='md'>{t('editUserProfileDescription')}</Text>}
                                invalid={!!errors.description || isError}
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
                </form>
            </Show>
        </Container>
    );
}

function FileUploadList() {
    const fileUpload = useFileUploadContext()
    const files = fileUpload.acceptedFiles
    if (files.length === 0)
        return null
    return (
        <FileUpload.ItemGroup>
            {files.map((file) => (
                <FileUpload.Item
                    w='auto'
                    boxSize='20'
                    p='2'
                    file={file}
                    key={file.name}
                >
                    <FileUpload.ItemPreviewImage />
                    <Float placement='top-end'>
                        <FileUpload.ItemDeleteTrigger boxSize='4' layerStyle='fill.solid'>
                            <X />
                        </FileUpload.ItemDeleteTrigger>
                    </Float>
                </FileUpload.Item>
            ))}
        </FileUpload.ItemGroup>
    )
}
