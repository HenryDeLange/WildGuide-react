import { useFindFilesQuery } from '@/redux/api/wildguideApi';
import { Box, Heading, HStack, Link, Separator, Show, SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '../custom/ErrorDisplay';
import { Tooltip } from '../ui/tooltip';
import { getServerFileUrl } from '../utils';

type Props = {
    guideId: number;
}

export function FileList({ guideId }: Readonly<Props>) {
    const { t } = useTranslation();

    const {
        data,
        isLoading,
        isSuccess,
        error
    } = useFindFilesQuery({ fileCategory: 'GUIDE', fileCategoryId: guideId.toString() });

    return (
        <>
            {(isLoading || (isSuccess && data.length > 0)) &&
                <Box
                    padding={2}
                    borderWidth={1}
                    borderRadius='sm'
                    boxShadow='sm'
                    borderColor='border'
                    position='relative'
                >
                    <ErrorDisplay error={error} />
                    <Heading size='lg'>
                        {t('editGuideFiles')}
                    </Heading>
                    <Separator />
                    <Show when={!isLoading} fallback={<Spinner size='lg' margin={8} />}>
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} gap={2}>
                            {data?.map(file => {
                                const filename = file.split('/').pop();
                                return (
                                    <HStack key={file}>
                                        <Tooltip content={filename} openDelay={1500} closeDelay={150}>
                                            <Link key={file} href={getServerFileUrl(file)} overflow='hidden' whiteSpace='nowrap'>
                                                <Text>{filename}</Text>
                                            </Link>
                                        </Tooltip>
                                    </HStack>
                                );
                            })}
                        </SimpleGrid>
                    </Show>
                </Box>
            }
        </>
    );
}
