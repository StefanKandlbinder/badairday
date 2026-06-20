import { LatLng } from '../types';

export default function getGeoLocation(): Promise<LatLng> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation ist leider nicht verfügbar!'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => reject(new Error('Geolocation ist für diese Seite blockiert!')),
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
    );
  });
}
