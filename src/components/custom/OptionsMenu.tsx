import { IconButton } from '@chakra-ui/react';
import { EllipsisVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MenuContent, MenuItem, MenuItemGroup, MenuRoot, MenuSeparator, MenuTrigger } from '../ui/menu';
import { QrCodePopup } from './QrCodePopup';
import { RefreshButton } from './RefreshButton';
import { ShareButton } from './ShareButton';

type Props = {
    handleRefresh: () => void;
    isFetching: boolean;
} & ({
    type: 'GUIDE';
    guideId: number;
} | {
    type: 'ENTRY';
    guideId: number;
    entryId: number;
});

export function OptionsMenu({ type, guideId, handleRefresh, isFetching, ...conditionalProps }: Readonly<Props>) {
    const { t } = useTranslation();
    const entryPath = (type === 'ENTRY' && 'entryId' in conditionalProps) ? `/entries/${conditionalProps.entryId}` : '';
    const url = `${window.location.origin}/guides/${guideId}${entryPath}`;
    return (
        <MenuRoot>
            <MenuTrigger asChild>
                <IconButton variant='ghost'>
                    <EllipsisVertical />
                </IconButton>
            </MenuTrigger>
            <MenuContent>
                <MenuItemGroup title={t('shareTitle')}>
                    <MenuItem value='share' closeOnSelect={false} asChild>
                        <ShareButton value={url} />
                    </MenuItem>
                    <MenuItem value='qr' closeOnSelect={false} asChild>
                        <QrCodePopup value={url} />
                    </MenuItem>
                </MenuItemGroup>
                <MenuSeparator />
                <MenuItemGroup title={t(type.toLowerCase())}>
                    <MenuItem value='refresh' closeOnSelect={false} asChild>
                        <RefreshButton
                            handleRefresh={handleRefresh}
                            loading={isFetching} />
                    </MenuItem>
                </MenuItemGroup>
            </MenuContent>
        </MenuRoot>
    );
}
