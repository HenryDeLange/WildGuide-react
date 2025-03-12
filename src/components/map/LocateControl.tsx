import { LocateControl as Locate } from 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.css';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export function LocateControl() {
    const map = useMap();
    useEffect(() => {
        const layer = new Locate({
            position: 'bottomright',
            // maxZoom: 19,
            strings: { title: 'Center on my location' },
            // onActivate: () => { }
        });
        layer.addTo(map);
        return () => { map.removeControl(layer); };
    }, [map]);
    return null;
}