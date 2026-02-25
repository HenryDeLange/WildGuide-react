import { Tooltip } from '@/components/ui/tooltip';
import { getServerIconUrl } from '@/components/utils';
import { Guide } from '@/redux/api/wildguideApi';
import { Flex, Heading, HStack, Icon, Image, Show, Text, VStack } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { t } from 'i18next';
import { Lock, Star } from 'lucide-react';
import { memo } from 'react';

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
                            <Icon size='md' color='fg.info'>
                                <Lock />
                            </Icon>
                        </Tooltip>
                    </Show>
                    <Image
                        src={getServerIconUrl('GUIDE', item.id)}
                        boxSize={{ base: 6, sm: 8, md: 10 }}
                        rounded='md'
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <Tooltip content={item.name} showArrow>
                        <Heading truncate lineClamp={2}>
                            {item.name}
                        </Heading>
                    </Tooltip>
                    {item.starredByUser &&
                        <Icon size='md' color='fg.info' fill='fg.info'>
                            <Star fill='inherit' />
                        </Icon>}
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
