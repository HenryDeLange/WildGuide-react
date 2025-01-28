import { Guide } from '@/redux/api/wildguideApi';
import { Heading, Text, VStack } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { memo } from 'react';

export const GuideListItem = memo(function GuideListItem({ item }: Readonly<{ item: Guide }>) {
    return (
        <Link to='/guides/$guideId' params={{ guideId: item.id.toString() }} >
            <VStack
                _hover={{
                    backgroundColor: 'gray.100',
                    transform: 'scale(1.05)',
                    transition: 'all 0.2s ease-in-out'
                }}
                borderWidth='1px'
                borderRadius='lg'
                height='100%'
            >
                <Heading>{item.name}</Heading>
                <Text>{item.visibility}</Text>
                <Text>{item.summary ?? ''}</Text>
            </VStack>
        </Link>
    );
});
