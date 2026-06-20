import React, { useEffect, useCallback, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  useNavigate,
  useLocation,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import { fetchStations } from "../../redux/actions/stations";
import {
  favorizeStation,
  unfavorizeStation,
  notifyStation,
  unnotifyStation,
} from "../../redux/reducers/stationsReducer";
import { setLocation } from "../../redux/reducers/locationReducer";
import { setCenter } from "../../redux/reducers/centerReducer";
import {
  setGeolocation,
  setFavboard,
  setClusterboard,
  setMedia,
} from "../../redux/reducers/uiReducer";
import { addNotification } from "../../redux/reducers/notificationsReducer";
import {
  setOptionReversegeo,
  setOptionAutoupdating,
  setOptionRunaways,
  setOptionSort,
  setOptionDarkMode,
} from "../../redux/reducers/optionsReducer";
import { clearState } from "../../redux/localStorage";
import getGeoLocation from "../../services/getGeoLocation";
import getWebShare from "../../services/getWebShare";
import { getActiveStations } from "../../redux/filters/getActiveStations";
import { Station } from "../../types";

import SVGSprite from "../../components/UI/SVGSprite/SVGSprite";
import LogoCool from "../../components/UI/SVGSprite/LogoCool";
import LogoCoolSimple from "../../components/UI/SVGSprite/LogoCoolSimple";
import Stations from "../../components/Stations/Stations";
import StationDetail from "../../components/Station/Station";
import Dashboard from "../../components/Dashboard/Dashboard";
import Notifications from "../../components/UI/Notifications/Notifications";
import Button from "../../components/UI/Button/Button";
import Tabbar from "../../components/UI/Tabbar/Tabbar";
import Loading from "../../components/UI/Loading/Loading";
import Spinner from "../../components/UI/Spinner/Spinner";
import Spacer from "../../components/UI/Spacer/Spacer";
import Flex from "../../components/UI/Flex/Flex";
import Toggle from "../../components/UI/Toggle/Toggle";
import Sidebar from "../../components/UI/Sidebar/Sidebar";
import BottomSheet from "../../components/UI/BottomSheet/BottomSheet";
import List from "../../components/UI/List/List";
import ListItem from "../../components/UI/List/ListItem";
import ListHeader from "../../components/UI/List/ListHeader";
import Legend from "../../components/UI/Legend/Legend";
import Updatebar from "../../components/UI/Updatebar/Updatebar";
import "./App.scss";

const REACT_APP_VERSION = import.meta.env.VITE_APP_VERSION ?? "0.0.0";

const MotionBottomSheet = motion(BottomSheet);
const MotionSidebar = motion(Sidebar);

const luftdatenURL = "https://api.luftdaten.info/static/v2/data.dust.min.json";
const luftdatenProvider = "luftdaten";
const upperAustriaURL =
  "https://www2.land-oberoesterreich.gv.at/imm/jaxrs/messwerte/json?";
const upperAustriaProvider = "upperaustria";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(
    () => window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export default function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const stations = useAppSelector((s) => s.stations);
  const loading = useAppSelector((s) => s.ui.loading);
  const updating = useAppSelector((s) => s.ui.updating);
  const geolocation = useAppSelector((s) => s.ui.geolocation);
  const favboard = useAppSelector((s) => s.ui.favboard);
  const clusterboard = useAppSelector((s) => s.ui.clusterboard);
  const media = useAppSelector((s) => s.ui.media);
  const position = useAppSelector((s) => s.location);
  const center = useAppSelector((s) => s.center);
  const notifications = useAppSelector((s) => s.notifications);
  const subscription = useAppSelector((s) => s.subscription);
  const update = useAppSelector((s) => s.update);
  const options = useAppSelector((s) => s.options);

  const isMedium = useMediaQuery(
    "(min-width: 768px) and (orientation: landscape)",
  );
  const [mapNarrow, setMapNarrow] = useState(false);

  useEffect(() => {
    dispatch(setMedia(isMedium ? "medium" : "small"));
  }, [isMedium, dispatch]);

  useEffect(() => {
    if (!favboard) setMapNarrow(false);
  }, [favboard]);

  useEffect(() => {
    const handler = () => {
      if (!document.hidden) onUpdateStations();
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!stations.features.length) onFetchStations();
    else onUpdateStations();
    if (clusterboard) dispatch(setClusterboard(false));
  }, []); // eslint-disable-line

  useEffect(() => {
    if (media === "medium" && getActiveStations(stations).length) {
      dispatch(setFavboard(true));
    } else if (media === "medium" && !getActiveStations(stations).length) {
      dispatch(setFavboard(false));
    }
  }, [media, stations]); // eslint-disable-line

  useEffect(() => {
    if (media === "small") {
      dispatch(setFavboard(location.pathname.includes("favboard")));
    }
  }, [location.pathname, media, dispatch]);

  useEffect(() => {
    if (!location.pathname.includes("clusterboard")) {
      dispatch(setClusterboard(false));
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      options.darkMode ? "dark" : "light",
    );
  }, [options.darkMode]);

  const onFetchStations = useCallback(() => {
    dispatch(fetchStations(luftdatenURL, luftdatenProvider, "FETCH", position));
    dispatch(
      fetchStations(upperAustriaURL, upperAustriaProvider, "FETCH", position),
    );
  }, [dispatch, position]);

  const onUpdateStations = useCallback(() => {
    dispatch(
      fetchStations(luftdatenURL, luftdatenProvider, "UPDATE", position),
    );
    dispatch(
      fetchStations(upperAustriaURL, upperAustriaProvider, "UPDATE", position),
    );
  }, [dispatch, position]);

  const handleLocation = useCallback(() => {
    dispatch(setGeolocation(true));
    getGeoLocation()
      .then((success) => {
        dispatch(setGeolocation(false));
        dispatch(setLocation(success));
        onUpdateStations();
      })
      .catch((e: Error) => {
        dispatch(setGeolocation(false));
        dispatch(addNotification(e.message, "info"));
      });
  }, [dispatch, onUpdateStations]);

  const handleShare = useCallback(() => {
    getWebShare(
      "BadAirday",
      "Verfolgen Sie die aktuelle Luftqualität in ihrer Nähe",
      "https://badairday.netlify.com/",
    ).catch((error: Error) => dispatch(addNotification(error.message, "info")));
  }, [dispatch]);

  const clearStorage = useCallback(() => {
    clearState();
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 2000);
  }, [navigate]);

  const onSetFav = useCallback(() => {
    if (favboard) onUpdateStations();
    else dispatch(setFavboard(true));
  }, [favboard, dispatch, onUpdateStations]);

  const shareSection =
    typeof navigator.share === "function" ? (
      <>
        <ListHeader className="air__list-header air__list-header--sticky air__color-primary--active air__border-radius-top--2">
          Social
        </ListHeader>
        <List className="air__list air__border-radius-top--2">
          <ListItem className="air__list-item air__flex--justify-content-space-between">
            Teile mich
            <Button
              clicked={handleShare}
              className="air__button air__button--naked air__button--ghost air__bottom-sheet-button air__bottom-button-share"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="air__bottom-sheet-button-icon"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
              </svg>
            </Button>
          </ListItem>
        </List>
      </>
    ) : null;

  return (
    <div className={favboard ? "air air--favboard" : "air"}>
      <SVGSprite />

      <motion.div
        className="air__map-container"
        animate={{
          width:
            mapNarrow && media === "medium" ? "calc(100% - 320px)" : "100%",
        }}
        transition={{ duration: 0.15, ease: [0.53, 0.04, 0.83, 0.88] }}
      >
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
            onSetFavboard={(v) => dispatch(setFavboard(v))}
            onSetClusterboard={(v) => dispatch(setClusterboard(v))}
            onFetchStations={(url, provider, method, loc) =>
              dispatch(fetchStations(url, provider, method, loc))
            }
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
      </motion.div>

      <AnimatePresence>
        {favboard && (
          <motion.div
            className="air__site air__site--favboard"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.15, ease: [0.53, 0.04, 0.83, 0.88] }}
            onAnimationStart={() => {
              if (favboard) setMapNarrow(true);
            }}
          >
            <Dashboard
              stations={stations}
              header="Favoriten"
              options={options}
              media={media}
              subscription={subscription}
              onSetFavboard={(v) => dispatch(setFavboard(v))}
              onSetClusterboard={(v) => dispatch(setClusterboard(v))}
              onFavorizeStation={(id) => dispatch(favorizeStation(id))}
              onUnfavorizeStation={(id) => dispatch(unfavorizeStation(id))}
              onNotifyStation={(id) => dispatch(notifyStation(id))}
              onUnnotifyStation={(id) => dispatch(unnotifyStation(id))}
              onSetCenter={(s: Station) => dispatch(setCenter(s))}
              getActive={getActiveStations}
              type="active"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Legend className="air__legend--horizontal" />

      <Tabbar>
        <NavLink
          className={({ isActive }) =>
            `air__tabbar-link air__button air__button--label air__button--naked${isActive ? " air__button--active" : ""}`
          }
          aria-label="Map"
          end
          to="/"
          onClick={() =>
            location.pathname === "/"
              ? onUpdateStations()
              : dispatch(setFavboard(false))
          }
        >
          <svg
            className="air__button-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <use xlinkHref="#airSVGMap" />
          </svg>
          Karte
        </NavLink>
        {media === "small" && (
          <NavLink
            onClick={onSetFav}
            className={({ isActive }) =>
              `air__tabbar-link air__button air__button--label air__button--naked${!getActiveStations(stations).length ? " air__button--disabled" : ""}${isActive ? " air__button--active" : ""}`
            }
            aria-label="List"
            to="/favboard"
          >
            <svg
              className="air__button-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <use xlinkHref="#airSVGFavList" />
            </svg>
            Favoriten
          </NavLink>
        )}
        <Spacer />
        <NavLink
          className={({ isActive }) =>
            `air__tabbar-link air__button air__button--label air__button--naked${isActive ? " air__button--active" : ""}`
          }
          aria-label="Options Sheet"
          to={location.pathname === "/bottomsheet" ? "/" : "/bottomsheet"}
        >
          <svg
            className="air__button-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <use xlinkHref="#airSVGMoreVert" />
          </svg>
          Mehr
        </NavLink>
        <Button
          className="air__button air__button--naked air__button--fab air__button-location"
          aria-label="Get Location"
          clicked={handleLocation}
        >
          <LogoCool />
        </Button>
      </Tabbar>

      <AnimatePresence>
        {location.pathname === "/sidebar" && (
          <MotionSidebar
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.15, ease: [0.53, 0.04, 0.83, 0.88] }}
          >
            <Spacer />
            <Button
              className="air__button air__button--naked air__button--ghost"
              clicked={onUpdateStations}
            >
              <svg
                className="air__color-primary"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M11 8v5l4.25 2.52.77-1.28-3.52-2.09V8zm10 2V3l-2.64 2.64C16.74 4.01 14.49 3 12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9h-2c0 3.86-3.14 7-7 7s-7-3.14-7-7 3.14-7 7-7c1.93 0 3.68.79 4.95 2.05L14 10h7z" />
              </svg>
            </Button>
          </MotionSidebar>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {location.pathname === "/bottomsheet" && (
          <MotionBottomSheet
            className="air__options-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.15, ease: [0.53, 0.04, 0.83, 0.88] }}
          >
            <div className="air__options-sheet-scroll-container">
              <Flex className="air__flex air__flex--align-items-center air__padding-left--3 air__padding-right--3 air__padding-top--4 air__padding-bottom air__border-radius-top--2">
                <LogoCoolSimple className="air__margin-right" />
                <h3 className="air__letter-spacing air__color-primary air__margin-bottom--0 air__margin-top--0">
                  BadAirDay
                </h3>
                <Flex className="air__flex air__color-primary air__flex-grow--1 air__flex--justify-content-flex-end">
                  v{REACT_APP_VERSION}
                </Flex>
              </Flex>
              <ListHeader className="air__list-header air__list-header--sticky air__color-primary--active air__border-radius-top--2">
                Einstellungen
              </ListHeader>
              <List className="air__list air__border-radius-top--2">
                <ListItem className="air__list-item air__flex--justify-content-space-between">
                  <Toggle
                    className={`air__toggle ${options.reversegeo ? "air__toggle--active" : "air__toggle--inactive"}`}
                    clicked={() =>
                      dispatch(setOptionReversegeo(!options.reversegeo))
                    }
                  >
                    ReverseGeo
                    <small>Umwandlung der GPS-Daten in reale Adresse.</small>
                  </Toggle>
                </ListItem>
                <ListItem className="air__list-item air__flex--justify-content-space-between">
                  <Toggle
                    className={`air__toggle ${options.runaways ? "air__toggle--active" : "air__toggle--inactive"}`}
                    clicked={() =>
                      dispatch(setOptionRunaways(!options.runaways))
                    }
                  >
                    Runaways
                    <small>
                      Ausreißer (PM10 &gt;= 1999) werden ausgeblendet.
                    </small>
                  </Toggle>
                </ListItem>
                <ListItem className="air__list-item air__flex--justify-content-space-between">
                  <Toggle
                    className={`air__toggle ${options.sort ? "air__toggle--active" : "air__toggle--inactive"}`}
                    clicked={() => dispatch(setOptionSort(!options.sort))}
                  >
                    Sort<small>Sortierung anhand des PM10 Wertes.</small>
                  </Toggle>
                </ListItem>
                <ListItem className="air__list-item air__flex--justify-content-space-between">
                  <Toggle
                    className={`air__toggle ${options.autoupdating ? "air__toggle--active" : "air__toggle--inactive"}`}
                    clicked={() =>
                      dispatch(setOptionAutoupdating(!options.autoupdating))
                    }
                  >
                    Autoupdater
                    <small>
                      Alle 5 Minuten erfolgt automatisch ein Update.
                    </small>
                  </Toggle>
                </ListItem>
                <ListItem className="air__list-item air__flex--justify-content-space-between">
                  <Toggle
                    className={`air__toggle ${options.darkMode ? "air__toggle--active" : "air__toggle--inactive"}`}
                    clicked={() =>
                      dispatch(setOptionDarkMode(!options.darkMode))
                    }
                  >
                    Dark Mode<small>Dunkles Erscheinungsbild aktivieren.</small>
                  </Toggle>
                </ListItem>
              </List>
              {shareSection}
              <ListHeader className="air__list-header air__list-header--sticky air__color-primary--active">
                Handle With Care
              </ListHeader>
              <List className="air__list">
                <ListItem className="air__list-item">
                  <Button
                    className="air__button air__button--ghost air__button--full air__button--small air__margin-right"
                    clicked={onFetchStations}
                  >
                    <svg
                      className="air__button-icon air__color-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <use xlinkHref="#airSVGRefresh" />
                    </svg>
                    Fetch
                  </Button>
                  <Button
                    className="air__button air__button--ghost air__button--full air__button--small air__margin-left"
                    clicked={clearStorage}
                  >
                    <svg
                      className="air__button-icon air__color-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <use xlinkHref="#airSVGRestore" />
                    </svg>
                    Clear
                  </Button>
                </ListItem>
              </List>
            </div>
          </MotionBottomSheet>
        )}
      </AnimatePresence>

      {options.autoupdating && (
        <Updatebar interval={60 * 3 * 1000} update={onUpdateStations} />
      )}

      <AnimatePresence>
        {updating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Spinner />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <Spinner />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {geolocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <Loading>Geolocation</Loading>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notifications.length > 0 && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.15, ease: [0.53, 0.04, 0.83, 0.88] }}
          >
            <Notifications notifications={notifications} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
