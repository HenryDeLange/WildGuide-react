import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import { Box, Heading, QrCode, Separator, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import { QrCodeIcon } from 'lucide-react';
import { Button } from '../ui/button';

type Props = {
    value: string;
    hideLabel?: boolean;
}

export function QrCodePopup({ value, hideLabel }: Readonly<Props>) {
    return (
        <PopoverRoot lazyMount>
            <PopoverTrigger asChild>
                <Button
                    aria-label={t('qrButton')}
                    variant='ghost'
                    whiteSpace='nowrap'
                >
                    <QrCodeIcon />
                    {!hideLabel &&
                        <Text>{t('qrButton')}</Text>
                    }
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                    <PopoverTitle width='100%' textAlign='center'>
                        <Heading>
                            {t('qrTitle', { value })}
                        </Heading>
                    </PopoverTitle>
                    <Separator marginY={4} />
                    <Box>
                        <QrCode.Root value={value} size='lg' width='100%'>
                            <QrCode.Frame fill='black' backgroundColor='white' width='100%'>
                                <QrCode.Pattern />
                            </QrCode.Frame>
                            <QrCode.DownloadTrigger asChild fileName='qr-code.png' mimeType='image/png'>
                                <Button variant='outline' size='sm' mt='3' width='100%'>
                                    {t('qrDownload')}
                                </Button>
                            </QrCode.DownloadTrigger>
                        </QrCode.Root>
                    </Box>
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    );
}
