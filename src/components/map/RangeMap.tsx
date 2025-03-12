import { Entry } from '@/redux/api/wildguideApi';
import { AttributionControl, LayersControl, MapContainer, TileLayer, useMapEvents, ZoomControl } from 'react-leaflet';
import { LocateControl } from './LocateControl';
import './rangeMap.css';

type Props = {
    taxonId: number;
    rank: Entry['scientificRank'];
    parentId?: number;
}

export function RangeMap({ taxonId, rank, parentId }: Readonly<Props>) {
    // Fix height
    // const [mapHeight, setMapHeight] = useState(window.innerHeight);
    // useEffect(() => {
    //     const updateDimensions = () => {
    //         setMapHeight(window.innerHeight);
    //     };
    //     window.addEventListener('resize', updateDimensions);
    //     return () => window.removeEventListener('resize', updateDimensions);
    // }, []);
    
    // Remember map position
    const center = JSON.parse(localStorage.getItem('mapCenter') ?? JSON.stringify(startPosition));
    const zoom = Number(localStorage.getItem('mapZoom') ?? 11);
    const MapEvents = () => {
        useMapEvents({
            moveend: (e) => {
                localStorage.setItem('mapCenter', JSON.stringify(e.target.getCenter()));
            },
            zoomend: (e) => {
                localStorage.setItem('mapZoom', JSON.stringify(e.target.getZoom()));
            },
        });
        return null;
    };

    // RENDER
    const useParentId = rank === 'SUBSPECIES' && parentId;
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom
            attributionControl={false}
            zoomControl={false}
        // style={{ height: mapHeight }}
        >
            <AttributionControl
                position='bottomleft'
                prefix={`<a href='https://www.inaturalist.org'>iNaturalist</a>, 
                    <a href='https://leafletjs.com' >Leaflet</a>, 
                    <a href='https://www.google.co.za/maps/about'>Google Maps</a>`}
            />
            <LocateControl />
            <ZoomControl position='bottomright' />

            <LayersControl position='topright'>
                {/* Base Layers */}
                <LayersControl.BaseLayer name='Google Maps - Street' checked={true}>
                    <TileLayer
                        url='https://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}'
                        maxZoom={maxZoom}
                        subdomains={subdomains}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name='Google Maps - Hybrid'>
                    <TileLayer
                        url='https://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}'
                        maxZoom={maxZoom}
                        subdomains={subdomains}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name='Google Maps - Satellite'>
                    <TileLayer
                        url='https://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}'
                        maxZoom={maxZoom}
                        subdomains={subdomains}
                    />
                </LayersControl.BaseLayer>
                {/* Overlays */}
                {(rank === 'SPECIES' || useParentId) &&
                    <>
                        <LayersControl.Overlay name={`Potential Range${useParentId ? ' (parent species)' : ''}`}>
                            <TileLayer
                                url={`https://api.inaturalist.org/v1/geomodel/${useParentId ? parentId : taxonId}/{z}/{x}/{y}.png?thresholded=true`}
                                attribution={`<a href='https://www.inaturalist.org/geo_model/${useParentId ? parentId : taxonId}/explain'>GeoModel</a>`}
                                maxZoom={maxZoom}
                            />
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name={`Taxon Range${useParentId ? ' (parent species)' : ''}`} checked>
                            <TileLayer
                                url={`https://api.inaturalist.org/v1/taxon_ranges/${useParentId ? parentId : taxonId}/{z}/{x}/{y}.png?color=${useParentId ? 'orange' : 'red'}`}
                                attribution={`<a href='https://www.inaturalist.org/taxa/${useParentId ? parentId : taxonId}/range.html'>Range</a>`}
                                maxZoom={maxZoom}
                            />
                        </LayersControl.Overlay>
                    </>
                }
                <LayersControl.Overlay name='Observations - Heatmap'>
                    <TileLayer
                        url={`https://api.inaturalist.org/v1/heatmap/{z}/{x}/{y}.png?taxon_id=${taxonId}`}
                        attribution={`<a href='https://www.inaturalist.org/taxa/${taxonId}'>Taxon</a>`}
                        maxZoom={maxZoom}
                    />
                </LayersControl.Overlay>
                <LayersControl.Overlay name='Observations - Grid' checked>
                    <TileLayer
                        url={`https://api.inaturalist.org/v1/grid/{z}/{x}/{y}.png?taxon_id=${taxonId}`}
                        attribution={`<a href='https://www.inaturalist.org/taxa/${taxonId}'>Taxon</a>`}
                        maxZoom={maxZoom}
                    />
                </LayersControl.Overlay>
            </LayersControl>
            <MapEvents />
        </MapContainer >
    );
};

const startPosition = {
    lat: -33.6,
    lng: 26.73
};

const subdomains = ['mt0', 'mt1', 'mt2', 'mt3'];

const maxZoom = 20;
