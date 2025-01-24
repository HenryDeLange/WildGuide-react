import { useEffect, useState } from 'react';

export function useHeights() {
    const [heights, setHeights] = useState(calcHeights());

    useEffect(() => {
        const handleResize = () => {
            setHeights(calcHeights());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return heights;
}

function calcHeights() {
    return {
        window: window.innerHeight,
        content: calcContentHeight(),
        grid: calcGridHeight()
    };
}

function calcGridHeight() {
    return window.innerHeight
        - (document.getElementById('app-header')?.offsetHeight ?? 0)
        - (document.getElementById('grid-header')?.offsetHeight ?? 0);
}

function calcContentHeight() {
    return window.innerHeight
        - (document.getElementById('app-header')?.offsetHeight ?? 0);
}
