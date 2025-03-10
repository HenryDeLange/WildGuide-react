import { MarkdownInput } from '@/components/markdown/MarkdownInput';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { RadioCardItem, RadioCardRoot } from '@/components/ui/radio-card';
import { GuideBase, useCreateGuideMutation } from '@/redux/api/wildguideApi';
import { Box, Container, Fieldset, Heading, HStack, Input, Separator, Text, Textarea } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuCirclePlus } from 'react-icons/lu';
import { MdKeyboardBackspace } from 'react-icons/md';

export function GuideNew() {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/guides/create' });

    const [doCreate, { isLoading, isError }] = useCreateGuideMutation();

    const { register, handleSubmit, formState: { errors }, control, watch } = useForm<GuideBase>({
        defaultValues: {
            visibility: 'PUBLIC'
        }
    });

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
                    <Fieldset.Content gap={8}>
                        <Field
                            label={<Text fontSize='md'>{t('newGuideVisibility')}</Text>}
                            invalid={!!errors.visibility || isError}
                            errorText={errors.visibility?.message}
                        >
                            <Controller
                                name='visibility'
                                control={control}
                                render={({ field }) => (
                                    <RadioCardRoot
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={({ value }) => field.onChange(value)}
                                    >
                                        <HStack align='stretch' >
                                            <RadioCardItem
                                                label={t('newGuideVisibilityPUBLIC')}
                                                description={t('newGuideVisibilityHelpPUBLIC')}
                                                value='PUBLIC'
                                            />
                                            <RadioCardItem
                                                label={t('newGuideVisibilityPRIVATE')}
                                                description={t('newGuideVisibilityHelpPRIVATE')}
                                                value='PRIVATE'
                                            />
                                        </HStack>
                                    </RadioCardRoot>
                                )}
                            />
                        </Field>
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
                            label={<Text fontSize='md'>{t('newGuideDescription')}</Text>}
                            invalid={!!errors.description || isError}
                            errorText={errors.description?.message}
                        >
                            <MarkdownInput
                                register={register('description')}
                                watch={watch}
                                placeholder='newGuideDescriptionPlaceholder'
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
