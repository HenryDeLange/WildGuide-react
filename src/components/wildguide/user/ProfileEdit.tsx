import { selectAuthUserId, selectAuthUsername } from '@/auth/authSlice';
import { BackButton } from '@/components/custom/BackButton';
import { ErrorDisplay } from '@/components/custom/ErrorDisplay';
import { SaveButton } from '@/components/custom/SaveButton';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { UpdateUserProfileApiArg, useCreateFileMutation, useDeleteFileMutation, useFindUserInfoQuery, useUpdateUserProfileMutation, wildguideApi } from '@/redux/api/wildguideApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Box, Container, Fieldset, FileUpload, Float, Heading, HStack, Separator, Show, Spinner, Text, Textarea, useFileUploadContext } from '@chakra-ui/react';
import { DevTool } from '@hookform/devtools';
import { useNavigate } from '@tanstack/react-router';
import { FileImage, X } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type FormType = UpdateUserProfileApiArg & { image?: File; };

export function ProfileEdit() {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/user/profile/$username/edit' });
    const dispatch = useAppDispatch();

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
            isSuccess: updateIsSuccess,
            isError: updateIsError
        }
    ] = useUpdateUserProfileMutation();

    const [
        doCreateFile, {
            isLoading: createFileIsLoading,
            isSuccess: createFileIsSuccess,
            isError: createFileIsError
        }
    ] = useCreateFileMutation();

    const [
        doDeleteFile, {
            isLoading: deleteFileIsLoading,
            isSuccess: deleteFileIsSuccess,
            isError: deleteFileIsError
        }
    ] = useDeleteFileMutation();

    const { handleSubmit, formState: { errors, isDirty, isSubmitting }, reset, control } = useForm<FormType>();
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
            console.log('Submitting profile update', { hasImage: !!formValues.image });
            // Description
            await doUpdateProfile({ description: formValues.description }).unwrap();
            // Image
            if (formValues.image) {
                // create file and wait for the server response
                const formData = new FormData();
                formData.append('file', formValues.image);
                const createRes = await doCreateFile({
                    fileCategory: 'USER',
                    fileCategoryId: userId!.toString(),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    body: formData as any
                }).unwrap();
                console.log('Create file response', createRes);
                // delete previous image (if any)
                if (data?.image) {
                    const urlParts = data.image.split('/');
                    try {
                        await doDeleteFile({
                            fileCategory: 'USER',
                            fileCategoryId: userId!.toString(),
                            fileId: urlParts[urlParts.length - 2],
                            fileName: urlParts[urlParts.length - 1]
                        }).unwrap();
                        console.log('Deleted previous user file');
                    } catch (delErr) {
                        console.error('Failed to delete previous file', delErr);
                    }
                }
                dispatch(wildguideApi.util.invalidateTags(['User Authentication']));
            }
            // Navigate back after success
            handleBack();
        }
        catch (err) {
            console.error('Profile update/upload failed', err);
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
                                loading={isSubmitting || updateIsLoading || createFileIsLoading || deleteFileIsLoading}
                                disabled={!isDirty || isSubmitting || updateIsLoading || createFileIsLoading || deleteFileIsLoading}
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
                                invalid={!!errors.image || createFileIsError}
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
                                            <FileUploadList disabled={field.disabled || createFileIsLoading} />
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
                    <DevTool control={control} placement='bottom-right' />
                </form>
            </Show>
        </Container>
    );
}

type FileUploadListProps = {
    disabled?: boolean;
}

function FileUploadList({ disabled }: FileUploadListProps) {
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
                    {!disabled &&
                        <Float placement='top-end'>
                            <FileUpload.ItemDeleteTrigger
                                boxSize='4'
                                layerStyle='fill.muted'
                                disabled={disabled}
                            >
                                <X />
                            </FileUpload.ItemDeleteTrigger>
                        </Float>
                    }
                </FileUpload.Item>
            ))}
        </FileUpload.ItemGroup>
    )
}
