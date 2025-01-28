import { Button } from '@/components/ui/button';
import { EntryBase, useCreateEntryMutation, useFindGuideQuery } from '@/redux/api/wildguideApi';
import { Box, Container, Fieldset, Heading, Input, Separator, Show, Spinner, Text, Textarea } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuCirclePlus } from 'react-icons/lu';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useDebounce } from 'use-debounce';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { Field } from '../../ui/field';
import { SegmentedControl } from '../../ui/segmented-control';

type Props = {
    guideId: number;
}

export function EntryNew({ guideId }: Readonly<Props>) {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/$guideId/entries/create' });

    const {
        data: guide,
        isLoading: guideIsLoading,
        isError: guideIsError,
        error: guideError
    } = useFindGuideQuery({ guideId });

    const [doCreate, { isLoading, isError }] = useCreateEntryMutation();

    const { register, handleSubmit, formState: { errors }, control, watch } = useForm<EntryBase>({
        defaultValues: {
            scientificRank: 'SPECIES'
        }
    });

    const inatTaxon = watch('inaturalistTaxon');
    const [debouncedInatTaxon] = useDebounce(inatTaxon, 500);

    const onSubmit = handleSubmit(async (data) => {
        doCreate({ guideId, entryBase: data })
            .unwrap().then(() => {
                navigate({ to: '/guides/$guideId' });
            });
    });

    const handleBack = useCallback(() => navigate({ to: '/guides/$guideId', replace: true }), [navigate]);

    return (
        <Box display='flex' justifyContent='center'>
            <ErrorDisplay error={guideIsError ? guideError : undefined} />
            <Show when={!guideIsLoading} fallback={<Spinner size='lg' margin={8} />}>
                {guide &&
                    <Container padding={6}>
                        <form onSubmit={onSubmit}>
                            <Fieldset.Root invalid={isError} disabled={isLoading}>
                                <Fieldset.Legend>
                                    <Heading>{t('newEntryTitle')}</Heading>
                                </Fieldset.Legend>
                                <Fieldset.HelperText marginBottom={4}>
                                    <Text>{t('newEntrySubTitle', { guide: guide.name })}</Text>
                                </Fieldset.HelperText>
                                <Separator />
                                <Fieldset.Content gap={8} >
                                    <Field
                                        label={<Text fontSize='md'>{t('newEntryName')}</Text>}
                                        invalid={!!errors.name || isError}
                                        errorText={errors.name?.message}
                                        helperText={t('newEntryNameHelper')}
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
                                    <Field
                                        label={<Text fontSize='md'>{t('newEntryInaturalistTaxon')}</Text>}
                                        invalid={!!errors.inaturalistTaxon || isError}
                                        errorText={errors.inaturalistTaxon?.message}
                                    >
                                        <Input
                                            {...register('inaturalistTaxon')}
                                            placeContent={t('newEntryInaturalistTaxonPlaceholder')}
                                            variant='outline'
                                        />
                                    </Field>
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
                                        <Textarea
                                            {...register('description')}
                                            placeholder={t('newEntryDescriptionPlaceholder')}
                                            autoresize
                                            variant='outline'
                                        />
                                    </Field>
                                    <Box marginTop={6}>
                                        <Fieldset.ErrorText>
                                            <Text>{t('newEntryError')}</Text>
                                        </Fieldset.ErrorText>
                                        <Button type='submit' width='full' loading={isLoading} size='lg'>
                                            <LuCirclePlus />
                                            <Text>{t('newEntryConfirm')}</Text>
                                        </Button>
                                        <Button variant='plain' width='full' marginTop={6} onClick={handleBack} color='fg.muted'>
                                            <MdKeyboardBackspace />
                                            <Text>{t('editGuideBack')}</Text>
                                        </Button>
                                    </Box>
                                </Fieldset.Content>
                            </Fieldset.Root>
                        </form>
                    </Container >
                }
            </Show>
        </Box>
    );
}