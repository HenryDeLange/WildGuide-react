import { GuideBase, useFindGuideQuery, useUpdateGuideMutation } from '@/redux/api/wildguideApi';
import { Box, Container, Fieldset, HStack, Input, Show, Spinner, Text, Textarea } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdEdit, MdKeyboardBackspace } from 'react-icons/md';
import { useDebounce } from 'use-debounce';
import { Button } from '../ui/button';
import { Field } from '../ui/field';
import { Radio, RadioGroup } from '../ui/radio';
import { ErrorDisplay } from './ErrorDisplay';

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
            error: updateError
        }
    ] = useUpdateGuideMutation();

    const { register, handleSubmit, formState: { errors }, control, watch, reset } = useForm<GuideBase>();
    useEffect(() => {
        if (isSuccess) {
            reset(data);
        }
    }, [data, isSuccess, reset]);

    const inatCriteria = watch('inaturalistCriteria');
    const [debouncedInatCriteria] = useDebounce(inatCriteria, 500);

    const visibility = watch('visibility');

    const onSubmit = handleSubmit(async (data) => {
        doUpdate({ guideId, guideBase: data })
            .unwrap().then(() => {
                navigate({ to: '/guides/$guideId', replace: true });
            });
    });

    const handleBack = useCallback(() => navigate({ to: '/guides/$guideId', replace: true }), [navigate]);

    return (
        <Container padding={6}>
            <ErrorDisplay error={isError ? error : undefined} />
            <Show when={!isLoading} fallback={<Spinner size='lg' margin={8} />}>
                <form onSubmit={onSubmit}>
                    <Fieldset.Root invalid={updateIsError} disabled={isLoading}>
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
                                    <Text>{t('editGuideError')}</Text>
                                </Fieldset.ErrorText>
                                <Button type='submit' width='full' loading={updateIsLoading} size='lg'>
                                    <MdEdit />
                                    <Text>{t('editGuideConfirm')}</Text>
                                </Button>
                                <Button variant='plain' width='full' marginTop={6} onClick={handleBack} color='fg.muted'>
                                    <MdKeyboardBackspace />
                                    <Text>{t('editGuideBack')}</Text>
                                </Button>
                            </Box>
                        </Fieldset.Content>
                    </Fieldset.Root>
                </form>
            </Show>
        </Container>
    );
}