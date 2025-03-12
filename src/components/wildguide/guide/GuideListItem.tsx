import { Tooltip } from '@/components/ui/tooltip';
import { Guide } from '@/redux/api/wildguideApi';
import { Flex, Heading, HStack, Icon, Show, Text, VStack } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { t } from 'i18next';
import { memo } from 'react';
import { MdOutlineLock } from 'react-icons/md';

export const GuideListItem = memo(function GuideListItem({ item }: Readonly<{ item: Guide }>) {
    return (
        <Link to='/guides/$guideId' params={{ guideId: item.id.toString() }} >
            <VStack
                _hover={{
                    backgroundColor: 'bg.muted',
                    transform: 'scale(1.05)',
                    transition: 'all 0.2s ease-in-out'
                }}
                borderWidth='1px'
                borderRadius='lg'
                height='100%'
                padding={2}
            >
                <HStack>
                    <Show when={item.visibility === 'PRIVATE'}>
                        <Tooltip content={t('newGuideVisibilityHelpPRIVATE')} showArrow>
                            <Icon size='md'>
                                <MdOutlineLock />
                            </Icon>
                        </Tooltip>
                    </Show>
                    <Tooltip content={item.name} showArrow>
                        <Heading truncate lineClamp={2}>
                            {item.name}
                        </Heading>
                    </Tooltip>
                </HStack>
                <Flex maxWidth='100%' marginTop={-1}>
                    <Text
                        truncate
                        lineClamp={5}
                    >
                        {item.summary ?? ''}
                    </Text>
                </Flex>
            </VStack>
        </Link>
    );
});
