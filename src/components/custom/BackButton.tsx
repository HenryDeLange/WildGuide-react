import { IconButton } from '@chakra-ui/react';
import { FaChevronLeft } from 'react-icons/fa';

type Props = {
    handleBack: () => void;
}

export function BackButton({ handleBack }: Readonly<Props>) {
    return (
        <IconButton
            variant='ghost'
            onClick={handleBack}
            color='fg.muted'
            size='xs'
        >
            <FaChevronLeft />
        </IconButton>
    );
}
