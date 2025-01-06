import { useGetVersionQuery } from '@/redux/api/wildguideApi';
import { Box, Heading, Show, Spinner, Text } from '@chakra-ui/react';

export function AppAbout() {
    const { data, isLoading } = useGetVersionQuery();
    return (
        <Box>
            <Heading>About WildGuide</Heading>
            <Text>
                FE: {import.meta.env.VITE_COMMIT_DATE}
            </Text>
            <Show when={!isLoading} fallback={<Spinner size='md' />}>
                <Text>
                    BE: {data?.commitTime}
                </Text>
            </Show>
        </Box>
    );
}