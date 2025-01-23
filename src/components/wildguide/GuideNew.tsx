import { GuideBase, useCreateGuideMutation } from '@/redux/api/wildguideApi';
import { Box, Container, Fieldset, Heading, HStack, Input, Separator, Text, Textarea } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuCirclePlus } from 'react-icons/lu';
import { useDebounce } from 'use-debounce';
import { Button } from '../ui/button';
import { Field } from '../ui/field';
import { Radio, RadioGroup } from '../ui/radio';

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
                        </Box>
                    </Fieldset.Content>
                </Fieldset.Root>
            </form>
        </Container>
    );
}