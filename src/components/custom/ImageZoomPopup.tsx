import { Box, DialogRootProps, IconButton, useBreakpointValue } from '@chakra-ui/react';
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
    const wrapperWidth = useBreakpointValue({ base: '100vw', md: '100%' });
    const wrapperHeight = useBreakpointValue({ base: '100vh', md: '100%' });
    const sizeWorkAround: DialogRootProps['size'] = useBreakpointValue({ base: 'full', md: 'cover' }); // Setting the size like this seems to work better, for some reason
    return (
        <DialogRoot
            placement='center'
            size={sizeWorkAround}
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
                <DialogBody padding={0} position='relative' maxHeight='full' maxWidth='full'>
                    <TransformWrapper
                        centerOnInit
                        wheel={{ smoothStep: 0.004 }}
                        minScale={0.5}
                    >
                        <TransformComponent
                            wrapperStyle={{
                                width: wrapperWidth,
                                height: wrapperHeight,
                                borderRadius: 4
                            }}
                        >
                            <img src={url} />
                        </TransformComponent>
                        <Controls />
                    </TransformWrapper>
                    <Attribution attribution={attribution} />
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
