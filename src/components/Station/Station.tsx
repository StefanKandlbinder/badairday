import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { motion } from 'motion/react';

import { favorizeStation, unfavorizeStation, notifyStation, unnotifyStation } from '../../redux/reducers/stationsReducer';
import { setSubscription } from '../../redux/reducers/subscriptionReducer';
import { getStationByID } from '../../redux/filters/getStationByID';
import { updateNotifiedStations } from '../../utilities/updateNotifiedStations';

import Aircomp from '../Aircomp/Aircomp';
import Button from '../UI/Button/Button';
import BadAirDayNotifications from '../../services/Notifications/BadAirDayNotifications';

import './Station.scss';

const hexagon = 'M41.59,163.45v273.1a21.91,21.91,0,0,0,10.95,19L289.05,592.07a21.91,21.91,0,0,0,21.9,0L547.46,455.52a21.91,21.91,0,0,0,10.95-19V163.45a21.91,21.91,0,0,0-10.95-19L311,7.93a21.91,21.91,0,0,0-21.9,0L52.54,144.48A21.91,21.91,0,0,0,41.59,163.45Z';
const circle = 'M5,300v.1a294.91,294.91,0,0,0,147.46,255.4l.08,0a294.93,294.93,0,0,0,294.92,0l.08,0A294.91,294.91,0,0,0,595,300.05V300A294.91,294.91,0,0,0,447.54,44.55l-.08,0a294.93,294.93,0,0,0-294.92,0l-.08,0A294.91,294.91,0,0,0,5,300Z';

const badAirDayNotifications = new BadAirDayNotifications();

interface Props {
  media: string;
  favboard: boolean;
}

interface LocationState {
  x: string | number;
  y: string | number;
}

export default function Station({ media, favboard }: Props) {
  const { id = '' } = useParams<{ id: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const stations     = useAppSelector((s) => s.stations);
  const station      = useAppSelector((s) => getStationByID(s.stations, id));
  const update       = useAppSelector((s) => s.update);
  const reversegeo   = useAppSelector((s) => s.options.reversegeo);
  const subscription = useAppSelector((s) => s.subscription);

  // update.timestamp is read to trigger re-renders when data refreshes
  void update.timestamp;

  if (!station) return null;

  const onAddStation = () => dispatch(favorizeStation(station.properties.id));
  const onRemoveStation = () => dispatch(unfavorizeStation(station.properties.id));

  const onAddNotify = () => {
    dispatch(notifyStation(station.properties.id));
    if (subscription.id === '' || Notification.permission === 'default') {
      badAirDayNotifications.requestPermission()
        .then(() => badAirDayNotifications.subscribeUser())
        .then((res) => badAirDayNotifications.sendSubscription(res))
        .then((res) => {
          dispatch(setSubscription(res.name));
          updateNotifiedStations(res.name, stations);
        })
        .catch(() => {});
    } else {
      updateNotifiedStations(subscription.id.toString(), stations);
    }
  };

  const onRemoveNotify = () => {
    dispatch(unnotifyStation(station.properties.id));
    updateNotifiedStations(subscription.id.toString(), stations);
  };

  const getAirComps = () => {
    if (station.properties.provider === 'upperaustria') {
      const components: React.ReactNode[] = [];
      const wind: React.ReactNode[] = [];
      let temp: React.ReactNode = null;

      Object.entries(station.properties.components).forEach(([key, value]) => {
        if (!value) return;
        if (value.unit === 'µg/m³') {
          components.push(<Aircomp key={key} component={key} value={value.value} unit={value.unit} />);
        } else if (key === 'WIR' || key === 'WIV') {
          wind.push(<Aircomp key={key} component={key} value={value.value} unit={value.unit} />);
        } else if (key === 'TEMP') {
          temp = <Aircomp key={key} component={key} value={value.value} unit={value.unit} />;
        }
      });

      return [
        <div className="air__comp air__station-dust-container" key="components">
          <div className="air__station-comp-container">{components}</div>
        </div>,
        <div className="air__station-windtemp" key="windtemp">
          <div className="air__comp air__comp--wind">{wind}</div>
          {temp}
        </div>,
      ];
    }

    if (station.properties.provider === 'luftdaten') {
      const items: React.ReactNode[] = [];
      Object.entries(station.properties.components).forEach(([key, value]) => {
        if (value?.unit === 'µg/m³') {
          items.push(<Aircomp key={key} component={key} value={value.value} unit={value.unit} />);
        }
      });
      return (
        <div className="air__comp air__station-dust-container" key="components">
          <div className="air__station-comp-container">{items}</div>
        </div>
      );
    }

    return null;
  };

  let name = station.properties.name;
  if (station.properties.provider === 'luftdaten' && reversegeo && station.properties.reverseGeoName !== '') {
    name = station.properties.reverseGeoName;
  }

  let x = 'center';
  let y = 'center';
  const locState = location.state as LocationState | undefined;
  if (locState !== undefined) {
    const innerWidth = window.innerWidth;
    let dashboardWidth = 0;
    let stationWidth = 0;
    if (media === 'medium' && favboard) { dashboardWidth = 320; stationWidth = 330; }
    else if (media === 'medium') { dashboardWidth = 0; stationWidth = 330; }
    else if (media === 'small') { dashboardWidth = 0; stationWidth = 288; }
    x = (Number(locState.x) - (innerWidth - stationWidth - dashboardWidth) / 2) + 'px';
    y = locState.y + 'px';
  }

  const moodStyle: React.CSSProperties = {
    fill: station.properties.components.PM10?.update
      ? station.properties.moodRGBA
      : 'rgba(70,70,70,0.75)',
  };

  return (
    <motion.div
      className={`air__station air__station--${station.properties.provider} air__station--favboard-${favboard}`}
      style={{ transformOrigin: `${x} ${y}` }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2, ease: [0.17, 0.67, 0.39, 0.96] }}
    >
        <svg xmlns="http://www.w3.org/2000/svg" style={moodStyle} className="air__station-background" viewBox="0 0 600 600" filter="drop-shadow(rgba(0,0,0,.5) 10px 10px 20px)">
          <path d={hexagon}>
            <animate id="animation-to-circle" begin="animation-to-hexagon.end" restart="always" fill="freeze" attributeName="d" dur="200ms" to={circle} />
            <animate id="animation-to-hexagon" begin="animation-to-circle.end" restart="always" fill="freeze" attributeName="d" dur="200ms" to={hexagon} />
          </path>
        </svg>
        <div className="air__station-official-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 12" className="air__station-official-icon-svg">
            <use xlinkHref="#airSVGOfficialAustria" />
          </svg>
        </div>
        <h1 className="air__station-header">{name}</h1>
        <div className="air__station-date">{station.properties.date}</div>
        {getAirComps()}
        <div className="air__action-container">
          <Button
            clicked={station.properties.favorized ? onRemoveStation : onAddStation}
            className={`air__button air__button--naked air__button--ghost air__station-button air__station-button-fav${station.properties.favorized ? ' air__station-button-fav--active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="air__station-button-icon" stroke="rgba(255,255,255,0.9)" strokeMiterlimit="10" strokeWidth="24">
              <use xlinkHref="#airSVGFavorize" />
            </svg>
          </Button>
        </div>
        <div className="air__action-container air__action-container--top">
          {('Notification' in window && navigator.serviceWorker) && (
            <Button
              clicked={station.properties.notify ? onRemoveNotify : onAddNotify}
              className={`air__button air__button--naked air__button--ghost air__station-button air__station-button-notify${station.properties.notify ? ' air__station-button-notify--active' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="air__station-button-icon" stroke="rgba(255,255,255,0.9)" strokeWidth="1">
                <use xlinkHref="#airSVGNotify" />
              </svg>
            </Button>
          )}
        </div>
    </motion.div>
  );
}
