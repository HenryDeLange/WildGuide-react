import { Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdEdit } from 'react-icons/md';
import { Button } from '../ui/button';
import { useShowButtonLabels } from '../wildguide/hooks/uiHooks';

type Props = {
    titleKey: string;
    handleEdit: () => void;
}

export function EditButton({ titleKey, handleEdit }: Readonly<Props>) {
    const { t } = useTranslation();
    const showLabels = useShowButtonLabels();
    return (
        <Button
            size='md'
            variant='ghost'
            whiteSpace='nowrap'
            color='fg.info'
            onClick={handleEdit}
            padding={showLabels ? undefined : 0}
        >
            <MdEdit />
            {showLabels &&
                <Text>
                    {t(titleKey)}
                </Text>
            }
        </Button>
    );
}
