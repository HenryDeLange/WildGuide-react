import { PwaContext } from '@/pwa/PwaProvider';
import { useFindStarredGuidesQuery } from '@/redux/api/wildguideApi';
import { AlertContent, AlertDescription, AlertIndicator, AlertRoot, AlertTitle, Box, Button, Container, Heading, HStack, Image, Separator, Show, Skeleton, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LuFileWarning } from 'react-icons/lu';
import { MdInstallDesktop } from 'react-icons/md';
import homeImage from '../../assets/images/wildguide/home.jpg';
import installImage from '../../assets/images/wildguide/install.jpg';
import { NavLink } from '../custom/NavLink';
import { Tag } from '../ui/tag';
import { useHeights } from './hooks/uiHooks';

export function AppHome() {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/' });

    const { content } = useHeights();

    const { showPwaInstallButton, handleInstallClick } = useContext(PwaContext);

    const {
        data,
        isFetching
    } = useFindStarredGuidesQuery();

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
                <Separator marginY={4} />
                <Show when={!isFetching} fallback={<Skeleton boxSize='2em' />}>
                    {data && data.length > 0 &&
                        <HStack wrap='wrap' marginY={4}>
                            {data.map(starredGuide => (
                                <Tag
                                    key={starredGuide.id}
                                    size='lg'
                                    cursor='pointer'
                                    onClick={() => navigate({ to: '/guides/$guideId', params: { guideId: starredGuide.id.toString() } })}
                                >
                                    {starredGuide.name}
                                </Tag>
                            ))}
                        </HStack>
                    }
                </Show>
                <NavLink to='/guides' color='fg.info'>
                    {t('homeLinkGuides')}
                </NavLink>
                <Separator marginY={4} />
            </Box>
            {showPwaInstallButton &&
                <>
                    <HStack gap={4}>
                        <Image
                            src={installImage}
                            width={70}
                            borderRadius='full'
                        />
                        <VStack>
                            <Text fontSize='xs' color='fg.muted'>
                                {t('pwaInstallDetails')}
                            </Text>
                            <Button variant='surface' onClick={handleInstallClick}>
                                <MdInstallDesktop />
                                {t('pwaInstall')}
                            </Button>
                        </VStack>
                    </HStack>
                    <Separator marginY={4} />
                </>
            }
            <Image
                src={homeImage}
                width={{ base: '90%', sm: '70%', md: '55%', lg: '50%', xl: '40%' }}
                fit='cover'
                marginX='auto'
                paddingBottom={12}
            />
        </Container>
    );
}
