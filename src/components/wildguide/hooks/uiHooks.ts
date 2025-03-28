import { useBreakpointValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export function useShowButtonLabels() {
    const hide = useBreakpointValue({ base: false, sm: true });
    return hide;
}

export function useHeights() {
    const [heights, setHeights] = useState(calcHeights());

    useEffect(() => {
        const handleResize = () => {
            setHeights(calcHeights());
        };
        handleResize();
        setTimeout(() => handleResize(), 100);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return heights;
}

function calcHeights() {
    return {
        window: window.innerHeight,
        appHeader: (document.getElementById('app-header')?.offsetHeight ?? 0),
        content: calcContentHeight(),
        gridHeader: (document.getElementById('grid-header')?.offsetHeight ?? 0),
        grid: calcGridHeight(),
        pageHeader: (document.getElementById('page-header')?.offsetHeight ?? 0),
        tabHeader: (document.getElementById('tab-header')?.offsetHeight ?? 0)
    };
}

function calcContentHeight() {
    return window.innerHeight
        - (document.getElementById('app-header')?.offsetHeight ?? 0);
}

function calcGridHeight() {
    return window.innerHeight
        - (document.getElementById('app-header')?.offsetHeight ?? 0)
        - (document.getElementById('page-header')?.offsetHeight ?? 0)
        - (document.getElementById('tab-header')?.offsetHeight ?? 0)
        - (document.getElementById('grid-header')?.offsetHeight ?? 0);
}
