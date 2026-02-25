import { BackButton } from '@/components/custom/BackButton';
import { FileUploadList } from '@/components/custom/FileUploadList';
import { SaveButton } from '@/components/custom/SaveButton';
import { MarkdownInput } from '@/components/markdown/MarkdownInput';
import { GuideBase, useCreateIconMutation, useDeleteGuideMutation, useFindGuideQuery, useUpdateGuideMutation } from '@/redux/api/wildguideApi';
import { Box, Button, Container, Fieldset, FileUpload, Heading, HStack, Input, Separator, Show, Spinner, Text, Textarea } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { FileImage } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DeleteButton } from '../../custom/DeleteButton';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { Field } from '../../ui/field';

type Props = {
    guideId: number;
}

export function GuideEdit({ guideId }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/$guideId/edit' });

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useFindGuideQuery({ guideId });

    const [
        doUpdate, {
            isLoading: updateIsLoading,
            isError: updateIsError,
            // error: updateError
        }
    ] = useUpdateGuideMutation();

    const [
        doDelete, {
            isLoading: deleteIsLoading,
            // isError: deleteIsError,
            // error: deleteError
        }
    ] = useDeleteGuideMutation();

    const [
        doCreateIcon, {
            isLoading: createIconIsLoading,
            isError: createIconIsError
        }
    ] = useCreateIconMutation();

    const { register, handleSubmit, formState: { errors, isDirty }, control, reset } = useForm<GuideBase & { image?: File; }>();
    useEffect(() => {
        if (isSuccess) {
            reset({
                ...data,
                image: undefined
            });
        }
    }, [data, isSuccess, reset]);

    const onSubmit = handleSubmit(async (formValues) => {
        if (formValues.image) {
            // Upload the new profile image
            const formData = new FormData();
            formData.append('file', formValues.image);
            await doCreateIcon({
                iconCategory: 'GUIDE',
                iconCategoryId: guideId!,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                body: formData as any
            }).unwrap();
        }
        // Description
        if (data?.description !== formValues.description) {
            await doUpdate({ guideId, guideBase: formValues })
                .unwrap();
        }
        // Navigate back after success
        navigate({ to: '/guides/$guideId', replace: true });
    });

    const handleBack = useCallback(() => navigate({ to: '/guides/$guideId', replace: true }), [navigate]);

    const handleDelete = useCallback(() => {
        doDelete({ guideId }).unwrap()
            .then(() => navigate({ to: '/guides', replace: true }));
    }, [doDelete, guideId, navigate]);

    return (
        <Container paddingTop={2} paddingBottom={6}>
            <ErrorDisplay error={isError ? error : undefined} />
            <Show when={!isLoading} fallback={<Spinner size='lg' margin={8} />}>
                <form onSubmit={onSubmit}>
                    <HStack paddingBottom={2} wrap={{ base: 'wrap', md: 'nowrap' }}>
                        <HStack width='100%' >
                            <BackButton titleKey='editGuideBack' handleBack={handleBack} />
                            <Box width='full'>
                                <Heading whiteSpace={{ base: 'wrap', sm: 'nowrap' }}>
                                    {t('editGuideTitle')}
                                </Heading>
                            </Box>
                        </HStack>
                        <HStack
                            width='100%'
                            wrap={{ base: 'wrap', sm: 'nowrap' }}
                            justifyContent='flex-end'
                            justifySelf='flex-end'
                        >
                            <DeleteButton
                                handleDelete={handleDelete}
                                loading={updateIsLoading || deleteIsLoading}
                                buttonText='editGuideDelete'
                                popupText='editGuideDeleteDetails'
                            />
                            <SaveButton
                                titleKey='editGuideConfirm'
                                loading={updateIsLoading || deleteIsLoading}
                                disabled={!isDirty}
                            />
                        </HStack>
                    </HStack>
                    <Separator />
                    <Fieldset.Root invalid={updateIsError} disabled={isLoading} paddingTop={4}>
                        <Fieldset.Content gap={6}>
                            <Fieldset.ErrorText>
                                <Text marginTop={6}>
                                    {t('editGuideError')}
                                </Text>
                            </Fieldset.ErrorText>
                            <Field
                                label={<Text fontSize='md'>{t('newGuideName')}</Text>}
                                invalid={!!errors.name || isError}
                                errorText={errors.name?.message}
                            >
                                <Input
                                    {...register('name', {
                                        required: t('newGuideNameRequired'),
                                        minLength: { value: 4, message: t('newGuideNameInvalid') },
                                        maxLength: { value: 128, message: t('newGuideNameInvalid') }
                                    })}
                                    placeholder={t('newGuideNamePlaceholder')}
                                    variant='outline'
                                />
                            </Field>
                            <Field
                                label={<Text fontSize='md'>{t('newGuideSummary')}</Text>}
                                invalid={!!errors.summary || isError}
                                errorText={errors.summary?.message}
                            >
                                <Textarea
                                    {...register('summary', {
                                        maxLength: { value: 256, message: t('newGuideSummaryInvalid') }
                                    })}
                                    placeholder={t('newGuideSummaryPlaceholder')}
                                    autoresize
                                    variant='outline'
                                />
                            </Field>
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
                                label={<Text fontSize='md'>{t('newGuideDescription')}</Text>}
                                invalid={!!errors.description || isError}
                                errorText={errors.description?.message}
                            >
                                <Controller
                                    control={control}
                                    name='description'
                                    render={({ field }) => (
                                        <MarkdownInput
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder='newGuideDescriptionPlaceholder'
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