import { useFindGuideQuery } from '@/redux/api/wildguideApi';
import { Box, Heading, Show, Spinner, Text } from '@chakra-ui/react';

type Props = {
    guideId: number;
}

export function Guide({ guideId }: Readonly<Props>) {
    console.log('Guide ID:', guideId)
    const { data, isLoading } = useFindGuideQuery({ guideId });
    return (
        <Box>
            <Text>Guide</Text>
            <Show when={!isLoading} fallback={<Spinner />}>
                {data &&
                    <Box>
                        <Heading>{data.name}</Heading>
                        <Text>{data.description ?? ''}</Text>
                    </Box>
                }
            </Show>
        </Box>
    );
}
