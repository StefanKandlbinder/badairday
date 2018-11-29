import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, NavLink } from 'react-router-dom';
import PageVisibility from 'react-page-visibility';
import { CSSTransition } from 'react-transition-group';

import { STATIONS } from "../../redux/actions/stations";
import { fetchStations } from "../../redux/actions/stations";
import { setLocation } from "../../redux/actions/location";
import { setGeoLocation } from "../../redux/actions/ui";
import { setSidebar } from "../../redux/actions/ui";
import { setNotification } from "../../redux/actions/notifications";
import { clearState } from '../../redux/localStorage';

import getGeoLocation from '../../services/getGeoLocation';

// import Stations from "../../components/dashboard/Stations/Stations";
import Stations from '../../components/Stations/Stations';
import Station from '../../components/Station/Station';
import Notifications from "../../components/UI/Notifications/Notifications";
import Button from "../../components/UI/Button/Button";
import Tabbar from "../../components/UI/Tabbar/Tabbar";
import Loading from "../../components/UI/Loading/Loading";
import Spinner from "../../components/UI/Spinner/Spinner";
import Spacer from "../../components/UI/Spacer/Spacer";
import Sidebar from "../../components/UI/Sidebar/Sidebar";
import BottomSheet from "../../components/UI/BottomSheet/BottomSheet";
import Flex from "../../components/UI/Flex/Flex";
import Legend from '../../components/UI/Legend/Legend';
import Updatebar from "../../components/UI/Updatebar/Updatebar";

import './App.scss';

let luftdatenURL = "https://api.luftdaten.info/v1/filter/type=SDS011&area=48.323368,14.298756,10";
const luftdatenProvider = "luftdaten";
const upperAustriaURL = "https://www2.land-oberoesterreich.gv.at/imm/jaxrs/messwerte/json?";
const upperAustriaProvider = "upperaustria";

const Dashboard = (props) => (
  <div className="air__dashboard">Dashboard</div>
);

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

    this.timeoutID = window.setTimeout(window.location.reload(true), 1000);
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
    let sidebar = null;
    let bottomSheet = null;
    let tabbar = null;
    let updateBar = null;
    let background = null;
    let app = null;

    stations = <Stations />

    station = <Route
      path="/station/:provider/:id"
      render={() => <Station />} />

    sidebar = <Sidebar>
      <Spacer />
      <div>
        <Button
          className="air__button air__button--naked air__button--ghost"
          clicked={() => this.onUpdateStations()}>
          <svg className="color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><path id="a" d="M0 0h24v24H0z" /></defs><clipPath><use href="#a" overflow="visible" /></clipPath><path d="M11 8v5l4.25 2.52.77-1.28-3.52-2.09V8zm10 2V3l-2.64 2.64C16.74 4.01 14.49 3 12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9h-2c0 3.86-3.14 7-7 7s-7-3.14-7-7 3.14-7 7-7c1.93 0 3.68.79 4.95 2.05L14 10h7z" /></svg>
        </Button>
        <Button
          className="air__button air__button--naked air__button--ghost"
          clicked={() => this.onFetchStations()}>
          <svg className="color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M13 3c-4.97 0-9 4.03-9 9H1l4 3.99L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z" /></svg>
        </Button>
        <Button
          className="air__button air__button--naked air__button--ghost"
          clicked={() => this.clearStorage()}>
          <svg className="color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" /></svg>
        </Button>
      </div>
    </Sidebar>

    bottomSheet = <BottomSheet>
      <h5 className="color-primary">Settings</h5>
      <Flex className="air__flex--justify-content-space-around">
        <Button
          className="air__button air__button--naked air__button--ghost"
          clicked={() => this.onFetchStations()}>
          <svg className="color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M13 3c-4.97 0-9 4.03-9 9H1l4 3.99L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z" /></svg>
          Fetch
            </Button>
        <Button
          className="air__button air__button--naked air__button--ghost"
          clicked={() => this.clearStorage()}>
          <svg className="color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" /></svg>
          Clear
        </Button>
      </Flex>
    </BottomSheet>

    tabbar = <Tabbar>
      <NavLink
        className="air__tabbar-link air__button air__button--naked air__button--ghost"
        activeClassName="air__tabbar-link--active"
        exact to={"/"}
        onClick={() => this.onUpdateStations()}>
        <svg className="color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z" /></svg>
      </NavLink>
      <NavLink
        className="air__tabbar-link air__button air__button--naked air__button--ghost air__button--inactive"
        activeClassName="air__tabbar-link--active"
        style={{ pointerEvents: "none" }}
        to={this.props.history.location.pathname === "/dashboard" ? "/" : "/dashboard"}>
        <svg className="color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" /></svg>
      </NavLink>
      <Spacer />
      <NavLink
        className="air__tabbar-link air__button air__button--naked air__button--ghost"
        activeClassName="air__tabbar-link--active"
        to={this.props.history.location.pathname === "/bottomsheet" ? "/" : "/bottomsheet"}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
      </NavLink>
    </Tabbar>

    if (this.props.options.autoupdating) {
      updateBar = <Updatebar interval={60 * 3 * 1000} update={this.onUpdateStations} />
    }

    if (this.props.location) {
      luftdatenURL = "https://api.luftdaten.info/v1/filter/type=SDS011&area=" +
        this.props.location.lat +
        "," +
        this.props.location.lng + ",10";
    }

    if (this.props.stations) {
      stations = <Stations stations={this.props.stations} options={this.props.options} />;
    }

    background = <div className="air__background">
      <svg className="air__background-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 600 600">
        <path d="M289.3 103.1L98.7 484.2c-5.2 10.3 5.8 21.3 16.1 16.1l179.8-89.9c3.4-1.7 7.4-1.7 10.7 0l179.8 89.9c10.3 5.2 21.3-5.8 16.1-16.1L310.7 103.1c-4.4-8.9-17-8.9-21.4 0zm4.1 276.4l-117.2 58.6c-10.3 5.2-21.3-5.8-16.1-16.1l117.2-234.3c5.7-11.3 22.7-7.3 22.7 5.4v175.8c0 4.4-2.6 8.6-6.6 10.6z" fill="#fff" /></svg>
    </div>;

    background = null;

    app = <div>
      {station}
      {stations}
    </div>;

    return (
      <PageVisibility onChange={this.handleVisibilityChange}>
        <div className="air">
          {background}

          <CSSTransition
            in={this.state.hasStations}
            timeout={300}
            classNames="air__animation-fade"
            mountOnEnter
            unmountOnExit>
            {app}
          </CSSTransition>

          <CSSTransition
            in={this.props.history.location.pathname === "/dashboard" ? true : false}
            classNames="air__animation-site-transition"
            timeout={300}
            mountOnEnter
            unmountOnExit>
            <Route
              path="/dashboard"
              render={() => <Dashboard />} />
          </CSSTransition>

          <Button
            className="air__button air__button--naked air__button--fab air__button-location"
            clicked={() => this.handleLocation()}>
            <svg className="color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V2c0-.55-.45-1-1-1s-1 .45-1 1v1.06C6.83 3.52 3.52 6.83 3.06 11H2c-.55 0-1 .45-1 1s.45 1 1 1h1.06c.46 4.17 3.77 7.48 7.94 7.94V22c0 .55.45 1 1 1s1-.45 1-1v-1.06c4.17-.46 7.48-3.77 7.94-7.94H22c.55 0 1-.45 1-1s-.45-1-1-1h-1.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" /></svg>
          </Button>
          <Legend />
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
            {bottomSheet}
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
            timeout={300}
            mountOnEnter
            unmountOnExit>
            <Loading>Geolocation ...</Loading>
          </CSSTransition>

          <CSSTransition
            in={this.props.notifications.length > 0}
            classNames="air__animation-fade-crunchy"
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
    sidebar: state.ui.sidebar,
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
    onSetSidebar: (sidebar) => dispatch(setSidebar(sidebar)),
    onSetNotification: (message) => dispatch(setNotification(message))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));