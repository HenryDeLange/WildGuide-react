import { Entry } from '@/redux/api/wildguideApi';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AttributionControl, LayersControl, MapContainer, TileLayer, useMapEvents, ZoomControl } from 'react-leaflet';
import { useHeights } from '../wildguide/hooks/uiHooks';
import { LocateControl } from './LocateControl';
import './rangeMap.css';

type Props = {
    taxonId: number;
    rank?: Entry['scientificRank'];
    parentId?: number;
    height?: number | string;
    initLatitude?: number;
    initLongitude?: number;
    initZoom?: number;
    scrollWheelZoom?: boolean;
}

export function RangeMap({ taxonId, rank, parentId, height, initLatitude, initLongitude, initZoom, scrollWheelZoom = true }: Readonly<Props>) {
    const { t } = useTranslation();

    const { grid } = useHeights();

    const useParentId = rank === 'SUBSPECIES' && parentId;
    const geoModelLayer = `${t('mapOverlayGeoModel')}${useParentId ? ` - ${t('mapOverlayParent')}` : ''}`;
    const rangeLayer = `${t('mapOverlayRange')}${useParentId ? ` - ${t('mapOverlayParent')}` : ''}`;
    const heatLayer = t('mapOverlayHeat');
    const observationsLayer = t('mapOverlayObservations');

    // Remember map position and selected layers
    const center = (initLatitude && initLongitude)
        ? [initLatitude, initLongitude]
        : JSON.parse(localStorage.getItem('mapCenter') ?? JSON.stringify(startPosition));
    const zoom = initZoom
        ? initZoom
        : Number(localStorage.getItem('mapZoom') ?? 11);
    const storedMapLayers = localStorage.getItem('mapLayers');

    const [selectedLayers, setSelectedLayers] = useState<string[]>(storedMapLayers ? JSON.parse(storedMapLayers) : [observationsLayer, rangeLayer]);

    const MapEvents = () => {
        useMapEvents({
            moveend: (e) => {
                if (!initLatitude && !initLongitude) {
                    localStorage.setItem('mapCenter', JSON.stringify(e.target.getCenter()));
                }
            },
            zoomend: (e) => {
                if (!initZoom) {
                    localStorage.setItem('mapZoom', JSON.stringify(e.target.getZoom()));
                }
            },
            overlayadd: (e) => {
                if (selectedLayers.indexOf(e.name) < 0) {
                    setSelectedLayers(prev => {
                        const newSelection = [...prev, e.name];
                        localStorage.setItem('mapLayers', JSON.stringify(newSelection));
                        return newSelection;
                    });
                }
            },
            overlayremove: (e) => {
                if (selectedLayers.indexOf(e.name) >= 0) {
                    setSelectedLayers(prev => {
                        const newSelection = prev.filter((layer) => layer !== e.name);
                        localStorage.setItem('mapLayers', JSON.stringify(newSelection));
                        return newSelection;
                    });
                }
            }
        });
        return null;
    };

    // RENDER
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={scrollWheelZoom}
            attributionControl={false}
            zoomControl={false}
            style={{ height: height ?? (grid - 24) }}
            maxZoom={maxZoom}
            minZoom={minZoom}
        >
            {/* Controls */}
            <AttributionControl
                position='bottomleft'
                prefix={`<a href='https://www.inaturalist.org'>iNaturalist</a>, 
                         <a href='https://leafletjs.com'>Leaflet</a>, 
                         <a href='https://www.google.co.za/maps/about'>Google Maps</a>`}
            />
            <LocateControl />
            <ZoomControl position='bottomright' />
            {/* Layers */}
            <LayersControl position='topright'>
                {/* Base */}
                <LayersControl.BaseLayer name={t('mapBaseStreet')} checked>
                    <TileLayer
                        url='https://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}'
                        subdomains={subdomains}
                        maxZoom={maxZoom}
                        minZoom={minZoom}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name={t('mapBaseHybrid')}>
                    <TileLayer
                        url='https://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}'
                        subdomains={subdomains}
                        maxZoom={maxZoom}
                        minZoom={minZoom}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name={t('mapBaseSatellite')}>
                    <TileLayer
                        url='https://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}'
                        subdomains={subdomains}
                        maxZoom={maxZoom}
                        minZoom={minZoom}
                    />
                </LayersControl.BaseLayer>
                {/* Overlays */}
                {/* TODO: Is there a way to reduce the number of calls to iNat when panning/zooming the map? */}
                {(rank === 'SPECIES' || useParentId) &&
                    <>
                        <LayersControl.Overlay name={geoModelLayer} checked={selectedLayers.indexOf(geoModelLayer) >= 0}>
                            <TileLayer
                                url={`https://api.inaturalist.org/v1/geomodel/${useParentId ? parentId : taxonId}/{z}/{x}/{y}.png?thresholded=true`}
                                attribution={`<a href='https://www.inaturalist.org/geo_model/${useParentId ? parentId : taxonId}/explain'>GeoModel</a>`}
                                maxZoom={maxZoom}
                                minZoom={minZoom}
                            />
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name={rangeLayer} checked={selectedLayers.indexOf(rangeLayer) >= 0}>
                            <TileLayer
                                url={`https://api.inaturalist.org/v1/taxon_ranges/${useParentId ? parentId : taxonId}/{z}/{x}/{y}.png?color=${useParentId ? 'orange' : 'red'}`}
                                attribution={`<a href='https://www.inaturalist.org/taxa/${useParentId ? parentId : taxonId}/range.html'>Range</a>`}
                                maxZoom={maxZoom}
                                minZoom={minZoom}
                            />
                        </LayersControl.Overlay>
                    </>
                }
                <LayersControl.Overlay name={heatLayer} checked={selectedLayers.indexOf(heatLayer) >= 0}>
                    <TileLayer
                        url={`https://api.inaturalist.org/v1/heatmap/{z}/{x}/{y}.png?taxon_id=${taxonId}`}
                        attribution={`<a href='https://www.inaturalist.org/taxa/${taxonId}'>Taxon</a>`}
                        maxZoom={maxZoom}
                        minZoom={minZoom}
                    />
                </LayersControl.Overlay>
                <LayersControl.Overlay name={observationsLayer} checked={selectedLayers.indexOf(observationsLayer) >= 0}>
                    <TileLayer
                        url={`https://api.inaturalist.org/v1/grid/{z}/{x}/{y}.png?taxon_id=${taxonId}`}
                        attribution={`<a href='https://www.inaturalist.org/taxa/${taxonId}'>Taxon</a>`}
                        maxZoom={maxZoom}
                        minZoom={minZoom}
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
const minZoom = 3;
