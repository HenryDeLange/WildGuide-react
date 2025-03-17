import { BackButton } from '@/components/custom/BackButton';
import { SaveButton } from '@/components/custom/SaveButton';
import { MarkdownInput } from '@/components/markdown/MarkdownInput';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { EntryBase, useDeleteEntryMutation, useFindEntryQuery, useUpdateEntryMutation } from '@/redux/api/wildguideApi';
import { Box, Container, Fieldset, Heading, HStack, Input, Separator, Show, Spinner, Stack, Text, Textarea } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DeleteButton } from '../../custom/DeleteButton';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { Field } from '../../ui/field';

type Props = {
    guideId: number;
    entryId: number;
}

export function EntryEdit({ guideId, entryId }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/$guideId/entries/$entryId/edit' });

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useFindEntryQuery({ guideId, entryId });

    const [
        doUpdate, {
            isLoading: updateIsLoading,
            isError: updateIsError,
            // error: updateError
        }
    ] = useUpdateEntryMutation();

    const [
        doDelete, {
            isLoading: deleteIsLoading,
            // isError: deleteIsError,
            // error: deleteError
        }
    ] = useDeleteEntryMutation();

    const { register, handleSubmit, formState: { errors }, reset, watch, control } = useForm<EntryBase>();
    useEffect(() => {
        if (isSuccess) {
            reset(data);
        }
    }, [data, isSuccess, reset]);

    const onSubmit = handleSubmit(async (data) => {
        doUpdate({ guideId, entryId, entryBase: data })
            .unwrap().then(() => {
                navigate({ to: '/guides/$guideId/entries/$entryId', replace: true });
            });
    });

    const handleBack = useCallback(() => navigate({ to: '/guides/$guideId/entries/$entryId', replace: true }), [navigate]);

    const handleDelete = useCallback(() => {
        doDelete({ guideId, entryId }).unwrap()
            .then(() => navigate({ to: '/guides/$guideId', params: { guideId: guideId.toString() }, replace: true }));
    }, [doDelete, entryId, guideId, navigate]);

    return (
        <Container paddingTop={2} paddingBottom={6}>
            <ErrorDisplay error={isError ? error : undefined} />
            <Show when={!isLoading} fallback={<Spinner size='lg' margin={8} />}>
                <form onSubmit={onSubmit}>
                    <HStack paddingBottom={2} wrap={{ base: 'wrap', md: 'nowrap' }}>
                        <HStack width='100%' >
                            <BackButton titleKey='editEntryBack' handleBack={handleBack} />
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
                                buttonText='editEntryDelete'
                                popupText='editEntryDeleteDetails'
                            />
                            <SaveButton titleKey='editEntryConfirm' loading={updateIsLoading || deleteIsLoading} />
                        </HStack>
                    </HStack>
                    <Separator />
                    <Fieldset.Root invalid={updateIsError} disabled={isLoading} paddingTop={4}>
                        <Fieldset.Content gap={6}>
                            <Fieldset.ErrorText>
                                <Text marginTop={6}>
                                    {t('editEntryError')}
                                </Text>
                            </Fieldset.ErrorText>
                            <Field
                                label={<Text fontSize='md'>{t('newEntryName')}</Text>}
                                invalid={!!errors.name || isError}
                                errorText={errors.name?.message}
                            >
                                <Input
                                    {...register('name', {
                                        required: t('newEntryNameRequired'),
                                        minLength: { value: 1, message: t('newEntryNameInvalid') },
                                        maxLength: { value: 128, message: t('newEntryNameInvalid') }
                                    })}
                                    placeholder={t('newEntryNamePlaceholder')}
                                    variant='outline'
                                />
                            </Field>
                            <Stack direction={{ base: 'column', sm: 'row' }}>
                                <Field
                                    label={<Text fontSize='md'>{t('newEntryScientificName')}</Text>}
                                    invalid={!!errors.name || isError}
                                    errorText={errors.name?.message}
                                >
                                    <Input
                                        {...register('scientificName', {
                                            required: t('newEntryScientificNameRequired'),
                                            minLength: { value: 3, message: t('newEntryScientificInvalid') },
                                            maxLength: { value: 256, message: t('newEntryScientificInvalid') }
                                        })}
                                        placeholder={t('newEntryScientificNamePlaceholder')}
                                        variant='outline'
                                    />
                                </Field>
                                <Controller
                                    control={control}
                                    name='scientificRank'
                                    rules={{
                                        required: t('newEntryScientificRankRequired')
                                    }}
                                    render={({ field }) => (
                                        <Field
                                            label={<Text fontSize='md'>{t('newEntryScientificRank')}</Text>}
                                            invalid={!!errors.scientificRank || isError}
                                            errorText={errors.scientificRank?.message}
                                        >
                                            <SegmentedControl
                                                onBlur={field.onBlur}
                                                name={field.name}
                                                value={field.value}
                                                items={[
                                                    { label: t('entryScientificRankFAMILY'), value: 'FAMILY' },
                                                    { label: t('entryScientificRankGENUS'), value: 'GENUS' },
                                                    { label: t('entryScientificRankSPECIES'), value: 'SPECIES' },
                                                    { label: t('entryScientificRankSUBSPECIES'), value: 'SUBSPECIES' }
                                                ]}
                                                onValueChange={({ value }) => field.onChange(value)}
                                            />
                                        </Field>
                                    )}
                                />
                            </Stack>
                            <Field
                                label={<Text fontSize='md'>{t('newEntrySummary')}</Text>}
                                invalid={!!errors.summary || isError}
                                errorText={errors.summary?.message}
                            >
                                <Textarea
                                    {...register('summary')}
                                    placeholder={t('newEntrySummaryPlaceholder')}
                                    autoresize
                                    variant='outline'
                                />
                            </Field>
                            <Field
                                label={<Text fontSize='md'>{t('newEntryDescription')}</Text>}
                                invalid={!!errors.description || isError}
                                errorText={errors.description?.message}
                            >
                                <MarkdownInput
                                    register={register('description')}
                                    watch={watch}
                                    placeholder='newEntryDescriptionPlaceholder'
                                />
                            </Field>
                        </Fieldset.Content>
                    </Fieldset.Root>
                </form>
            </Show>
        </Container>
    );
}
