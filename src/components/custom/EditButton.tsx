import { Text } from '@chakra-ui/react';
import { Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
            <Edit />
            {showLabels &&
                <Text>
                    {t(titleKey)}
                </Text>
            }
        </Button>
    );
}
