import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, NavLink } from 'react-router-dom';
import PageVisibility from 'react-page-visibility';
import { CSSTransition } from 'react-transition-group';

import { STATIONS } from "../../redux/actions/stations";
import { fetchStations } from "../../redux/actions/stations";
import { setLocation } from "../../redux/actions/location";
import { setGeoLocation, setBottomSheet } from "../../redux/actions/ui";
import { setNotification } from "../../redux/actions/notifications";
import { setOptionAutoupdater } from "../../redux/actions/options";
import { setOptionReverseGeo } from "../../redux/actions/options";
import { setOptionRunaways } from "../../redux/actions/options";
import { setOptionSort } from "../../redux/actions/options";
import { clearState } from '../../redux/localStorage';

import getGeoLocation from '../../services/getGeoLocation';
import { getFavorizedStations } from '../../redux/filters/getFavorizedStations';

import Stations from '../../components/Stations/Stations';
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

    this.state = {
      hasStations: false
    }
  }
  componentDidMount() {
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

  render() {
    let stations = null;
    let station = null;
    let map = null;
    let sidebar = null;
    let optionsSheet = null;
    let dashboard = null;
    let tabbar = null;
    let updateBar = null;
    let background = null;
    let app = null;

    stations = <Stations />

    station = <Route
      path="/station/:provider/:id"
      render={() =>
        <Station />
      } />

    sidebar = <Sidebar>
      <Spacer />
      <Button
        className="air__button air__button--naked air__button--ghost"
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

    optionsSheet = <BottomSheet className="air__options-sheet">
      <Flex className="air__flex air__flex--align-items-flex-end air__padding-left--3 air__padding-right--3 air__padding-top--4">
        <svg className="air__margin-right" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="12" y1="3.0012" x2="12" y2="20.9988">
            <stop offset="0" stopColor="#dd1800" />
            <stop offset=".5143" stopColor="#eeb600" />
            <stop offset="1" stopColor="#00796b" />
          </linearGradient>
          <path d="M12 4.2c.2 0 .3.1.4.3l7.3 14.6c.2.3-.1.7-.4.7-.1 0-.1 0-.2-.1l-6.9-3.4h-.4l-6.9 3.4c-.1 0-.1.1-.2.1-.3 0-.6-.3-.4-.7l7.3-14.6c.1-.2.2-.3.4-.3M7 17.4c.1 0 .1 0 .2-.1l4.5-2.2c.2-.1.3-.2.3-.4V7.9c0-.3-.2-.5-.5-.5-.2 0-.3.1-.4.3l-4.5 9c-.1.3.1.7.4.7M12 3c-.6 0-1.2.4-1.5.9L3.2 18.5c-.3.5-.2 1.1.1 1.6.3.6.8.9 1.4.9.3 0 .5-.1.8-.2l6.5-3.3 6.5 3.3c.2.1.5.2.8.2.6 0 1.1-.3 1.4-.8.3-.5.3-1.1.1-1.6L13.5 3.9c-.3-.5-.9-.9-1.5-.9zM8.8 15.2l2-4v3l-2 1z" fill="url(#c)" />
        </svg>
        <h3 className="air__letter-spacing air__color-primary air__margin-bottom--0 air__margin-top--0">BadAirDay</h3>
      </Flex>
      <ListHeader className="air__list-header air__list-header--sticky air__color-primary--active">Einstellungen</ListHeader>
      <List className="air__list">
        <ListItem className="air__list-item air__flex--justify-content-space-between">
          <Toggle
            className={`air__toggle ${this.props.options.reversegeo ? "air__toggle--active" : "air__toggle--inactive"}`}
            clicked={() => this.props.onSetOptionReverseGeo({ state: this.props.options.reversegeo ? false : true, feature: STATIONS })}>
            ReverseGeo
          </Toggle>
        </ListItem>
        <ListItem className="air__list-item air__flex--justify-content-space-between">
          <Toggle
            className={`air__toggle ${this.props.options.runaways ? "air__toggle--active" : "air__toggle--inactive"}`}
            clicked={() => this.props.onSetOptionRunaways({ state: this.props.options.runaways ? false : true, feature: STATIONS })}>
            Runaways
          </Toggle>
        </ListItem>
        <ListItem className="air__list-item air__flex--justify-content-space-between">
          <Toggle className={`air__toggle ${this.props.options.sort ? "air__toggle--active" : "air__toggle--inactive"}`}
            clicked={() => this.props.onSetOptionSort({ state: this.props.options.sort ? false : true, feature: STATIONS })}>
            Sort
          </Toggle>
        </ListItem>
        <ListItem className="air__list-item air__flex--justify-content-space-between">
          <Toggle className={`air__toggle ${this.props.options.autoupdating ? "air__toggle--active" : "air__toggle--inactive"}`}
            clicked={() => this.props.onSetOptionAutoupdater({ state: this.props.options.autoupdating ? false : true, feature: STATIONS })}>
            Autoupdater
          </Toggle>
        </ListItem>
      </List>
      <ListHeader className="air__list-header air__list-header--sticky air__color-primary--active">Admin</ListHeader>
      <List className="air__list">
        <ListItem className="air__list-item">
          <Button
            className="air__button air__button--ghost air__button--full air__button--small air__margin-right"
            clicked={() => this.onFetchStations()}>
            <svg className="air__button-icon air__color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M13 3c-4.97 0-9 4.03-9 9H1l4 3.99L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z" /></svg>
            Fetch
          </Button>
          <Button
            className="air__button air__button--ghost air__button--full air__button--small air__margin-left"
            clicked={() => this.clearStorage()}>
            <svg className="air__button-icon air__color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" /></svg>
            Clear
          </Button>
        </ListItem>
      </List>
    </BottomSheet>

    tabbar = <Tabbar>
      <NavLink
        className="air__tabbar-link air__button air__button--naked"
        activeClassName="air__button--active"
        exact to={"/"}
        onClick={() => this.props.history.location.pathname === "/" ? this.onUpdateStations() : null}>
        <svg className="air__button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z" /></svg>
      </NavLink>
      <NavLink
        onClick={() => this.props.history.location.pathname === "/dashboard" ? this.onUpdateStations() : null}
        className={`air__tabbar-link air__button air__button--naked ${!getFavorizedStations(this.props.stations).length ? "air__button--inactive" : ""}`}
        activeClassName="air__button--active"
        to={"/dashboard"}>
        <svg className="air__button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M3 8.4h14.3v2.4H3V8.4zm0-4.7h14.3v2.4H3V3.7zm0 9.5h9.5v2.4H3v-2.4zM17.4 12.1l1.1 2.1.1.1 2.4.3c.1 0 .1.1.1.1v.1l-1.7 1.7v.1l.4 2.3c0 .1 0 .1-.1.2h-.1L17.3 18h-.1l-2.1 1.1c-.1 0-.1 0-.2-.1v-.1l.4-2.3v-.1l-1.7-1.7c-.1-.1-.1-.1 0-.2h.1l2.4-.3s.1 0 .1-.1l1.1-2.1c-.1-.1 0-.1.1 0-.1-.1 0-.1 0 0zM3 17.9h10.9v2.4H3z" /></svg>
      </NavLink>
      <Spacer className="air__bg-color-text" />
      <NavLink
        className="air__tabbar-link air__button air__button--naked"
        activeClassName="air__button--active"
        to={this.props.history.location.pathname === "/bottomsheet" ? "/" : "/bottomsheet"}>
        <svg className="air__button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
      </NavLink>
    </Tabbar>

    dashboard = <div className="air__site"><Dashboard stations={this.props.stations} options={this.props.options} /></div>;

    if (this.props.options.autoupdating) {
      updateBar = <Updatebar interval={60 * 3 * 1000} update={this.onUpdateStations} />
    }

    if (this.props.location) {
      luftdatenURL = "https://api.luftdaten.info/v1/filter/type=SDS011&area=" +
        this.props.location.lat +
        "," +
        this.props.location.lng + ",50";
    }

    if (this.props.stations) {
      stations = <Stations stations={this.props.stations} options={this.props.options} />;
    }

    background = <div className="air__background">
      <svg className="air__background-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="12" y1="3.0012" x2="12" y2="20.9988">
          <stop offset="0" stopColor="#dd1800" />
          <stop offset=".5143" stopColor="#eeb600" />
          <stop offset="1" stopColor="#00796b" />
        </linearGradient>
        <path d="M12 4.2c.2 0 .3.1.4.3l7.3 14.6c.2.3-.1.7-.4.7-.1 0-.1 0-.2-.1l-6.9-3.4h-.4l-6.9 3.4c-.1 0-.1.1-.2.1-.3 0-.6-.3-.4-.7l7.3-14.6c.1-.2.2-.3.4-.3M7 17.4c.1 0 .1 0 .2-.1l4.5-2.2c.2-.1.3-.2.3-.4V7.9c0-.3-.2-.5-.5-.5-.2 0-.3.1-.4.3l-4.5 9c-.1.3.1.7.4.7M12 3c-.6 0-1.2.4-1.5.9L3.2 18.5c-.3.5-.2 1.1.1 1.6.3.6.8.9 1.4.9.3 0 .5-.1.8-.2l6.5-3.3 6.5 3.3c.2.1.5.2.8.2.6 0 1.1-.3 1.4-.8.3-.5.3-1.1.1-1.6L13.5 3.9c-.3-.5-.9-.9-1.5-.9zM8.8 15.2l2-4v3l-2 1z" fill="url(#c)" />
      </svg>
    </div>;

    map = <React.Fragment>
      {stations}
      {station}
      <Button
        className="air__button air__button--naked air__button--fab air__button-location"
        clicked={() => this.handleLocation()}>
        <svg className="air__color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V2c0-.55-.45-1-1-1s-1 .45-1 1v1.06C6.83 3.52 3.52 6.83 3.06 11H2c-.55 0-1 .45-1 1s.45 1 1 1h1.06c.46 4.17 3.77 7.48 7.94 7.94V22c0 .55.45 1 1 1s1-.45 1-1v-1.06c4.17-.46 7.48-3.77 7.94-7.94H22c.55 0 1-.45 1-1s-.45-1-1-1h-1.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" /></svg>
      </Button>
      <Legend />
      {tabbar}
      {updateBar}
    </React.Fragment>

    app = <React.Fragment>
      <CSSTransition
        in={this.state.hasStations}
        timeout={300}
        classNames="air__animation-fade"
        mountOnEnter
        unmountOnExit>
        {map}
      </CSSTransition>

      <CSSTransition
        in={this.props.history.location.pathname === "/dashboard" ? true : false}
        classNames="air__animation-site-transition"
        timeout={300}
        mountOnEnter
        unmountOnExit>
        {dashboard}
      </CSSTransition>

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
    </React.Fragment>

    return (
      <PageVisibility onChange={this.handleVisibilityChange}>
        <div className="air">
          {background}
          {app}
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
    location: state.location,
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
    onSetGeoLocation: (geoLocation) => dispatch(setGeoLocation(geoLocation)),
    onSetBottomSheet: (bottomSheet) => dispatch(setBottomSheet(bottomSheet)),
    onSetOptionAutoupdater: (autoupdater) => dispatch(setOptionAutoupdater(autoupdater)),
    onSetOptionReverseGeo: (reversegeo) => dispatch(setOptionReverseGeo(reversegeo)),
    onSetOptionRunaways: (runaways) => dispatch(setOptionRunaways(runaways)),
    onSetOptionSort: (sort) => dispatch(setOptionSort(sort)),
    onSetNotification: (message) => dispatch(setNotification(message))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));