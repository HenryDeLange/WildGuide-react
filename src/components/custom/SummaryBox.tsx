import { Box, Text } from '@chakra-ui/react';

type Props = {
    summary?: string;
}

export function SummaryBox({ summary }: Readonly<Props>) {
    if (!summary)
        return null;
    return (
        <Box
            paddingX={4}
            paddingY={2}
            borderWidth={1}
            borderRadius='sm'
            boxShadow='sm'
            borderColor='border'
        >
            <Text fontSize='lg'>
                {summary}
            </Text>
        </Box>
    );
}
