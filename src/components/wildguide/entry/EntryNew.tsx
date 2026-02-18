import { BackButton } from '@/components/custom/BackButton';
import { SaveButton } from '@/components/custom/SaveButton';
import { MarkdownInput } from '@/components/markdown/MarkdownInput';
import { EntryBase, useCreateEntryMutation } from '@/redux/api/wildguideApi';
import { Box, Container, Fieldset, Heading, HStack, Input, Separator, Stack, Text, Textarea } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Field } from '../../ui/field';
import { SegmentedControl } from '../../ui/segmented-control';

type Props = {
    guideId: number;
}

export function EntryNew({ guideId }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/$guideId/entries/create' });

    const [
        doCreate, {
            isLoading,
            isError
        }
    ] = useCreateEntryMutation();

    const { register, handleSubmit, formState: { errors, isDirty }, control } = useForm<EntryBase>({
        defaultValues: {
            scientificRank: 'SPECIES'
        }
    });

    const onSubmit = handleSubmit(async (data) => {
        doCreate({ guideId, entryBase: data })
            .unwrap().then(() => {
                navigate({ to: '/guides/$guideId', hash: 'entries' });
            });
    });

    const handleBack = useCallback(() => navigate({ to: '/guides/$guideId', hash: 'entries', replace: true }), [navigate]);

    return (
        <Container paddingTop={2} paddingBottom={6}>
            <form onSubmit={onSubmit}>
                <HStack paddingBottom={2} wrap={{ base: 'wrap', sm: 'nowrap' }}>
                    <HStack>
                        <BackButton titleKey='newEntryBack' handleBack={handleBack} />
                        <Box width='full'>
                            <Heading>
                                {t('newEntryTitle')}
                            </Heading>
                            <Text fontSize='sm' color='fg.muted'>
                                {t('newEntrySubTitle')}
                            </Text>
                        </Box>
                    </HStack>
                    <Box flex='1' display='flex' justifyContent='flex-end' alignSelf='flex-end'>
                        <SaveButton
                            titleKey='newEntryConfirm'
                            loading={isLoading}
                            disabled={!isDirty}
                        />
                    </Box>
                </HStack>
                <Separator />
                <Fieldset.Root invalid={isError} disabled={isLoading}>
                    <Fieldset.Legend>
                        <Heading>{t('newEntryTitle')}</Heading>
                    </Fieldset.Legend>
                    <Fieldset.HelperText marginBottom={4}>
                        <Text>{t('newEntrySubTitle')}</Text>
                    </Fieldset.HelperText>
                    <Separator />
                    <Fieldset.Content gap={6}>
                        <Fieldset.ErrorText>
                            <Text marginTop={6}>
                                {t('newEntryError')}
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
                                {...register('summary', {
                                    maxLength: { value: 256, message: t('newEntrySummaryInvalid') }
                                })}
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
                            <Controller
                                control={control}
                                name='description'
                                render={({ field }) => (
                                    <MarkdownInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder='newEntryDescriptionPlaceholder'
                                    />
                                )}
                            />
                        </Field>
                    </Fieldset.Content>
                </Fieldset.Root>
            </form>
        </Container >
    );
}
