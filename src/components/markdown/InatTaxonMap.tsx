import { Box } from '@chakra-ui/react';
import { RangeMap } from '../map/RangeMap';

type Props = {
    id: number;
    latitude?: number;
    longitude?: number;
    zoom?: number;
}

export function InatTaxonMap({ id, latitude, longitude, zoom }: Readonly<Props>) {
    return (
        <Box height={MAP_HEIGHT} marginY={1}>
            <RangeMap
                taxonId={id}
                height={MAP_HEIGHT}
                initLatitude={latitude}
                initLongitude={longitude}
                initZoom={zoom}
                scrollWheelZoom={false}
            />
        </Box>
    );
}

const MAP_HEIGHT = '35vh';
