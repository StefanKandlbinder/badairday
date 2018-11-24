import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import PageVisibility from 'react-page-visibility';
import { CSSTransition } from 'react-transition-group';

import { fetchStations } from "../../redux/actions/stations";
import { setLocation } from "../../redux/actions/location";
import { clearState } from '../../redux/localStorage';

import getGeoLocation from '../../utilities/getGeoLocation';

// import Stations from "../../components/dashboard/Stations/Stations";
import Stations from '../../components/Stations/Stations';
import Station from '../../components/Station/Station';
import Notifications from "../../components/UI/Notifications/Notifications";
import Button from "../../components/UI/Button/Button";
import Spacer from "../../components/UI/Spacer/Spacer";
import Legend from '../../components/UI/Legend/Legend';
import Updatebar from "../../components/UI/Updatebar/Updatebar";
import './App.css';

const luftdatenURL = "https://api.luftdaten.info/v1/filter/type=SDS011&area=48.323368,14.298756,10";
const luftdatenProvider = "luftdaten";
const upperAustriaURL = "https://www2.land-oberoesterreich.gv.at/imm/jaxrs/messwerte/json?";
const upperAustriaProvider = "upperaustria";

class Updating extends Component {
  render() {
    return <div className="air__updating">Updating ...</div>
  }
}

class Loading extends Component {
  render() {
    return <div className="air__loading">Fetching ...</div>
  }
}

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
    getGeoLocation().then((success, reject) => {
      console.log(success);
      this.props.onSetLocation(success);
    });
}

  render() {
    let stations = null;
    let station = null;
    let updateBar = null;
    let background = null;
    let app = null;

    stations = <Stations />

    station = <Route
      path="/station/:provider/:id"
      render={() => <Station />} />

    if (this.props.options.autoupdating) {
      updateBar = <Updatebar interval={60 * 3 * 1000} update={this.onUpdateStations} />
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

          <div className="air__button-group">
            <Button
              className="air__button air__button--naked air__button--ghost"
              clicked={() => this.onUpdateStations()}>
              <svg className="color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z" /></svg>
            </Button>
            <Button
              className="air__button air__button--naked air__button--ghost"
              clicked={() => this.onUpdateStations()}>
              <svg className="color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" /></svg>
            </Button>
            <Spacer className="air__spacer" />
            <Button
              className="air__button air__button--naked air__button--ghost"
              clicked={() => this.onFetchStations()}>
              FETCH
            </Button>
            <Button
              className="air__button air__button--naked air__button--ghost"
              clicked={() => this.onUpdateStations()}>
              UPDATE
            </Button>
            <Button
              className="air__button air__button--naked air__button--ghost"
              clicked={() => this.clearStorage()}>
              CLEAR
            </Button>
            <Button
              className="air__button air__button--naked air__button--ghost"
              clicked={() => this.clearStorage()}>
              <svg className="color-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
            </Button>
          </ div>
          <Button
              className="air__button air__button--naked air__button--fab air__button-location"
              clicked={() => this.handleLocation()}>
              <svg className="color-primary" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V2c0-.55-.45-1-1-1s-1 .45-1 1v1.06C6.83 3.52 3.52 6.83 3.06 11H2c-.55 0-1 .45-1 1s.45 1 1 1h1.06c.46 4.17 3.77 7.48 7.94 7.94V22c0 .55.45 1 1 1s1-.45 1-1v-1.06c4.17-.46 7.48-3.77 7.94-7.94H22c.55 0 1-.45 1-1s-.45-1-1-1h-1.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" /></svg>
          </Button>
          <Legend />
          {updateBar}

          <CSSTransition
            in={this.props.updating}
            classNames="air__animation-fade"
            timeout={300}
            mountOnEnter
            unmountOnExit>
            <Updating />
          </CSSTransition>

          <CSSTransition
            in={this.props.loading}
            classNames="air__animation-fade-crunchy"
            timeout={300}
            mountOnEnter
            unmountOnExit>
            <Loading />
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
    notifications: state.notifications,
    update: state.update,
    stations: state.stations,
    options: state.options
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchStations: (url, luftdatenProvider, method) => dispatch(fetchStations(url, luftdatenProvider, method)),
    onSetLocation: (location) => dispatch(setLocation(location))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));