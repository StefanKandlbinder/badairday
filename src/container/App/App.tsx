import React, { useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Route, Routes, NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { STATIONS } from '../../redux/actions/stations';
import { fetchStations, favorizeStation, unfavorizeStation, notifyStation, unnotifyStation } from '../../redux/actions/stations';
import { setLocation } from '../../redux/actions/location';
import { setCenter } from '../../redux/actions/center';
import { setGeoLocation, setFavboard, setClusterboard, setMedia } from '../../redux/actions/ui';
import { setNotification } from '../../redux/actions/notifications';
import { setOptionAutoupdater, setOptionReverseGeo, setOptionRunaways, setOptionSort } from '../../redux/actions/options';
import { clearState } from '../../redux/localStorage';
import getGeoLocation from '../../services/getGeoLocation';
import getWebShare from '../../services/getWebShare';
import { getActiveStations } from '../../redux/filters/getActiveStations';
import { RootState, Station } from '../../types';

import SVGSprite from '../../components/UI/SVGSprite/SVGSprite';
import Stations from '../../components/Stations/Stations';
import StationDetail from '../../components/Station/Station';
import Dashboard from '../../components/Dashboard/Dashboard';
import Notifications from '../../components/UI/Notifications/Notifications';
import Button from '../../components/UI/Button/Button';
import Tabbar from '../../components/UI/Tabbar/Tabbar';
import Loading from '../../components/UI/Loading/Loading';
import Spinner from '../../components/UI/Spinner/Spinner';
import Spacer from '../../components/UI/Spacer/Spacer';
import Flex from '../../components/UI/Flex/Flex';
import Toggle from '../../components/UI/Toggle/Toggle';
import Sidebar from '../../components/UI/Sidebar/Sidebar';
import BottomSheet from '../../components/UI/BottomSheet/BottomSheet';
import List from '../../components/UI/List/List';
import ListItem from '../../components/UI/List/ListItem';
import ListHeader from '../../components/UI/List/ListHeader';
import Legend from '../../components/UI/Legend/Legend';
import Updatebar from '../../components/UI/Updatebar/Updatebar';
import './App.scss';

const REACT_APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '0.0.0';

const luftdatenURL = 'https://api.luftdaten.info/static/v2/data.dust.min.json';
const luftdatenProvider = 'luftdaten';
const upperAustriaURL = 'https://www2.land-oberoesterreich.gv.at/imm/jaxrs/messwerte/json?';
const upperAustriaProvider = 'upperaustria';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const stations = useSelector((s: RootState) => s.stations);
  const loading = useSelector((s: RootState) => s.ui.loading);
  const updating = useSelector((s: RootState) => s.ui.updating);
  const geolocation = useSelector((s: RootState) => s.ui.geolocation);
  const favboard = useSelector((s: RootState) => s.ui.favboard);
  const clusterboard = useSelector((s: RootState) => s.ui.clusterboard);
  const media = useSelector((s: RootState) => s.ui.media);
  const position = useSelector((s: RootState) => s.location);
  const center = useSelector((s: RootState) => s.center);
  const notifications = useSelector((s: RootState) => s.notifications);
  const subscription = useSelector((s: RootState) => s.subscription);
  const update = useSelector((s: RootState) => s.update);
  const options = useSelector((s: RootState) => s.options);

  const isMedium = useMediaQuery('(min-width: 768px) and (orientation: landscape)');

  useEffect(() => {
    dispatch(setMedia({ state: isMedium ? 'medium' : 'small', feature: STATIONS }));
  }, [isMedium, dispatch]);

  useEffect(() => {
    const handler = () => { if (!document.hidden) onUpdateStations(); };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!stations.features.length) onFetchStations();
    else onUpdateStations();
    if (clusterboard) dispatch(setClusterboard({ state: false, feature: STATIONS }));
  }, []); // eslint-disable-line

  useEffect(() => {
    if (media === 'medium' && getActiveStations(stations).length) {
      dispatch(setFavboard({ state: true, feature: STATIONS }));
    } else if (media === 'medium' && !getActiveStations(stations).length) {
      dispatch(setFavboard({ state: false, feature: STATIONS }));
    } else if (media === 'small' && !location.pathname.includes('favboard')) {
      dispatch(setFavboard({ state: false, feature: STATIONS }));
    }
  }, [media, stations]); // eslint-disable-line

  useEffect(() => {
    if (!location.pathname.includes('clusterboard')) {
      dispatch(setClusterboard({ state: false, feature: STATIONS }));
    }
  }, [location.pathname, dispatch]);

  const onFetchStations = useCallback(() => {
    dispatch(fetchStations(luftdatenURL, luftdatenProvider, 'FETCH', position));
    dispatch(fetchStations(upperAustriaURL, upperAustriaProvider, 'FETCH', position));
  }, [dispatch, position]);

  const onUpdateStations = useCallback(() => {
    dispatch(fetchStations(luftdatenURL, luftdatenProvider, 'UPDATE', position));
    dispatch(fetchStations(upperAustriaURL, upperAustriaProvider, 'UPDATE', position));
  }, [dispatch, position]);

  const handleLocation = useCallback(() => {
    dispatch(setGeoLocation({ state: true, feature: STATIONS }));
    getGeoLocation()
      .then((success) => {
        dispatch(setGeoLocation({ state: false, feature: STATIONS }));
        dispatch(setLocation(success));
        onUpdateStations();
      })
      .catch((e: Error) => {
        dispatch(setGeoLocation({ state: false, feature: STATIONS }));
        dispatch(setNotification({ message: e.message, feature: STATIONS, type: 'info' }));
      });
  }, [dispatch, onUpdateStations]);

  const handleShare = useCallback(() => {
    getWebShare('BadAirday', 'Verfolgen Sie die aktuelle Luftqualität in ihrer Nähe', 'https://badairday.netlify.com/')
      .catch((error: Error) => dispatch(setNotification({ message: error.message, feature: STATIONS, type: 'info' })));
  }, [dispatch]);

  const clearStorage = useCallback(() => {
    clearState();
    setTimeout(() => { navigate('/'); window.location.reload(); }, 2000);
  }, [navigate]);

  const onSetFav = useCallback(() => {
    if (favboard) onUpdateStations();
    else dispatch(setFavboard({ state: true, feature: STATIONS }));
  }, [favboard, dispatch, onUpdateStations]);

  const stationsRef = useRef<HTMLDivElement>(null);
  const favboardRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const spinnerUpdatingRef = useRef<HTMLDivElement>(null);
  const spinnerLoadingRef = useRef<HTMLDivElement>(null);
  const loadingGeoRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const shareSection = navigator.share ? (
    <>
      <ListHeader className="air__list-header air__list-header--sticky air__color-primary--active air__border-radius-top--2">Social</ListHeader>
      <List className="air__list air__border-radius-top--2">
        <ListItem className="air__list-item air__flex--justify-content-space-between">
          Teile mich
          <Button clicked={handleShare} className="air__button air__button--naked air__button--ghost air__bottom-sheet-button air__bottom-button-share">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="air__bottom-sheet-button-icon">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
            </svg>
          </Button>
        </ListItem>
      </List>
    </>
  ) : null;

  return (
    <div className={favboard ? 'air air--favboard' : 'air'}>
      <SVGSprite />

      <CSSTransition nodeRef={stationsRef} in={!!stations.features} timeout={300} classNames="air__animation-fade" mountOnEnter unmountOnExit>
        <div ref={stationsRef}>
          {stations.features && (
            <Stations
              stations={stations}
              options={options}
              update={update}
              updating={updating}
              media={media}
              position={position}
              center={center}
              favboard={favboard}
              clusterboard={clusterboard}
              subscription={subscription}
              onFavorizeStation={(id) => dispatch(favorizeStation(id))}
              onUnfavorizeStation={(id) => dispatch(unfavorizeStation(id))}
              onNotifyStation={(id) => dispatch(notifyStation(id))}
              onUnnotifyStation={(id) => dispatch(unnotifyStation(id))}
              onSetFavboard={(p) => dispatch(setFavboard(p))}
              onSetClusterboard={(p) => dispatch(setClusterboard(p))}
              onFetchStations={(url, provider, method, loc) => dispatch(fetchStations(url, provider, method, loc))}
              onSetCenter={(s: Station) => dispatch(setCenter(s))}
            />
          )}
          <Routes>
            <Route
              path="/station/:provider/:id/*"
              element={<StationDetail media={media} favboard={favboard} />}
            />
            <Route path="*" element={null} />
          </Routes>
        </div>
      </CSSTransition>

      <CSSTransition nodeRef={favboardRef} in={favboard} classNames="air__animation-site-transition" timeout={300} mountOnEnter unmountOnExit>
        <div ref={favboardRef} className="air__site air__site--favboard">
          <Dashboard
            stations={stations}
            header="Favoriten"
            options={options}
            media={media}
            subscription={subscription}
            onSetFavboard={(p) => dispatch(setFavboard(p))}
            onSetClusterboard={(p) => dispatch(setClusterboard(p))}
            onFavorizeStation={(id) => dispatch(favorizeStation(id))}
            onUnfavorizeStation={(id) => dispatch(unfavorizeStation(id))}
            onNotifyStation={(id) => dispatch(notifyStation(id))}
            onUnnotifyStation={(id) => dispatch(unnotifyStation(id))}
            onSetCenter={(s: Station) => dispatch(setCenter(s))}
            getActive={getActiveStations}
            type="active"
          />
        </div>
      </CSSTransition>

      <Legend className="air__legend--horizontal" />

      <Tabbar>
        <NavLink
          className={({ isActive }) =>
            `air__tabbar-link air__button air__button--label air__button--naked${isActive ? ' air__button--active' : ''}`
          }
          aria-label="Map"
          end
          to="/"
          onClick={() => location.pathname === '/' ? onUpdateStations() : dispatch(setFavboard({ state: false, feature: STATIONS }))}
        >
          <svg className="air__button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <use xlinkHref="#airSVGMap" />
          </svg>
          Karte
        </NavLink>
        {media === 'small' && (
          <NavLink
            onClick={onSetFav}
            className={({ isActive }) =>
              `air__tabbar-link air__button air__button--label air__button--naked${!getActiveStations(stations).length ? ' air__button--disabled' : ''}${isActive ? ' air__button--active' : ''}`
            }
            aria-label="List"
            to="/favboard"
          >
            <svg className="air__button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <use xlinkHref="#airSVGFavList" />
            </svg>
            Favoriten
          </NavLink>
        )}
        <Spacer className="air__bg-color-text" />
        <NavLink
          className={({ isActive }) =>
            `air__tabbar-link air__button air__button--label air__button--naked${isActive ? ' air__button--active' : ''}`
          }
          aria-label="Options Sheet"
          to={location.pathname === '/bottomsheet' ? '/' : '/bottomsheet'}
        >
          <svg className="air__button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <use xlinkHref="#airSVGMoreVert" />
          </svg>
          Mehr
        </NavLink>
        <Button className="air__button air__button--naked air__button--fab air__button-location" aria-label="Get Location" clicked={handleLocation}>
          <svg className="air__color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <use xlinkHref="#airSVGLogoCool" />
          </svg>
        </Button>
      </Tabbar>

      <CSSTransition nodeRef={sidebarRef} in={location.pathname === '/sidebar'} classNames="air__animation-sidebar" timeout={300} mountOnEnter unmountOnExit>
        <div ref={sidebarRef}>
          <Sidebar>
            <Spacer />
            <Button className="air__button air__button--naked air__button--ghost" clicked={onUpdateStations}>
              <svg className="air__color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M11 8v5l4.25 2.52.77-1.28-3.52-2.09V8zm10 2V3l-2.64 2.64C16.74 4.01 14.49 3 12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9h-2c0 3.86-3.14 7-7 7s-7-3.14-7-7 3.14-7 7-7c1.93 0 3.68.79 4.95 2.05L14 10h7z" />
              </svg>
            </Button>
          </Sidebar>
        </div>
      </CSSTransition>

      <CSSTransition nodeRef={bottomSheetRef} in={location.pathname === '/bottomsheet'} classNames="air__animation-bottom-sheet" timeout={300} mountOnEnter unmountOnExit>
        <div ref={bottomSheetRef}>
          <BottomSheet className="air__options-sheet">
            <div className="air__options-sheet-scroll-container">
              <Flex className="air__flex air__flex--align-items-center air__padding-left--3 air__padding-right--3 air__padding-top--4 air__padding-bottom air__border-radius-top--2">
                <svg className="air__color-text air__margin-right" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <use xlinkHref="#airSVGLogoCoolSimple" />
                </svg>
                <h3 className="air__letter-spacing air__color-primary air__margin-bottom--0 air__margin-top--0">BadAirDay</h3>
                <Flex className="air__flex air__color-primary air__flex-grow--1 air__flex--justify-content-flex-end">
                  v{REACT_APP_VERSION}
                </Flex>
              </Flex>
              <ListHeader className="air__list-header air__list-header--sticky air__color-primary--active air__border-radius-top--2">Einstellungen</ListHeader>
              <List className="air__list air__border-radius-top--2">
                <ListItem className="air__list-item air__flex--justify-content-space-between">
                  <Toggle className={`air__toggle ${options.reversegeo ? 'air__toggle--active' : 'air__toggle--inactive'}`}
                    clicked={() => dispatch(setOptionReverseGeo({ state: !options.reversegeo, feature: STATIONS }))}>
                    ReverseGeo<small>Umwandlung der GPS-Daten in reale Adresse.</small>
                  </Toggle>
                </ListItem>
                <ListItem className="air__list-item air__flex--justify-content-space-between">
                  <Toggle className={`air__toggle ${options.runaways ? 'air__toggle--active' : 'air__toggle--inactive'}`}
                    clicked={() => dispatch(setOptionRunaways({ state: !options.runaways, feature: STATIONS }))}>
                    Runaways<small>Ausreißer (PM10 &gt;= 1999) werden ausgeblendet.</small>
                  </Toggle>
                </ListItem>
                <ListItem className="air__list-item air__flex--justify-content-space-between">
                  <Toggle className={`air__toggle ${options.sort ? 'air__toggle--active' : 'air__toggle--inactive'}`}
                    clicked={() => dispatch(setOptionSort({ state: !options.sort, feature: STATIONS }))}>
                    Sort<small>Sortierung anhand des PM10 Wertes.</small>
                  </Toggle>
                </ListItem>
                <ListItem className="air__list-item air__flex--justify-content-space-between">
                  <Toggle className={`air__toggle ${options.autoupdating ? 'air__toggle--active' : 'air__toggle--inactive'}`}
                    clicked={() => dispatch(setOptionAutoupdater({ state: !options.autoupdating, feature: STATIONS }))}>
                    Autoupdater<small>Alle 5 Minuten erfolgt automatisch ein Update.</small>
                  </Toggle>
                </ListItem>
              </List>
              {shareSection}
              <ListHeader className="air__list-header air__list-header--sticky air__color-primary--active">Handle With Care</ListHeader>
              <List className="air__list">
                <ListItem className="air__list-item">
                  <Button className="air__button air__button--ghost air__button--full air__button--small air__margin-right" clicked={onFetchStations}>
                    <svg className="air__button-icon air__color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <use xlinkHref="#airSVGRefresh" />
                    </svg>
                    Fetch
                  </Button>
                  <Button className="air__button air__button--ghost air__button--full air__button--small air__margin-left" clicked={clearStorage}>
                    <svg className="air__button-icon air__color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <use xlinkHref="#airSVGRestore" />
                    </svg>
                    Clear
                  </Button>
                </ListItem>
              </List>
            </div>
          </BottomSheet>
        </div>
      </CSSTransition>

      {options.autoupdating && <Updatebar interval={60 * 3 * 1000} update={onUpdateStations} />}

      <CSSTransition nodeRef={spinnerUpdatingRef} in={updating} classNames="air__animation-fade" timeout={300} mountOnEnter unmountOnExit>
        <div ref={spinnerUpdatingRef}><Spinner /></div>
      </CSSTransition>

      <CSSTransition nodeRef={spinnerLoadingRef} in={loading} classNames="air__animation-fade-crunchy" timeout={300} mountOnEnter unmountOnExit>
        <div ref={spinnerLoadingRef}><Spinner /></div>
      </CSSTransition>

      <CSSTransition nodeRef={loadingGeoRef} in={geolocation} classNames="air__animation-fade-crunchy" timeout={150} mountOnEnter unmountOnExit>
        <div ref={loadingGeoRef}><Loading>Geolocation</Loading></div>
      </CSSTransition>

      <CSSTransition nodeRef={notificationsRef} in={notifications.length > 0} classNames="air__animation-notification" timeout={300} mountOnEnter unmountOnExit>
        <div ref={notificationsRef}><Notifications notifications={notifications} /></div>
      </CSSTransition>
    </div>
  );
}
