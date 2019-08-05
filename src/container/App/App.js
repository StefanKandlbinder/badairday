import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, NavLink } from 'react-router-dom';
import PageVisibility from 'react-page-visibility';
import { CSSTransition } from 'react-transition-group';
import Media from 'react-media';

/**
 * ACTIONS
 */
import { STATIONS } from "../../redux/actions/stations";
import { fetchStations, favorizeStation, unfavorizeStation, notifyStation, unnotifyStation } from "../../redux/actions/stations";
import { setLocation } from "../../redux/actions/location";
import { setGeoLocation, setBottomSheet, setFavboard, setNoteboard, setMedia } from "../../redux/actions/ui";
import { setNotification } from "../../redux/actions/notifications";
import { setOptionAutoupdater } from "../../redux/actions/options";
import { setOptionReverseGeo } from "../../redux/actions/options";
import { setOptionRunaways } from "../../redux/actions/options";
import { setOptionSort } from "../../redux/actions/options";

/**
 * STORAGE
 */
import { clearState } from '../../redux/localStorage';

/**
 * SERVICES
 */
import getGeoLocation from '../../services/getGeoLocation';
import getWebShare from '../../services/getWebShare';

/**
 * FILTERS
 */
import { getFavorizedStations } from '../../redux/filters/getFavorizedStations';
import { getNotifiedStations } from '../../redux/filters/getNotifiedStations';

import SVGSprite from '../../components/UI/SVGSprite/SVGSprite';
import Stations from '../../components/Stations/Stations';
import BadAirDayNotifications from '../../services/Notifications/BadAirDayNotifications';
// import MapGLStations from '../../components/MapGLStations/MapGLStations';
// import DeckGLStations from '../../components/DeckGLStations/DeckGLStations';
import Station from '../../components/Station/Station';
import Dashboard from '../../components/Dashboard/Dashboard';
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
import Legend from '../../components/UI/Legend/Legend';
import Updatebar from "../../components/UI/Updatebar/Updatebar";

import './App.scss';

let luftdatenURL = "https://api.luftdaten.info/v1/filter/type=SDS011&area=48.323368,14.298756,50";
const luftdatenProvider = "luftdaten";
const upperAustriaURL = "https://www2.land-oberoesterreich.gv.at/imm/jaxrs/messwerte/json?";
const upperAustriaProvider = "upperaustria";

class App extends Component {
  constructor(props) {
    super(props);
    this.favboard = React.createRef();
    this.BadAirDayNotifications = new BadAirDayNotifications();

    this.state = {
      hasStations: false
    }
  }

  componentDidMount() {
    if (this.props.media === "medium" && getFavorizedStations(this.props.stations).length) {
      this.props.onSetFavboard({ state: true, feature: STATIONS });
    }

    if (!this.props.stations.length) {
      this.onFetchStations();
    }
    else {
      this.onUpdateStations();
    }

    this.setState({
      hasStations: true
    })
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeoutID);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.media === "medium" && this.props.media === "small") {
      this.props.onSetFavboard({ state: false, feature: STATIONS });
    }
    else if (this.props.media === "medium" && getFavorizedStations(this.props.stations).length) {
      this.props.onSetFavboard({ state: true, feature: STATIONS });
    }
  }

  clearStorage() {
    clearState();

    this.timeoutID = window.setTimeout(
      () => {
        this.props.history.push("/");
        window.location.reload(true);
      }, 2000);
  }

  onFetchStations = () => {
    this.props.onFetchStations(luftdatenURL, luftdatenProvider, "FETCH");
    this.props.onFetchStations(upperAustriaURL, upperAustriaProvider, "FETCH");
  }

  onUpdateStations = () => {
    this.props.onFetchStations(luftdatenURL, luftdatenProvider, "UPDATE");
    this.props.onFetchStations(upperAustriaURL, upperAustriaProvider, "UPDATE");
  }

  onResetPushFav = () => {
    this.props.onSetFavboard({ state: false, feature: STATIONS })
    this.props.onSetNoteboard({ state: false, feature: STATIONS })
  }

  onSetFav = () => {
    if (this.props.favboard && !this.props.noteboard) {
      this.onUpdateStations()
      this.props.onSetNoteboard({ state: false, feature: STATIONS })
    }
    if (this.props.noteboard) {
      this.props.onSetNoteboard({ state: false, feature: STATIONS })
    }
    
    this.props.onSetFavboard({ state: true, feature: STATIONS })
    
  }

  handleVisibilityChange = isVisible => {
    this.onUpdateStations();
  }

  handleLocation = () => {
    this.props.onSetGeoLocation({ state: true, feature: STATIONS });

    getGeoLocation().then((success, reject) => {
      this.props.onSetGeoLocation({ state: false, feature: STATIONS });
      this.props.onSetLocation(success);
      this.onUpdateStations();
    }).catch((e) => {
      this.props.onSetGeoLocation({ state: false, feature: STATIONS });
      this.props.onSetNotification({ message: e.message, feature: STATIONS, type: "info" });
    });
  }

  share = () => {
    const title = 'BadAirday';
    const text = 'Verfolgen Sie die aktuelle Luftqualität in ihrer Nähe';
    // const url =  'https://badairday.herokuapp.com/station/' + this.props.station.provider + "/" + this.props.station.id;
    const url = 'https://badairday.netlify.com/';

    getWebShare(title, text, url).then((success, reject) => {
      // this.props.onSetNotification({ message: "Ihr Beitrag wurde geteilt.", feature: STATIONS, type: "success" });
    }).catch((error) => {
      this.props.onSetNotification({ message: error.message, feature: STATIONS, type: "info" });
    });
  }

  render() {
    let sidebar = null;
    let optionsSheet = null;
    let shareSection = null;
    let favboard = null;
    let noteboard = null;
    // let mapgl = null;
    let tabbar = null;
    let updateBar = null;
    let background = null;
    let app = null;

    if (navigator.share) {
      shareSection = <React.Fragment>
        <ListHeader className="air__list-header air__list-header--sticky air__color-primary--active air__border-radius-top--2">Social</ListHeader>
        <List className="air__list air__border-radius-top--2">
          <ListItem className="air__list-item air__flex--justify-content-space-between">
            Teile mich
              <Button clicked={this.share} className="air__button air__button--naked air__button--ghost air__bottom-sheet-button air__bottom-button-share">
              <svg xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="air__bottom-sheet-button-icon">
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
              </svg>
            </Button>
          </ListItem>
        </List>
      </React.Fragment>
    }

    sidebar = <Sidebar>
      <Spacer />
      <Button
        className="air__button air__button--naked air__button--ghost"
        aria-label=""
        clicked={() => this.onUpdateStations()}>
        <svg className="air__color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><path id="a" d="M0 0h24v24H0z" /></defs><clipPath><use href="#a" overflow="visible" /></clipPath><path d="M11 8v5l4.25 2.52.77-1.28-3.52-2.09V8zm10 2V3l-2.64 2.64C16.74 4.01 14.49 3 12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9h-2c0 3.86-3.14 7-7 7s-7-3.14-7-7 3.14-7 7-7c1.93 0 3.68.79 4.95 2.05L14 10h7z" /></svg>
      </Button>
      <Button
        className="air__button air__button--naked air__button--ghost"
        clicked={() => this.onFetchStations()}>
        <svg className="air__color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M13 3c-4.97 0-9 4.03-9 9H1l4 3.99L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z" /></svg>
      </Button>
      <Button
        className="air__button air__button--naked air__button--ghost"
        clicked={() => this.clearStorage()}>
        <svg className="air__color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" /></svg>
      </Button>
    </Sidebar>

    optionsSheet = <BottomSheet className={`air__options-sheet ${this.props.media === "medium" ? "" : ""}`}>
      <div className="air__options-sheet-scroll-container">
        <Flex className="air__flex air__flex--align-items-center air__padding-left--3 air__padding-right--3 air__padding-top--4 air__padding-bottom air__border-radius-top--2">
          <svg className="air__color-text air__margin-right" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <use xlinkHref="#airSVGLogoCoolSimple"></use>
          </svg>
          <h3 className="air__letter-spacing air__color-primary air__margin-bottom--0 air__margin-top--0">BadAirDay</h3>
        </Flex>
        <ListHeader className="air__list-header air__list-header--sticky air__color-primary--active air__border-radius-top--2">Einstellungen</ListHeader>
        <List className="air__list air__border-radius-top--2">
          <ListItem className="air__list-item air__flex--justify-content-space-between">
            <Toggle
              className={`air__toggle ${this.props.options.reversegeo ? "air__toggle--active" : "air__toggle--inactive"}`}
              clicked={() => this.props.onSetOptionReverseGeo({ state: this.props.options.reversegeo ? false : true, feature: STATIONS })}>
              ReverseGeo
              <small>Umwandlung der GPS-Daten in reale Adresse.</small>
            </Toggle>
          </ListItem>
          <ListItem className="air__list-item air__flex--justify-content-space-between">
            <Toggle
              className={`air__toggle ${this.props.options.runaways ? "air__toggle--active" : "air__toggle--inactive"}`}
              clicked={() => this.props.onSetOptionRunaways({ state: this.props.options.runaways ? false : true, feature: STATIONS })}>
              Runaways
              <small>Ausreißer(PM10 >= 1999) werden ausgeblendet.</small>
            </Toggle>
          </ListItem>
          <ListItem className="air__list-item air__flex--justify-content-space-between">
            <Toggle className={`air__toggle ${this.props.options.sort ? "air__toggle--active" : "air__toggle--inactive"}`}
              clicked={() => this.props.onSetOptionSort({ state: this.props.options.sort ? false : true, feature: STATIONS })}>
              Sort
              <small>Sortierung anhand des PM10 Wertes.</small>
            </Toggle>
          </ListItem>
          <ListItem className="air__list-item air__flex--justify-content-space-between">
            <Toggle className={`air__toggle ${this.props.options.autoupdating ? "air__toggle--active" : "air__toggle--inactive"}`}
              clicked={() => this.props.onSetOptionAutoupdater({ state: this.props.options.autoupdating ? false : true, feature: STATIONS })}>
              Autoupdater
              <small>Alle 5 Minuten erfolgt automatisch ein Update.</small>
            </Toggle>
          </ListItem>
        </List>
        {shareSection}
        <ListHeader className="air__list-header air__list-header--sticky air__color-primary--active">Handle With Care</ListHeader>
        <List className="air__list">
          <ListItem className="air__list-item">
            <Button
              className="air__button air__button--ghost air__button--full air__button--small air__margin-right"
              clicked={() => this.onFetchStations()}>
              <svg className="air__button-icon air__color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <use xlinkHref="#airSVGRefresh"></use>
              </svg>
              Fetch
            </Button>
            <Button
              className="air__button air__button--ghost air__button--full air__button--small air__margin-left"
              clicked={() => this.clearStorage()}>
              <svg className="air__button-icon air__color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <use xlinkHref="#airSVGRestore"></use>
              </svg>
              Clear
            </Button>
          </ListItem>
        </List>
      </div>
    </BottomSheet>

    tabbar = <Tabbar>
      <NavLink
        className="air__tabbar-link air__button air__button--label air__button--naked"
        aria-label="Map"
        activeClassName="air__button--active"
        exact to={"/"}
        onClick={() => this.props.history.location.pathname === "/" ? this.onUpdateStations() : this.onResetPushFav()}>
        <svg className="air__button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <use xlinkHref="#airSVGMap"></use>
        </svg>
        Karte
      </NavLink>
      {this.props.media === "small"
        ? <NavLink
          onClick={this.onSetFav}
          className={`air__tabbar-link air__button air__button--label air__button--naked ${!getFavorizedStations(this.props.stations).length ? "air__button--inactive" : ""}`}
          aria-label="List"
          activeClassName="air__button--active"
          to={"/favboard"}>
          <svg className="air__button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <use xlinkHref="#airSVGFavList"></use>
          </svg>
          Favoriten
        </NavLink>
        : null
      }
      <Spacer className="air__bg-color-text" />
      {/*<NavLink
        className="air__tabbar-link air__button air__button--naked"
        aria-label="Map"
        activeClassName="air__button--active"
        exact to={"/mapgl"}
        onClick={() => this.props.history.location.pathname === "/mapgl" ? this.onUpdateStations() : this.props.onSetFavboard({ state: false, feature: STATIONS })}>
        <svg className="air__button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <use xlinkHref="#airSVGMap"></use>
        </svg>
      </NavLink>*/}
      {('Notification' in window && navigator.serviceWorker) ?
        <NavLink
          onClick={() => this.props.noteboard ? this.onUpdateStations() : this.props.onSetNoteboard({ state: true, feature: STATIONS })}
          className={`air__tabbar-link air__button air__button--label air__button--naked ${!getNotifiedStations(this.props.stations).length ? "air__button--inactive" : ""}`}
          aria-label="List"
          activeClassName="air__button--active"
          to={"/noteboard"}>
          <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="air__button-icon"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="1">
            <use xlinkHref="#airSVGNotify"></use>
          </svg>
          Push
        </NavLink>
        : null
      }
      <NavLink
        className="air__tabbar-link air__button air__button--label air__button--naked"
        aria-label="Options Sheet"
        activeClassName="air__button--active"
        to={this.props.history.location.pathname === "/bottomsheet" ? "/" : "/bottomsheet"}>
        <svg className="air__button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <use xlinkHref="#airSVGMoreVert"></use>
        </svg>
        Mehr
      </NavLink>
    </Tabbar>

    favboard = <div className="air__site air__site--favboard"
      onTouchStart={(e) => {
        if (this.props.media === "small") {
          this.props.history.push("/favboard");
        }
        this.favboard.current.focus();
      }}
      ref={this.favboard}>
      <Dashboard 
        stations={this.props.stations}
        options={this.props.options}
        onSet={this.props.onSetFavboard}
        onAdd={this.props.onFavorizeStation}
        onRemove={this.props.onUnfavorizeStation}
        getActive={getFavorizedStations}
        type = "favorized" />
    </div>;

    noteboard = <div className="air__site air__site--favboard">
      <Dashboard 
        stations={this.props.stations}
        options={this.props.options}
        onSet={this.props.onSetNoteboard}
        onAdd={this.props.onNotifyStation}
        onRemove={this.props.onUnnotifyStation}
        getActive={getNotifiedStations}
        type = "notify" />
    </div>;

    /* mapgl = <div className="air__site">
      <DeckGLStations stations={this.props.stations}
        position={this.props.position} />
    </div> */

    if (this.props.options.autoupdating) {
      updateBar = <Updatebar interval={60 * 3 * 1000} update={this.onUpdateStations} />
    }

    if (this.props.positon) {
      luftdatenURL = "https://api.luftdaten.info/v1/filter/type=SDS011&area=" +
        this.props.positon.lat +
        "," +
        this.props.positon.lng + ",50";
    }

    background = <div className="air__background"></div>;
    background = null;

    if (this.props.stations) {
      app = <React.Fragment>
        <Stations stations={this.props.stations}
          options={this.props.options}
          update={this.props.update}
          media={this.props.media}
          position={this.props.position}
          favboard={this.props.favboard}
          noteboard={this.props.noteboard}
          onSetFavboard={this.props.onSetFavboard}
          onSetNoteboard={this.props.onSetNoteboard}/>
        <Route
          path="/station/:provider/:id"
          render={() =>
            <Station 
              media={this.props.media}
              favboard={this.props.favboard}
              noteboard={this.props.noteboard}
              onSetFavboard={this.props.onSetFavboard}
              onSetNoteboard={this.props.onSetNoteboard} />
          } />
      </React.Fragment>
    }

    return (
      <PageVisibility onChange={this.handleVisibilityChange}>
        <div className={this.props.favboard ? "air air--favboard" : "air"}>
          <SVGSprite />

          {background}

          <CSSTransition
            in={this.state.hasStations}
            timeout={300}
            classNames="air__animation-fade"
            mountOnEnter
            unmountOnExit>
            {app}
          </CSSTransition>

          {/*<CSSTransition
            in={this.props.history.location.pathname === "/mapgl" ? true : false}
            classNames="air__animation-site-transition"
            timeout={300}
            mountOnEnter
            unmountOnExit>
            {mapgl}
          </CSSTransition>*/}

          <Media
            query="(min-width: 768px) and (orientation: landscape)"
            onChange={matches =>
              matches
                ? this.props.onSetMedia({ state: "medium", feature: STATIONS })
                : this.props.onSetMedia({ state: "small", feature: STATIONS })
            }
          />

          <CSSTransition
            in={this.props.favboard}
            // in={this.props.media === "medium" ? true : false}
            classNames="air__animation-site-transition"
            timeout={300}
            mountOnEnter
            unmountOnExit>
            {favboard}
          </CSSTransition>

          <CSSTransition
            in={this.props.noteboard}
            // in={this.props.media === "medium" ? true : false}
            classNames="air__animation-site-transition"
            timeout={300}
            mountOnEnter
            unmountOnExit>
            {noteboard}
          </CSSTransition>

          <Button
            className="air__button air__button--naked air__button--fab air__button-location"
            aria-label="Get Location"
            clicked={() => this.handleLocation()}>
            <svg className="air__color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <use xlinkHref="#airSVGLogoCool"></use>
            </svg>
          </Button>

          <Legend className="air__legend--horizontal" />

          {tabbar}

          <CSSTransition
            in={this.props.history.location.pathname === "/sidebar" ? true : false}
            classNames="air__animation-sidebar"
            timeout={300}
            mountOnEnter
            unmountOnExit>
            {sidebar}
          </CSSTransition>

          <CSSTransition
            in={this.props.history.location.pathname === "/bottomsheet" ? true : false}
            classNames="air__animation-bottom-sheet"
            timeout={300}
            mountOnEnter
            unmountOnExit>
            {optionsSheet}
          </CSSTransition>

          {updateBar}

          <CSSTransition
            in={this.props.updating}
            classNames="air__animation-fade"
            timeout={300}
            mountOnEnter
            unmountOnExit>
            <Spinner />
          </CSSTransition>

          <CSSTransition
            in={this.props.loading}
            classNames="air__animation-fade-crunchy"
            timeout={300}
            mountOnEnter
            unmountOnExit>
            <Spinner />
          </CSSTransition>

          <CSSTransition
            in={this.props.geolocation}
            classNames="air__animation-fade-crunchy"
            timeout={150}
            mountOnEnter
            unmountOnExit>
            <Loading>Geolocation</Loading>
          </CSSTransition>

          <CSSTransition
            in={this.props.notifications.length > 0}
            classNames="air__animation-notification"
            timeout={300}
            mountOnEnter
            unmountOnExit>
            <Notifications notifications={this.props.notifications} />
          </CSSTransition>
        </div>
      </PageVisibility>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.ui.loading,
    updating: state.ui.updating,
    geolocation: state.ui.geolocation,
    bottomsheet: state.ui.bottomsheet,
    favboard: state.ui.favboard,
    noteboard: state.ui.noteboard,
    media: state.ui.media,
    position: state.location,
    notifications: state.notifications,
    update: state.update,
    stations: state.stations,
    options: state.options
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchStations: (url, luftdatenProvider, method) => dispatch(fetchStations(url, luftdatenProvider, method)),
    onSetLocation: (location) => dispatch(setLocation(location)),
    onFavorizeStation: (id) => dispatch(favorizeStation(id)),
    onUnfavorizeStation: (id) => dispatch(unfavorizeStation(id)),
    onNotifyStation: (id) => dispatch(notifyStation(id)),
    onUnnotifyStation: (id) => dispatch(unnotifyStation(id)),
    onSetGeoLocation: (geoLocation) => dispatch(setGeoLocation(geoLocation)),
    onSetBottomSheet: (bottomSheet) => dispatch(setBottomSheet(bottomSheet)),
    onSetMedia: (media) => dispatch(setMedia(media)),
    onSetFavboard: (favboard) => dispatch(setFavboard(favboard)),
    onSetNoteboard: (noteboard) => dispatch(setNoteboard(noteboard)),
    onSetOptionAutoupdater: (autoupdater) => dispatch(setOptionAutoupdater(autoupdater)),
    onSetOptionReverseGeo: (reversegeo) => dispatch(setOptionReverseGeo(reversegeo)),
    onSetOptionRunaways: (runaways) => dispatch(setOptionRunaways(runaways)),
    onSetOptionSort: (sort) => dispatch(setOptionSort(sort)),
    onSetNotification: (message) => dispatch(setNotification(message))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));