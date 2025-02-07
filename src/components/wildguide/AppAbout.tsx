import myWildLogo from '@/assets/images/mywild/mywild-logo.svg';
import { useGetVersionQuery } from '@/redux/api/wildguideApi';
import { Box, Heading, HStack, Image, Separator, Spinner, StatLabel, StatRoot, StatValueText, StatValueUnit, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export function AppAbout() {
    const { t } = useTranslation();
    const { data, isFetching } = useGetVersionQuery();
    return (
        <Box margin={4}>
            <Box textAlign='center' marginX={6} marginBottom={4} paddingX={4} paddingBottom={4}>
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
                                {VITE_APP_VERSION}
                            </Text>
                        </StatValueText>
                        <StatValueText alignItems='baseline'>
                            <StatValueUnit>{t('aboutDate')}</StatValueUnit>
                            <Text fontSize='md'>
                                {dateFormatter.format(new Date(import.meta.env.VITE_COMMIT_DATE))}
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
                            </>
                        }
                    </StatRoot>
                </Box>
            </HStack>
            <Separator />
            <VStack margin={6}>
                <Text>{t('aboutDeveloper')}</Text>
                <Image height={100} src={myWildLogo} />
            </VStack>
        </Box>
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
