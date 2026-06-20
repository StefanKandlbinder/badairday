import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { StationsCollection } from '../../types';
import { hexbinLayer } from './asymmetrik';

interface Props {
  data: StationsCollection;
  updating: boolean;
  timestamp: number;
  onClick: (d: HexbinDatum[], i: number, coords: [number, number]) => void;
}

interface HexbinDatum {
  o: { properties: { id: string; provider: string } };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HexLayer = any;

export default function HexbinLayer({ data, updating, timestamp, onClick }: Props) {
  const map = useMap();
  const layerRef = useRef<HexLayer>(null);
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  useEffect(() => {
    const layer: HexLayer = hexbinLayer({});
    layerRef.current = layer;
    layer.addTo(map);

    if (data?.features) {
      layer.data(data.features);
      layer.dispatch().on('click', (d: HexbinDatum[], i: number, coords: [number, number]) => {
        onClickRef.current(d, i, coords);
      });
    }

    return () => {
      layer.data(null);
      map.removeLayer(layer);
    };
  }, [map]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !data?.features) return;

    if (!updating) {
      layer.data(data.features);
      layer.updateBins();
      layer.dispatch().on('click', (d: HexbinDatum[], i: number, coords: [number, number]) => {
        onClickRef.current(d, i, coords);
      });
    }
  }, [data, timestamp, updating]);

  return null;
}
