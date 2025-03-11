import myWildLogo from '@/assets/images/mywild/mywild-logo.svg';
import { useGetVersionQuery } from '@/redux/api/wildguideApi';
import { Box, Container, Heading, HStack, Image, Separator, Spinner, StatLabel, StatRoot, StatValueText, StatValueUnit, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import aboutImage from '../../assets/images/wildguide/about.jpg';
import { useHeights } from './hooks/uiHooks';

export function AppAbout() {
    const { t } = useTranslation();

    const { content } = useHeights();

    const {
        data,
        isFetching
    } = useGetVersionQuery();

    return (
        <Container height={content} marginTop={2}>
            <Box paddingBottom={4}>
                <Heading>
                    {t('aboutTitle')}
                </Heading>
                <Text>
                    {t('aboutDetails')}
                </Text>
            </Box>
            <Separator />
            <HStack gap={12} margin={6} justifyContent='center' flexWrap='wrap'>
                <Box>
                    <StatRoot>
                        <StatLabel>
                            <Heading>{t('aboutWebsite')}</Heading>
                        </StatLabel>
                        <StatValueText alignItems='baseline'>
                            <StatValueUnit>{t('aboutVersion')}</StatValueUnit>
                            <Text fontSize='md'>
                                {/* @ts-expect-error ...added it to vite-env.d.ts but still getting a TypeScript error... */}
                                {VITE_APP_VERSION}
                            </Text>
                        </StatValueText>
                        <StatValueText alignItems='baseline'>
                            <StatValueUnit>{t('aboutDate')}</StatValueUnit>
                            <Text fontSize='md'>
                                {dateFormatter.format(new Date(import.meta.env.VITE_COMMIT_DATE))}
                            </Text>
                        </StatValueText>
                        <StatValueText alignItems='baseline'>
                            <StatValueUnit>{t('aboutCode')}</StatValueUnit>
                            <Text fontSize='md'>
                                {`${import.meta.env.VITE_BRANCH_NAME} (${import.meta.env.VITE_COMMIT_HASH})`}
                            </Text>
                        </StatValueText>
                    </StatRoot>
                </Box>
                <Box>
                    <StatRoot>
                        <StatLabel>
                            <Heading>{t('aboutServer')}</Heading>
                        </StatLabel>
                        {isFetching &&
                            <Spinner />
                        }
                        {!isFetching && data &&
                            <>
                                <StatValueText alignItems='baseline'>
                                    <StatValueUnit>{t('aboutVersion')}</StatValueUnit>
                                    <Text fontSize='md'>
                                        {data?.appVersion ?? '...'}
                                    </Text>
                                </StatValueText>
                                <StatValueText alignItems='baseline'>
                                    <StatValueUnit>{t('aboutDate')}</StatValueUnit>
                                    <Text fontSize='md'>
                                        {dateFormatter.format(new Date(data.commitTime))}
                                    </Text>
                                </StatValueText>
                                <StatValueText alignItems='baseline'>
                                    <StatValueUnit>{t('aboutCode')}</StatValueUnit>
                                    <Text fontSize='md'>
                                        {`${data.branch} (${data.commitId})`}
                                    </Text>
                                </StatValueText>
                            </>
                        }
                    </StatRoot>
                </Box>
            </HStack>
            <Separator />
            <VStack margin={6}>
                <Text>{t('aboutDeveloper')}</Text>
                <Image
                    src={myWildLogo}
                    height={100}
                    alt='MyWild' />
            </VStack>
            <Image
                src={aboutImage}
                width={{ base: '90%', sm: '70%', md: '55%', lg: '50%', xl: '40%' }}
                fit='cover'
                marginX='auto'
                paddingBottom={12}
            />
        </Container>
    );
}

const dateFormatter = new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Africa/Johannesburg'
});
