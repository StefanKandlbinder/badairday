// ─── Air quality component (PM10, PM25, NO2, WIR, WIV, TEMP …) ───────────────
export interface AirComponent {
  type: string;
  value: number;
  unit: string;
  update: boolean;
}

export interface StationComponents {
  PM10?: AirComponent;
  PM25?: AirComponent;
  NO2?: AirComponent;
  WIR?: AirComponent;
  WIV?: AirComponent;
  TEMP?: AirComponent;
  [key: string]: AirComponent | undefined;
}

// ─── GeoJSON station ──────────────────────────────────────────────────────────
export interface StationProperties {
  provider: string;
  id: string;
  name: string;
  reverseGeoName: string;
  date: string;
  components: StationComponents;
  mood: number;
  moodRGBA: string;
  favorized: boolean;
  notify: boolean;
}

export interface StationGeometry {
  type: 'Point';
  coordinates: [number, number, number];
}

export interface Station {
  type: 'Feature';
  geometry: StationGeometry;
  properties: StationProperties;
}

export interface StationsCollection {
  type: 'FeatureCollection';
  features: Station[];
}

// ─── Geo ──────────────────────────────────────────────────────────────────────
export interface LatLng {
  lat: number;
  lng: number;
}

// ─── Redux state slices ───────────────────────────────────────────────────────
export interface UIState {
  loading: boolean;
  updating: boolean;
  updaterCount: number;
  geolocation: boolean;
  sidebar: boolean;
  bottomsheet: boolean;
  favboard: boolean;
  clusterboard: boolean;
  media: string;
}

export interface UpdateState {
  timestamp: number;
}

export interface CenterState {
  lat: number;
  lng: number;
  station?: Station;
}

export interface SubscriptionState {
  id: string;
}

export interface OptionsState {
  reversegeo: boolean;
  autoupdating: boolean;
  runaways: boolean;
  sort: boolean;
}

export interface TokenState {
  token?: string;
  timestamp?: number;
}

export interface TokensState {
  reversegeo: TokenState;
}

export interface Notification {
  type: string;
  payload: {
    id: number;
    message: string;
  };
  meta: {
    type: string;
    feature: string;
  };
}

// ─── Root state ───────────────────────────────────────────────────────────────
export interface RootState {
  stations: StationsCollection;
  ui: UIState;
  notifications: Notification[];
  update: UpdateState;
  location: LatLng;
  center: CenterState;
  subscription: SubscriptionState;
  options: OptionsState;
  tokens: TokensState;
}

// ─── Redux action shape (generic) ─────────────────────────────────────────────
export interface Action<P = unknown> {
  type: string;
  payload?: P;
  meta?: Record<string, unknown>;
}

// ─── Middleware API ────────────────────────────────────────────────────────────
export interface MiddlewareAPI {
  dispatch: (action: Action | Action[]) => void;
  getState: () => RootState;
}

// ─── Luftdaten raw API ────────────────────────────────────────────────────────
export interface LuftdatenSensorDataValue {
  value_type: string;
  value: string;
}

export interface LuftdatenStation {
  sensor: { id: number };
  location: { latitude: string; longitude: string };
  timestamp: string;
  sensordatavalues: LuftdatenSensorDataValue[];
}

// ─── Upper Austria raw API ────────────────────────────────────────────────────
export interface UpperAustriaMesswert {
  station: string;
  mittelwert: string;
  zeitpunkt: number;
  komponente: string;
  messwert: string;
  einheit: string;
}

export interface UpperAustriaResponse {
  messwerte: UpperAustriaMesswert[];
}

// ─── stations.json ────────────────────────────────────────────────────────────
export interface StationEntry {
  code: string;
  kurzname: string;
  geoBreite: number;
  geoLaenge: number;
}
