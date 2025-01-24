import { Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiTrash } from 'react-icons/fi';
import { Button } from '../ui/button';
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from '../ui/dialog';

type Props = {
    handleDelete: () => void;
    loading: boolean;
    buttonText: string;
    popupText: string;
}

export function DeleteButton({ handleDelete, loading, buttonText, popupText }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <DialogRoot role='alertdialog' lazyMount>
            <DialogTrigger asChild>
                <Button
                    _hover={{ color: 'fg.info' }}
                    size='lg'
                    variant='ghost'
                    color='fg.muted'
                    whiteSpace='nowrap'
                    loading={loading}
                >
                    <FiTrash />
                    <Text>{t(buttonText)}</Text>
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