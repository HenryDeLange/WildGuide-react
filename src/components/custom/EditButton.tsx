import { Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdEdit } from 'react-icons/md';
import { Button } from '../ui/button';

type Props = {
    titleKey: string;
    handleEdit: () => void;
}

export function EditButton({ titleKey, handleEdit }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <Button
            size='lg'
            variant='ghost'
            whiteSpace='nowrap'
            color='fg.info'
            onClick={handleEdit}
        >
            <MdEdit />
            <Text>
                {t(titleKey)}
            </Text>
        </Button>
    );
}
