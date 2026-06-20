import React from 'react';
import Button from '../UI/Button/Button';
import { updateNotifiedStations } from '../../utilities/updateNotifiedStations';
import { Station, StationsCollection, SubscriptionState } from '../../types';
import './DashboardItem.scss';

interface SampleProps {
  classes: string;
  component: { type: string; value: number; update: boolean };
}

function Sample({ classes, component }: SampleProps) {
  return (
    <div className={classes}>
      <div className="air__dashboard-item-component-type">{component.type}:</div>
      <div className="air__dashboard-item-component-value">{component.update ? component.value : '-'}</div>
    </div>
  );
}

interface Props {
  station: Station;
  stations: StationsCollection;
  subscription: SubscriptionState;
  reversegeo: boolean;
  onFavorizeStation: (id: string) => void;
  onUnfavorizeStation: (id: string) => void;
  onNotifyStation: (id: string) => void;
  onUnnotifyStation: (id: string) => void;
  onSetCenter: (station: Station) => void;
  type: string;
}

export default function DashboardItem({ station, stations, subscription, reversegeo, onFavorizeStation, onUnfavorizeStation, onNotifyStation, onUnnotifyStation, onSetCenter }: Props) {
  const { components } = station.properties;

  const onAddStation = () => onFavorizeStation(station.properties.id);
  const onRemoveStation = () => onUnfavorizeStation(station.properties.id);

  const onAddNotify = () => {
    onNotifyStation(station.properties.id);
    if (subscription.id !== '') updateNotifiedStations(subscription.id.toString(), stations);
  };

  const onRemoveNotify = () => {
    onUnnotifyStation(station.properties.id);
    updateNotifiedStations(subscription.id.toString(), stations);
  };

  const moodStyle: React.CSSProperties = {
    backgroundColor: components['PM10']?.update
      ? station.properties.moodRGBA
      : 'rgba(70, 70, 70, 0.75)',
  };

  let name = station.properties.name;
  if (station.properties.provider === 'luftdaten' && reversegeo && station.properties.reverseGeoName !== '') {
    name = station.properties.reverseGeoName;
  }

  const no2 = components.NO2
    ? <Sample classes="air__dashboard-item-component" component={components.NO2} />
    : null;
  const pm10 = components.PM10
    ? <Sample classes="air__dashboard-item-component air__dashboard-component-content--main" component={components.PM10} />
    : null;
  const pm25 = components.PM25
    ? <Sample classes="air__dashboard-item-component" component={components.PM25} />
    : null;

  const wiv = components.WIV ? (
    <div className="air__dashboard-item-wiv">
      <span className="air__dashboard-item-wiv-value">{components.WIV.value}</span>
      <span className="air__dashboard-item-wiv-unit">{components.WIV.unit}</span>
    </div>
  ) : null;

  const wir = components.WIR ? (
    <div className="air__dashboard-item-wir" style={{ transform: `rotate(${(components.WIR.value || 0) - 180}deg)` }}>
      <svg className="air__dashboard-item-wir-svg" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 600 600">
        <path d="M289.3 103.1L98.7 484.2c-5.2 10.3 5.8 21.3 16.1 16.1l179.8-89.9c3.4-1.7 7.4-1.7 10.7 0l179.8 89.9c10.3 5.2 21.3-5.8 16.1-16.1L310.7 103.1c-4.4-8.9-17-8.9-21.4 0zm4.1 276.4l-117.2 58.6c-10.3 5.2-21.3-5.8-16.1-16.1l117.2-234.3c5.7-11.3 22.7-7.3 22.7 5.4v175.8c0 4.4-2.6 8.6-6.6 10.6z" fill="#fff" />
      </svg>
    </div>
  ) : null;

  const wind = components.WIV && components.WIR
    ? <div className="air__dashboard-item-wind">{wir}{wiv}</div>
    : null;

  const temp = components.TEMP ? (
    <div className="air__dashboard-item-temp">
      <div className="air__dashboard-item-temp-container">
        <span className="air__dashboard-item-temp-value">{components.TEMP.value}°</span>
        <span className="air__dashboard-item-temp-unit">{components.TEMP.unit}</span>
      </div>
    </div>
  ) : null;

  const notifyButton = ('Notification' in window && navigator.serviceWorker) ? (
    <Button
      clicked={station.properties.notify ? onRemoveNotify : onAddNotify}
      className={`air__button air__button--negative air__button-icon air__button--small air__button--naked air__button--ghost${station.properties.notify ? ' air__button--active' : ' air__button--inactive'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="air__button-icon" stroke="rgba(255,255,255,0.9)" strokeWidth="1">
        <use xlinkHref="#airSVGNotify" />
      </svg>
    </Button>
  ) : null;

  const officialIcon = station.properties.provider === 'upperaustria' ? (
    <div className="air__dashboard-item-official-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 12">
        <use xlinkHref="#airSVGOfficialAustria" />
      </svg>
    </div>
  ) : null;

  return (
    <li className="air__dashboard-item" style={moodStyle}>
      {officialIcon}
      <div className="air__dashboard-item-action">
        {notifyButton}
        <Button
          clicked={station.properties.favorized ? onRemoveStation : onAddStation}
          className={`air__button air__button--negative air__button--small air__button--naked air__button--ghost${station.properties.favorized ? ' air__button--active' : ' air__button--inactive'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="air__button-icon" stroke="rgba(255,255,255,0.9)" strokeMiterlimit="10" strokeWidth="24">
            <use xlinkHref="#airSVGFavorize" />
          </svg>
        </Button>
      </div>
      <div className="air__dashboard-item-content air__dashboard-item--description" onClick={() => onSetCenter(station)}>
        <div className="air__dashboard-item-name">{name}</div>
        <div className="air__dashboard-item-date">{station.properties.date}</div>
        <div className="air__dashboard-item-container">{wind}{temp}</div>
      </div>
      <div className="air__dashboard-item-content air__dashboard-item-content--component">
        {pm10}{pm25}{no2}
      </div>
    </li>
  );
}
