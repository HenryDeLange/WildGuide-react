import { Link as ChakraLink, LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from '@tanstack/react-router';
import { FC } from 'react';

type Props = ChakraLinkProps & RouterLinkProps;

export const NavLink: FC<Props> = ({ children, ...props }) => {
    return (
        <ChakraLink
            as={RouterLink}
            {...props}
            focusRing='none'
            _focus={{
                textDecoration: 'underline'
            }}
        >
            {children}
        </ChakraLink>
    );
};
