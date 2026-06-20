import getMood from '../../utilities/getMood';
import { Station, StationGeometry, StationProperties } from '../../types';

export default function createStation(
  type: 'Feature' = 'Feature',
  geometry: StationGeometry = { type: 'Point', coordinates: [0, 0, 0] },
  properties: Partial<StationProperties> & Pick<StationProperties, 'provider' | 'id' | 'mood'> = {
    provider: '',
    id: '0',
    mood: 0,
  }
): Station {
  return {
    type,
    geometry,
    properties: {
      provider: properties.provider,
      id: properties.id,
      name: properties.name ?? 'Messstation',
      reverseGeoName: properties.reverseGeoName ?? 'Messstation',
      date: properties.date ?? '',
      components: properties.components ?? {},
      mood: properties.mood,
      moodRGBA: getMood(properties.mood, 0.75),
      favorized: properties.favorized ?? false,
      notify: properties.notify ?? false,
    },
  };
}
