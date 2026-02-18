import { selectAuthUsername } from '@/auth/authSlice';
import { BackButton } from '@/components/custom/BackButton';
import { EditButton } from '@/components/custom/EditButton';
import { ErrorDisplay } from '@/components/custom/ErrorDisplay';
import { SummaryBox } from '@/components/custom/SummaryBox';
import { getServerFileUrl } from '@/components/utils';
import { useFindUserInfoQuery } from '@/redux/api/wildguideApi';
import { useAppSelector } from '@/redux/hooks';
import { Box, Container, Heading, HStack, Image, Separator, Show, Spinner, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: '/user/profile' });

    const username = useAppSelector(selectAuthUsername);

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useFindUserInfoQuery({
        username: username!
    }, {
        skip: !username
    });

    const handleEdit = useCallback(() => navigate({ to: '/user/profile/edit' }), [navigate]);

    const handleBack = useCallback(() => navigate({ to: '/', replace: true }), [navigate]);

    return (
        <Container paddingTop={2} paddingBottom={6}>
            <ErrorDisplay error={isError ? error : undefined} />
            <Show when={!isLoading} fallback={<Spinner size='lg' margin={8} />}>
                {data &&
                    <>
                        <HStack paddingBottom={2} wrap={{ base: 'wrap', md: 'nowrap' }}>
                            <HStack width='100%' >
                                <BackButton titleKey='editUserProfileBack' handleBack={handleBack} />
                                <Box width='full'>
                                    <Heading whiteSpace={{ base: 'wrap', sm: 'nowrap' }}>
                                        {t('editUserProfileTitle')}
                                    </Heading>
                                </Box>
                            </HStack>
                            <HStack
                                width='100%'
                                wrap={{ base: 'wrap', sm: 'nowrap' }}
                                justifyContent='flex-end'
                                justifySelf='flex-end'
                            >
                                <EditButton
                                    titleKey='editUserProfileEdit'
                                    handleEdit={handleEdit}
                                />
                            </HStack>
                        </HStack>
                        <Separator />
                        <VStack marginTop={4} gap={4}>
                            <Heading size='3xl'>
                                {data.username}
                            </Heading>
                            <Image src={getServerFileUrl(data.image)} />
                            <SummaryBox summary={data.description} />
                        </VStack>
                    </>
                }
            </Show>
        </Container>
    );
}
