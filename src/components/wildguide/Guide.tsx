import { useFindGuideQuery } from '@/redux/api/wildguideApi';
import { Box, Heading, Show, Spinner, Text } from '@chakra-ui/react';
import { ErrorDisplay } from './ErrorDisplay';

type Props = {
    guideId: number;
}

export function Guide({ guideId }: Readonly<Props>) {
    const { data, isLoading, isError, error } = useFindGuideQuery({ guideId });
    return (
        <Box display='flex' justifyContent='center'>
            <ErrorDisplay error={isError ? error : undefined} />
            <Show when={!isLoading} fallback={<Spinner size='md' margin={8} />}>
                {data &&
                    <Box width='100%' paddingX={6} paddingY={6}>
                        <Heading>
                            {data.name}
                        </Heading>
                        <Show when={data.description}>
                            <Text>
                                {data.description}
                            </Text>
                        </Show>
                        <Show when={data.inaturalistCriteria}>
                            <Text>
                                {data.inaturalistCriteria}
                            </Text>
                        </Show>
                    </Box>
                }
            </Show>
        </Box>
    );
}
