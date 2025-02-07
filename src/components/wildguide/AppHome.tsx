import { AlertContent, AlertDescription, AlertIndicator, AlertRoot, AlertTitle, Box, Heading, Separator, Text } from '@chakra-ui/react';
import { LuFileWarning } from 'react-icons/lu';
import { NavLink } from '../custom/NavLink';

export function AppHome() {
    return (
        <Box margin={8}>
            <Heading>WildGuide</Heading>
            <Text>
                Welcome to WildGuide!
            </Text>
            <Separator marginY={4} />
            <AlertRoot status='warning' variant='surface'>
                <AlertIndicator>
                    <LuFileWarning />
                </AlertIndicator>
                <AlertContent>
                    <AlertTitle>In Development</AlertTitle>
                    <AlertDescription>
                        This website is still under active development. Any data captured will be periodically deleted.
                    </AlertDescription>
                </AlertContent>
            </AlertRoot>
            <Separator marginY={4} />
            <NavLink to='/guides' color='fg.info'>
                View all guides
            </NavLink>
        </Box>
    );
}