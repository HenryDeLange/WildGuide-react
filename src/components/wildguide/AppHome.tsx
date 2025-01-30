import { Box, Heading, Separator, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import { NavLink } from '../custom/NavLink';

export function AppHome() {
    return (
        <Box margin={12}>
            <Heading>WildGuide</Heading>
            <Text>
                Welcome to WildGuide!
            </Text>
            <Separator marginY={4} />
            <NavLink to='/guides'>
                {t('guides')}
            </NavLink>
        </Box>
    );
}