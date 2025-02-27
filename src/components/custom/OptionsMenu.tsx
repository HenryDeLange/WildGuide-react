import { IconButton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LuEllipsisVertical } from "react-icons/lu";
import { MenuContent, MenuItem, MenuItemGroup, MenuRoot, MenuSeparator, MenuTrigger } from "../ui/menu";
import { QrCodePopup } from "./QrCodePopup";
import { RefreshButton } from "./RefreshButton";
import { ShareButton } from "./ShareButton";

type Props = {
    handleRefresh: () => void;
    isFetching: boolean;
} & ({
    type: 'guide';
    guideId: number;
} | {
    type: 'entry';
    guideId: number;
    entryId: number;
});

export function OptionsMenu({ type, guideId, handleRefresh, isFetching, ...props }: Readonly<Props>) {
    const { t } = useTranslation();
    const url = `${window.location.origin}/guides/${guideId}${(type === 'entry' && 'entryId' in props) ? `/entries/${props.entryId}` : ''}`;
    return (
        <MenuRoot>
            <MenuTrigger asChild>
                <IconButton variant='ghost'>
                    <LuEllipsisVertical />
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
                <MenuItemGroup title={t(type)}>
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
