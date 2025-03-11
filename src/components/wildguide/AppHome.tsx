import { AlertContent, AlertDescription, AlertIndicator, AlertRoot, AlertTitle, Box, Container, Heading, Image, Separator, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuFileWarning } from 'react-icons/lu';
import homeImage from '../../assets/images/wildguide/home.jpg';
import { NavLink } from '../custom/NavLink';
import { useHeights } from './hooks/uiHooks';

export function AppHome() {
    const { t } = useTranslation();
    const { content, grid } = useHeights();
    return (
        <Container height={content} marginTop={2}>
            <Box id='page-header'>
                <AlertRoot status='warning' variant='surface' marginY={4}>
                    <AlertIndicator>
                        <LuFileWarning />
                    </AlertIndicator>
                    <AlertContent>
                        <AlertTitle fontSize='md' fontWeight='bold'>
                            In Development
                        </AlertTitle>
                        <AlertDescription>
                            This website is still under active development. Any data captured will be periodically deleted.
                        </AlertDescription>
                    </AlertContent>
                </AlertRoot>
                <Heading fontSize='lg' fontWeight='semibold'>
                    {t('homeWelcome')}
                </Heading>
                <Text fontSize='md'>
                    {t('homeMessage')}
                </Text>
                <NavLink to='/guides' color='fg.info'>
                    {t('homeLinkGuides')}
                </NavLink>
                <Separator marginY={4} />
            </Box>
            <Image
                src={homeImage}
                minHeight={200}
                height={grid - 50}
                marginX='auto'
            />
        </Container>
    );
}
