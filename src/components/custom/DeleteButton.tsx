import { Text } from '@chakra-ui/react';
import { Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from '../ui/dialog';

type Props = {
    handleDelete: () => void;
    loading: boolean;
    buttonText: string;
    popupText: string;
    compact?: boolean;
}

export function DeleteButton({ handleDelete, loading, buttonText, popupText, compact }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <DialogRoot role='alertdialog' lazyMount>
            <DialogTrigger asChild>
                <Button
                    _hover={{ color: 'fg.error' }}
                    size={compact ? 'xs' : 'lg'}
                    variant='ghost'
                    whiteSpace='nowrap'
                    loading={loading}
                    padding={compact ? 0 : undefined}
                    margin={compact ? 0 : undefined}
                    marginTop={compact ? -1 : undefined}
                    marginRight={compact ? -2 : undefined}
                    focusRing={compact ? 'none' : undefined}
                    boxSize={compact ? 4: undefined}
                >
                    <Trash />
                    {!compact &&
                        <Text>{t(buttonText)}</Text>
                    }
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {`${t(buttonText)}?`}
                    </DialogTitle>
                </DialogHeader>
                <DialogBody>
                    {t(popupText)}
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button variant='outline'>
                            {t('dialogClose')}
                        </Button>
                    </DialogActionTrigger>
                    <Button colorPalette='red' onClick={handleDelete}>
                        {t(buttonText)}
                    </Button>
                </DialogFooter>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
}