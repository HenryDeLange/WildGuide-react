import { Radio, RadioGroup } from '@/components/ui/radio';
import { Guide, useFindGuideMembersQuery, useFindGuideOwnersQuery, useMemberJoinGuideMutation, useMemberLeaveGuideMutation, useOwnerJoinGuideMutation, useOwnerLeaveGuideMutation, wildguideApi } from '@/redux/api/wildguideApi';
import { DialogRootProvider, Fieldset, HStack, Show, Spinner, Text, useDialog } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuUsersRound } from 'react-icons/lu';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { FloatingInput } from '../../custom/FloatingInput';
import { Button } from '../../ui/button';
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Field } from '../../ui/field';
import { SegmentedControl } from '../../ui/segmented-control';
import { Tag } from '../../ui/tag';

type Props = {
    guideId: number;
}

export function GuideLinkUsers({ guideId }: Readonly<Props>) {
    const { t } = useTranslation();

    const dialog = useDialog();

    const [visibility, setVisibility] = useState<Guide['visibility']>('PRIVATE');
    const [accessType, setAccessType] = useState<AccessTypes>('OWNER');
    const [username, setUsername] = useState('');

    const [
        doFindUserInfo, {
            isLoading: userInfoIsLoading,
            isError: userInfoIsError
        }
    ] = wildguideApi.useLazyFindUserInfoQuery();

    const {
        data: ownerData,
        isLoading: ownerIsLoading,
        isFetching: ownerIsFetching,
        isError: ownerIsError,
        error: ownerError
    } = useFindGuideOwnersQuery({ guideId });

    const {
        data: memberData,
        isLoading: memberIsLoading,
        isFetching: memberIsFetching,
        isError: memberIsError,
        error: memberError
    } = useFindGuideMembersQuery({ guideId });

    const [
        doOwnerJoin, {
            isLoading: ownerJoinIsLoading,
            isError: ownerJoinIsError,
            error: ownerJoinError
        }
    ] = useOwnerJoinGuideMutation();

    const [
        doMemberJoin, {
            isLoading: memberJoinIsLoading,
            isError: memberJoinIsError,
            error: memberJoinError
        }
    ] = useMemberJoinGuideMutation();

    const [
        doOwnerLeave, {
            isLoading: ownerLeaveIsLoading,
            isError: ownerLeaveIsError,
            error: ownerLeaveError
        }
    ] = useOwnerLeaveGuideMutation();

    const [
        doMemberLeave, {
            isLoading: memberLeaveIsLoading,
            isError: memberLeaveIsError,
            error: memberLeaveError
        }
    ] = useMemberLeaveGuideMutation();

    const users = (accessType === 'OWNER' ? ownerData : memberData) ?? [];

    const handleJoin = useCallback(() => {
        doFindUserInfo({ username }).unwrap()
            .then(userInfo => {
                if (accessType === 'OWNER') {
                    doOwnerJoin({ guideId, ownerId: userInfo.id });
                }
                else {
                    doMemberJoin({ guideId, memberId: userInfo.id });
                }
            });
    }, [accessType, doFindUserInfo, doMemberJoin, doOwnerJoin, guideId, username]);

    const handleLeave = useCallback((userId: number) => () => {
        if (accessType === 'OWNER') {
            doOwnerLeave({ guideId, ownerId: userId });
        }
        else {
            doMemberLeave({ guideId, memberId: userId });
        }
    }, [accessType, doMemberLeave, doOwnerLeave, guideId]);

    return (
        <Show when={!ownerIsLoading && !memberIsLoading} fallback={<Spinner size='lg' margin={8} />}>
            <DialogRootProvider value={dialog} placement='center' lazyMount={true}>
                <DialogTrigger asChild>
                    <Button
                        size='lg'
                        variant='ghost'
                        color='fg.info'
                        whiteSpace='nowrap'
                    >
                        <LuUsersRound />
                        <Text>
                            {t('editGuideAccess')}
                        </Text>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {t('editGuideAccessTitle')}
                        </DialogTitle>
                    </DialogHeader>
                    <DialogCloseTrigger />
                    <DialogBody>
                        <ErrorDisplay error={ownerIsError ? ownerError : memberIsError ? memberError : undefined} />
                        <Fieldset.Root
                            disabled={
                                ownerJoinIsLoading || memberJoinIsLoading || userInfoIsLoading
                                || ownerLeaveIsLoading || memberLeaveIsLoading
                            }
                        >
                            <Fieldset.Content gap={8}>
                                <Field
                                    label={<Text fontSize='md'>{t('newGuideVisibility')}</Text>}
                                    // invalid={!!errors.visibility || isError}
                                    // errorText={errors.visibility?.message}
                                    helperText={t(`newGuideVisibilityHelp${visibility}`)}
                                >
                                    <RadioGroup
                                        name='visibility'
                                        value={visibility}
                                        onValueChange={({ value }: { value: Guide['visibility'] }) => setVisibility(value)}
                                        variant='subtle'
                                    >
                                        <HStack gap={8}>
                                            <Radio value='PUBLIC'>
                                                {t('newGuideVisibilityPUBLIC')}
                                            </Radio>
                                            <Radio value='PRIVATE'>
                                                {t('newGuideVisibilityPRIVATE')}
                                            </Radio>
                                        </HStack>
                                    </RadioGroup>
                                </Field>
                                <Field label={<Text fontSize='md'>{t('editGuideAccessMembershipType')}</Text>}>
                                    <SegmentedControl
                                        value={accessType}
                                        items={[
                                            { label: t('editGuideAccessMembershipTypeOWNER'), value: 'OWNER' },
                                            { label: t('editGuideAccessMembershipTypeMEMBER'), value: 'MEMBER' }
                                        ]}
                                        onValueChange={({ value }) => setAccessType(value as AccessTypes)}
                                    />
                                </Field>
                                <Field
                                    label={<Text fontSize='md' marginBottom={2}>{t('editGuideAccessUsernameHelp')}</Text>}
                                    invalid={ownerJoinIsError || memberJoinIsError || userInfoIsError}
                                    errorText={t('editGuideAccessError')}
                                >
                                    <HStack flex={1} width='100%'>
                                        <FloatingInput
                                            label={t('editGuideAccessUsername')}
                                            // placeholder={t('editGuideAccessUsernamePlaceholder')}
                                            value={username}
                                            onChange={event => setUsername(event.target.value)}
                                        />
                                        <Button
                                            onClick={handleJoin}
                                            loading={ownerJoinIsLoading || memberJoinIsLoading || userInfoIsLoading}
                                        >
                                            <LuUsersRound />
                                            {t('editGuideAccessConfirm')}
                                        </Button>
                                    </HStack>
                                </Field>
                                <Field
                                    label={<Text fontSize='md'>{t('editGuideAccessUsers')}</Text>}
                                    invalid={ownerLeaveIsError || memberLeaveIsError}
                                >
                                    {users.map(user =>
                                        <Tag
                                            key={user.userId}
                                            onClose={handleLeave(user.userId)}
                                            size='lg'
                                            closable={!ownerLeaveIsLoading && (accessType === 'MEMBER' || (accessType === 'OWNER' && users.length > 1))}
                                        >
                                            {user.username}
                                        </Tag>
                                    )}
                                </Field>
                            </Fieldset.Content>
                        </Fieldset.Root>
                    </DialogBody>
                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button variant='subtle'>
                                {t('dialogClose')}
                            </Button>
                        </DialogActionTrigger>
                    </DialogFooter>
                </DialogContent>
            </DialogRootProvider>
        </Show>
    );
}

type AccessTypes = 'OWNER' | 'MEMBER';
