import { Box, IconButton } from '@chakra-ui/react';
import { LuZoomIn, LuZoomOut } from 'react-icons/lu';
import { TbZoomReset } from 'react-icons/tb';
import { TransformComponent, TransformWrapper, useControls } from 'react-zoom-pan-pinch';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogRoot, DialogTrigger } from '../ui/dialog';
import { Attribution } from './Attribution';

type Props = {
    url: string;
    attribution?: string;
}

export function ImageZoomPopup({ url, attribution }: Readonly<Props>) {
    return (
        <DialogRoot
            placement='center'
            size='cover'
            lazyMount
        >
            <DialogTrigger asChild>
                <Box position='absolute' top={1} right={1}>
                    <IconButton variant='ghost' size='sm' focusRing='none'>
                        <LuZoomIn />
                    </IconButton>
                </Box>
            </DialogTrigger>
            <DialogContent overflow='auto'>
                <DialogBody padding={0} position='relative' maxHeight='full'>
                    <TransformWrapper
                        wheel={{ smoothStep: 0.004 }}
                        centerOnInit
                        minScale={0.5}
                    >
                        <TransformComponent
                            wrapperStyle={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 4
                            }}

                        >
                            <img src={url} />
                        </TransformComponent>
                        <Controls />
                    </TransformWrapper>
                    <Box bgColor='blue'>
                        <Attribution attribution={attribution} />
                    </Box>
                </DialogBody>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
}

function Controls() {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
        <div className='tools'>
            <Box position='absolute' top={2} left={2}>
                <IconButton variant='ghost' size='sm' onClick={() => zoomIn()}>
                    <LuZoomIn />
                </IconButton>
                <IconButton variant='ghost' size='sm' onClick={() => zoomOut()}>
                    <LuZoomOut />
                </IconButton>
                <IconButton variant='ghost' size='sm' onClick={() => resetTransform()}>
                    <TbZoomReset />
                </IconButton>
            </Box>
        </div>
    );
}
