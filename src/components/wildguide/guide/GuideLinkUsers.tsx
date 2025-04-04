import { DeleteButton } from '@/components/custom/DeleteButton';
import { RadioCardItem, RadioCardRoot } from '@/components/ui/radio-card';
import { Guide, useFindGuideMembersQuery, useFindGuideOwnersQuery, useFindGuideQuery, useMemberJoinGuideMutation, useMemberLeaveGuideMutation, useOwnerJoinGuideMutation, useOwnerLeaveGuideMutation, useUpdateGuideMutation, wildguideApi } from '@/redux/api/wildguideApi';
import { DialogRootProvider, Fieldset, HStack, Separator, Show, Spinner, Text, useDialog } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuUsersRound } from 'react-icons/lu';
import { ErrorDisplay } from '../../custom/ErrorDisplay';
import { FloatingInput } from '../../custom/FloatingInput';
import { Button } from '../../ui/button';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Field } from '../../ui/field';
import { Tag } from '../../ui/tag';
import { useShowButtonLabels } from '../hooks/uiHooks';

type Props = {
    guideId: number;
}

export function GuideLinkUsers({ guideId }: Readonly<Props>) {
    const { t } = useTranslation();

    const showLabels = useShowButtonLabels();

    const dialog = useDialog();

    const [accessType, setAccessType] = useState<AccessTypes>('OWNER');
    const [username, setUsername] = useState('');
    const [userNotfound, setUserNotFound] = useState(false);

    const [
        doFindUserInfo, {
            isLoading: userInfoIsLoading,
            isError: userInfoIsError
        }
    ] = wildguideApi.useLazyFindUserInfoQuery();

    const [
        doUpdateGuide, {
            isLoading: updateIsLoading,
            // isError: updateIsError,
            // error: updateError
        }
    ] = useUpdateGuideMutation();

    const {
        data: guideData,
        isLoading: guideIsLoading,
        isError: guideIsError,
        error: guideError
    } = useFindGuideQuery({ guideId });

    const {
        data: ownerData,
        isLoading: ownerIsLoading,
        // isFetching: ownerIsFetching,
        isError: ownerIsError,
        error: ownerError
    } = useFindGuideOwnersQuery({ guideId });

    const {
        data: memberData,
        isLoading: memberIsLoading,
        // isFetching: memberIsFetching,
        isError: memberIsError,
        error: memberError
    } = useFindGuideMembersQuery({ guideId });

    const [
        doOwnerJoin, {
            isLoading: ownerJoinIsLoading,
            isError: ownerJoinIsError,
            // error: ownerJoinError
        }
    ] = useOwnerJoinGuideMutation();

    const [
        doMemberJoin, {
            isLoading: memberJoinIsLoading,
            isError: memberJoinIsError,
            // error: memberJoinError
        }
    ] = useMemberJoinGuideMutation();

    const [
        doOwnerLeave, {
            isLoading: ownerLeaveIsLoading,
            isError: ownerLeaveIsError,
            // error: ownerLeaveError
        }
    ] = useOwnerLeaveGuideMutation();

    const [
        doMemberLeave, {
            isLoading: memberLeaveIsLoading,
            isError: memberLeaveIsError,
            // error: memberLeaveError
        }
    ] = useMemberLeaveGuideMutation();

    const users = (accessType === 'OWNER' ? ownerData : memberData) ?? [];

    const handleJoin = useCallback(() => {
        doFindUserInfo({ username }).unwrap()
            .then(userInfo => {
                setUserNotFound(false);
                if (accessType === 'OWNER') {
                    doOwnerJoin({ guideId, ownerId: userInfo.id });
                }
                else {
                    doMemberJoin({ guideId, memberId: userInfo.id });
                }
            })
            .catch(e => {
                console.warn(e);
                setUserNotFound(true);
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

    const handleVisibilityChange = useCallback(({ value }: { value: Guide['visibility'] }) => {
        if (guideData) {
            doUpdateGuide({
                guideId,
                guideBase: {
                    ...guideData,
                    visibility: value
                }
            });
        }
    }, [doUpdateGuide, guideData, guideId]);

    const isLoading = guideIsLoading || updateIsLoading || userInfoIsLoading
        || ownerJoinIsLoading || memberJoinIsLoading
        || ownerLeaveIsLoading || memberLeaveIsLoading;

    return (
        <Show when={!guideIsLoading && !ownerIsLoading && !memberIsLoading} fallback={<Spinner size='lg' margin={8} />}>
            <DialogRootProvider value={dialog} placement='center' lazyMount={true} size='lg'>
                <DialogTrigger asChild>
                    <Button
                        size='md'
                        variant='ghost'
                        color='fg.info'
                        whiteSpace='nowrap'
                        padding={showLabels ? undefined : 0}
                    >
                        <LuUsersRound />
                        {showLabels &&
                            <Text>
                                {t('editGuideAccess')}
                            </Text>
                        }
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader marginTop={-4} marginLeft={-2}>
                        <DialogTitle>
                            {t('editGuideAccessTitle')}
                        </DialogTitle>
                    </DialogHeader>
                    <DialogCloseTrigger />
                    <DialogBody padding={4} marginTop={-4}>
                        <ErrorDisplay error={ownerIsError ? ownerError : memberIsError ? memberError : guideIsError ? guideError : undefined} />
                        <Fieldset.Root disabled={isLoading}>
                            <Fieldset.Content gap={6}>
                                <Field label={<Text fontSize='md'>{t('newGuideVisibility')}</Text>}>
                                    <RadioCardRoot
                                        defaultValue={guideData?.visibility ?? 'PUBLIC'}
                                        onValueChange={handleVisibilityChange}
                                        width='full'
                                        colorPalette='orange'
                                    >
                                        <HStack align='stretch'>
                                            <RadioCardItem
                                                label={t('newGuideVisibilityPUBLIC')}
                                                description={t('newGuideVisibilityHelpPUBLIC')}
                                                value='PUBLIC' width='100%'
                                            />
                                            <RadioCardItem
                                                label={t('newGuideVisibilityPRIVATE')}
                                                description={t('newGuideVisibilityHelpPRIVATE')}
                                                value='PRIVATE'
                                            />
                                        </HStack>
                                    </RadioCardRoot>
                                </Field>
                                <Separator variant='dashed' marginBottom={-2} size='lg' />
                                <Field label={<Text fontSize='md'>{t('editGuideAccessMembershipType')}</Text>}>
                                    <RadioCardRoot
                                        defaultValue='OWNER'
                                        onValueChange={({ value }: { value: AccessTypes }) => setAccessType(value)}
                                        width='full'
                                    >
                                        <HStack align='stretch'>
                                            <RadioCardItem
                                                label={t('editGuideAccessMembershipTypeOWNER')}
                                                description={t('editGuideAccessMembershipTypeDescriptionOWNER')}
                                                value='OWNER'
                                            />
                                            <RadioCardItem
                                                label={t('editGuideAccessMembershipTypeMEMBER')}
                                                description={t('editGuideAccessMembershipTypeDescriptionMEMBER')}
                                                value='MEMBER'
                                            />
                                        </HStack>
                                    </RadioCardRoot>
                                </Field>
                                <Field
                                    label={<Text fontSize='md' marginBottom={2}>{t('editGuideAccessUsernameHelp')}</Text>}
                                    invalid={ownerJoinIsError || memberJoinIsError || userInfoIsError || userNotfound}
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
                                            color='fg.success'
                                            variant='outline'
                                        >
                                            <LuUsersRound />
                                            {t('editGuideAccessConfirm')}
                                        </Button>
                                    </HStack>
                                </Field>
                                <Field
                                    label={<Text fontSize='md'>
                                        {t('editGuideAccessUsers', {
                                            type: t(`editGuideAccessMembershipType${accessType}`).toLowerCase()
                                        })}
                                    </Text>}
                                    invalid={ownerLeaveIsError || memberLeaveIsError}
                                >
                                    <HStack>
                                        {users.map(user =>
                                            <Tag
                                                key={user.userId}
                                                size='lg'
                                            >
                                                {user.username}
                                                {(accessType === 'MEMBER' || (accessType === 'OWNER' && users.length > 1)) &&
                                                    <DeleteButton
                                                        buttonText={t('editGuideAccessDeleteTitle')}
                                                        popupText={t('editGuideAccessDeleteDetails', { user: user.username })}
                                                        handleDelete={handleLeave(user.userId)}
                                                        loading={isLoading}
                                                        compact
                                                    />
                                                }
                                            </Tag>
                                        )}
                                    </HStack>
                                </Field>
                            </Fieldset.Content>
                        </Fieldset.Root>
                    </DialogBody>
                </DialogContent>
            </DialogRootProvider>
        </Show>
    );
}

type AccessTypes = 'OWNER' | 'MEMBER';
