import { GuideBase, useCreateGuideMutation } from '@/redux/api/wildguideApi';
import { Container, Fieldset, Heading, HStack, Input, Text, Textarea } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuCirclePlus } from 'react-icons/lu';
import { useDebounce } from 'use-debounce';
import { Button } from '../ui/button';
import { Field } from '../ui/field';
import { Radio, RadioGroup } from '../ui/radio';

export function NewGuide() {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/new-guide' });

    const [doCreateGuide, { isLoading, isError }] = useCreateGuideMutation();

    const { register, handleSubmit, formState: { errors }, control, watch } = useForm<GuideBase>({
        defaultValues: {
            visibility: 'PUBLIC'
        }
    });

    const inatCriteria = watch('inaturalistCriteria');
    const [debouncedInatCriteria] = useDebounce(inatCriteria, 500);

    const visibility = watch('visibility');

    const onSubmit = handleSubmit(async (data) => {
        doCreateGuide({ guideBase: data })
            .unwrap().then(() => {
                navigate({ to: '/' });
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
                    <Fieldset.Content gap={8} borderWidth={1} padding={8} borderRadius={8} boxShadow='md'>
                        <Field
                            label={t('newGuideName')}
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
                                variant='flushed'
                            />
                        </Field>
                        <Field
                            label={t('newGuideDescription')}
                            invalid={!!errors.description || isError}
                            errorText={errors.description?.message}
                        >
                            <Textarea
                                {...register('description')}
                                placeholder={t('newGuideDescriptionPlaceholder')}
                                autoresize
                                variant='flushed'
                            />
                        </Field>
                        <Field
                            label={t('newGuideVisibility')}
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
                            label={t('newGuideInaturalistCriteria')}
                            invalid={!!errors.inaturalistCriteria || isError}
                            errorText={errors.inaturalistCriteria?.message}
                        >
                            <Input
                                {...register('inaturalistCriteria')}
                                placeContent={t('newGuideInaturalistCriteriaPlaceholder')}
                                variant='flushed'
                            />
                        </Field>
                    </Fieldset.Content>
                    <Fieldset.ErrorText>
                        <Text>{t('loginFormError')}</Text>
                    </Fieldset.ErrorText>
                    <Button type='submit' width='full' loading={isLoading} marginTop={12}>
                        <LuCirclePlus />
                        Create Guide
                    </Button>
                </Fieldset.Root>
            </form>
        </Container>
    );
}