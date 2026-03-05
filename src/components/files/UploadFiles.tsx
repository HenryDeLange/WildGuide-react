import { useCreateFileMutation, useDeleteFileMutation, useFindFilesQuery } from '@/redux/api/wildguideApi';
import { Box, DialogRootProvider, Fieldset, FileUpload, Heading, HStack, IconButton, ScrollArea, Separator, Show, Spinner, Text, useDialog } from '@chakra-ui/react';
import { FileImage, Files, Trash } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '../custom/ErrorDisplay';
import { Button } from '../ui/button';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Field } from '../ui/field';
import { Tooltip } from '../ui/tooltip';
import { getServerFileUrl } from '../utils';
import { useShowButtonLabels } from '../wildguide/hooks/uiHooks';

type Props = {
    guideId: number;
}

export function UploadFiles({ guideId }: Readonly<Props>) {
    const { t } = useTranslation();

    const showLabels = useShowButtonLabels();

    const dialog = useDialog();

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useFindFilesQuery({ fileCategory: 'GUIDE', fileCategoryId: guideId.toString() });

    const [
        doCreateFile, {
            isLoading: createFileIsLoading,
            isSuccess: createFileIsSuccess,
            isError: createFileIsError,
            error: createFileError
        }
    ] = useCreateFileMutation();

    const [
        doDeleteFile, {
            isLoading: deleteFileIsLoading,
            isError: deleteFileIsError,
            error: deleteFileError
        }
    ] = useDeleteFileMutation();

    const { register, handleSubmit, formState: { errors, isDirty }, control, reset } = useForm<{ image?: File; }>();
    useEffect(() => {
        if (isSuccess) {
            reset({
                ...data,
                image: undefined
            });
        }
    }, [data, isSuccess, reset]);

    const handleCreate = useCallback((file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        doCreateFile({
            fileCategory: 'GUIDE',
            fileCategoryId: guideId.toString(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            body: formData as any
        });
    }, [doCreateFile, guideId]);

    const handleDelete = useCallback((fileId: number) => () => {

    }, []);

    return (
        <Show
            when={!isLoading}
            fallback={<Spinner size='sm' alignSelf='center' marginX={showLabels ? 6 : undefined} />}
        >
            <DialogRootProvider value={dialog} placement='center' lazyMount={true} size='lg'>
                <DialogTrigger asChild>
                    <Button
                        size='md'
                        variant='ghost'
                        color='fg.info'
                        whiteSpace='nowrap'
                        padding={showLabels ? undefined : 0}
                    >
                        <Files />
                        {showLabels &&
                            <Text>
                                {t('editGuideFiles')}
                            </Text>
                        }
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader marginTop={-4} marginLeft={-2}>
                        <DialogTitle>
                            {t('editGuideFilesTitle')}
                        </DialogTitle>
                    </DialogHeader>
                    <DialogCloseTrigger />
                    <DialogBody padding={4} marginTop={-4}>
                        <ErrorDisplay error={isError ? error : createFileIsError ? createFileError : deleteFileIsError ? deleteFileError : undefined} />
                        <Fieldset.Root disabled={isLoading}>
                            <Fieldset.Content gap={6}>
                                <Field
                                    label={<Text fontSize='md'>{t('editGuideFile')}</Text>}
                                    invalid={!!errors.image || createFileIsError}
                                    errorText={errors.image?.message}
                                    helperText={createFileIsSuccess ? t('editGuideFileUploaded') : undefined}
                                >
                                    <FileUpload.Root
                                        accept='image/*'
                                        onFileChange={(details) => {
                                            handleCreate(details.acceptedFiles?.[0] ?? undefined);
                                        }}
                                    >
                                        <FileUpload.HiddenInput />
                                        <FileUpload.Trigger asChild>
                                            <Button variant='outline' size='sm' loading={createFileIsLoading} loadingText={t('editGuideFileUploading')}>
                                                <FileImage />
                                                {t('editGuideFileUpload')}
                                            </Button>
                                        </FileUpload.Trigger>
                                    </FileUpload.Root>
                                </Field>
                                <Separator variant='dashed' marginBottom={-2} size='lg' />
                                <Box>
                                    <Heading size='md' marginBottom={1}>
                                        {t('editGuideExistingFiles')}
                                    </Heading>
                                    <ScrollArea.Root maxHeight='20rem' variant='always'>
                                        <ScrollArea.Viewport>
                                            <ScrollArea.Content spaceY={1}>
                                                {data?.map(file => (
                                                    <HStack key={file}>
                                                        <Tooltip content={t('editGuideFileDelete')} openDelay={2000} closeDelay={150}>
                                                            <IconButton
                                                                aria-label={t('editGuideFileDelete')}
                                                                size='sm'
                                                                variant='ghost'
                                                                _hover={{ color: 'fg.error' }}
                                                            >
                                                                <Trash />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <a href={getServerFileUrl(file)}>
                                                            <Text>{file.split('/').pop()}</Text>
                                                        </a>
                                                    </HStack>
                                                ))}
                                            </ScrollArea.Content>
                                        </ScrollArea.Viewport>
                                        <ScrollArea.Scrollbar />
                                    </ScrollArea.Root>
                                </Box>
                            </Fieldset.Content>
                        </Fieldset.Root>
                    </DialogBody>
                </DialogContent>
            </DialogRootProvider>
        </Show>
    );
}
