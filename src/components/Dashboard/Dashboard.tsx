import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardItem from './DashbaordItem';
import Button from '../UI/Button/Button';
import { Station, StationsCollection, SubscriptionState, OptionsState } from '../../types';
import './Dashboard.scss';

interface Props {
  stations: StationsCollection;
  header: string;
  options: OptionsState;
  media: string;
  subscription: SubscriptionState;
  onSetFavboard: (state: boolean) => void;
  onSetClusterboard: (state: boolean) => void;
  onFavorizeStation: (id: string) => void;
  onUnfavorizeStation: (id: string) => void;
  onNotifyStation: (id: string) => void;
  onUnnotifyStation: (id: string) => void;
  onSetCenter: (station: Station) => void;
  getActive: ((stations: StationsCollection) => Station[]) | string[];
  type: string;
}

export default function Dashboard(props: Props) {
  const navigate = useNavigate();
  const { type, stations, getActive, options, media } = props;

  useEffect(() => {
    if (type !== 'cluster' && typeof getActive === 'function' && !getActive(stations).length) {
      navigate('/');
    }
  }, [type, stations, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const onHandleBack = () => {
    if (media === 'small') props.onSetFavboard(false);
    props.onSetClusterboard(false);
    navigate('/');
  };

  const getClusterStations = (ids: string[]): Station[] => {
    const result: Station[] = [];
    ids.forEach((id) => {
      stations.features.forEach((s) => { if (s.properties.id === id) result.push(s); });
    });
    return result;
  };

  let activeStations: Station[] = type !== 'cluster'
    ? (typeof getActive === 'function' ? getActive(stations) : [])
    : getClusterStations(getActive as string[]);

  if (options.sort) {
    activeStations = [...activeStations].sort((a, b) => b.properties.mood - a.properties.mood);
  }

  let moodStyle: React.CSSProperties | null = null;
  if (activeStations.length) {
    const last = activeStations[activeStations.length - 1];
    moodStyle = last.properties.mood === 0
      ? { backgroundColor: 'rgba(70, 70, 70, 0.75)' }
      : { backgroundColor: last.properties.moodRGBA };
  } else {
    props.onSetFavboard(false);
  }

  const showBackButton = media === 'small' || type === 'cluster';

  return (
    <div className="air__dashboard">
      <div className="air__dashboard-header">
        {showBackButton && (
          <Button clicked={onHandleBack} className="air__button air__button-icon air__button--small air__button--naked air__button--ghost air__button--active air__dashboard-header-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="air__button-icon air__dashboard-header-icon" stroke="rgba(255,255,255,0.9)" strokeWidth="1">
              <use xlinkHref="#airSVGBack" />
            </svg>
          </Button>
        )}
        <div className="air__dahboard-header-title">{props.header}</div>
        {showBackButton && <Button className="air__button air__button-icon air__button--small air__button--naked air__button--ghost air__button--active air__dashboard-header-button" />}
      </div>
      <ul className="air__dashboard-content">
        {activeStations.map((station) => (
          <DashboardItem
            key={station.properties.id}
            stations={stations}
            station={station}
            subscription={props.subscription}
            reversegeo={options.reversegeo}
            onFavorizeStation={props.onFavorizeStation}
            onUnfavorizeStation={props.onUnfavorizeStation}
            onNotifyStation={props.onNotifyStation}
            onUnnotifyStation={props.onUnnotifyStation}
            onSetCenter={props.onSetCenter}
            type={type}
          />
        ))}
        <li className="air__spacer" style={moodStyle ?? undefined}></li>
      </ul>
    </div>
  );
}
