import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { GuideBase, useCreateGuideMutation } from '@/redux/api/wildguideApi';
import { Box, Container, Fieldset, Heading, HStack, Input, Separator, Text, Textarea } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuCirclePlus } from 'react-icons/lu';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useDebounce } from 'use-debounce';

export function GuideNew() {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/create' });

    const [doCreate, { isLoading, isError }] = useCreateGuideMutation();

    const { register, handleSubmit, formState: { errors }, control, watch } = useForm<GuideBase>({
        defaultValues: {
            visibility: 'PUBLIC'
        }
    });

    const inatCriteria = watch('inaturalistCriteria');
    const [debouncedInatCriteria] = useDebounce(inatCriteria, 500);

    const visibility = watch('visibility');

    const handleBack = useCallback(() => navigate({ to: '/guides', replace: true }), [navigate]);

    const onSubmit = handleSubmit(async (data) => {
        doCreate({ guideBase: data })
            .unwrap().then(response => {
                navigate({ to: '/guides/$guideId', params: { guideId: response.id.toString() } });
            });
    });

    return (
        <Container padding={6}>
            <form onSubmit={onSubmit}>
                <Fieldset.Root invalid={isError} disabled={isLoading}>
                    <Fieldset.Legend>
                        <Heading>{t('newGuideTitle')}</Heading>
                    </Fieldset.Legend>
                    <Fieldset.HelperText marginBottom={4}>
                        <Text>{t('newGuideSubTitle')}</Text>
                    </Fieldset.HelperText>
                    <Separator />
                    <Fieldset.Content gap={8} >
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
                            label={<Text fontSize='md'>{t('newGuideVisibility')}</Text>}
                            invalid={!!errors.visibility || isError}
                            errorText={errors.visibility?.message}
                            helperText={t(`newGuideVisibilityHelp${visibility}`)}
                        >
                            <Controller
                                name='visibility'
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={({ value }) => field.onChange(value)}
                                        variant='subtle'
                                    >
                                        <HStack gap={8}>
                                            <Radio value='PUBLIC'>
                                                {t('newGuideVisibilityPUBLIC')}
                                            </Radio>
                                            <Radio value='PRIVATE'>
                                                {t('newGuideVisibilityPRIVATE')}
                                            </Radio>
                                        </HStack>
                                    </RadioGroup>
                                )}
                            />
                        </Field>
                        <Field
                            label={<Text fontSize='md'>{t('newGuideInaturalistCriteria')}</Text>}
                            invalid={!!errors.inaturalistCriteria || isError}
                            errorText={errors.inaturalistCriteria?.message}
                        >
                            <Input
                                {...register('inaturalistCriteria')}
                                placeContent={t('newGuideInaturalistCriteriaPlaceholder')}
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
                            label={<Text fontSize='md'>{t('newGuideDescription')}</Text>}
                            invalid={!!errors.description || isError}
                            errorText={errors.description?.message}
                        >
                            <Textarea
                                {...register('description')}
                                placeholder={t('newGuideDescriptionPlaceholder')}
                                autoresize
                                variant='outline'
                            />
                        </Field>
                        <Box marginTop={6}>
                            <Fieldset.ErrorText>
                                <Text>{t('newGuideError')}</Text>
                            </Fieldset.ErrorText>
                            <Button type='submit' width='full' loading={isLoading} size='lg'>
                                <LuCirclePlus />
                                <Text>{t('newGuideConfirm')}</Text>
                            </Button>
                            <Button variant='plain' width='full' marginTop={6} onClick={handleBack} color='fg.muted'>
                                <MdKeyboardBackspace />
                                <Text>{t('newGuideBack')}</Text>
                            </Button>
                        </Box>
                    </Fieldset.Content>
                </Fieldset.Root>
            </form>
        </Container>
    );
}