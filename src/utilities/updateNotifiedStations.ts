import { getNotifiedStations } from '../redux/filters/getNotifiedStations';
import { StationsCollection } from '../types';

export function updateNotifiedStations(subscriptionId: string, stations: StationsCollection): void {
  const url = `https://badairday22.firebaseio.com/subscriptions/${subscriptionId}/notifiedStations.json`;
  window.setTimeout(() => {
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(getNotifiedStations(stations)),
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
  }, 2000);
}
