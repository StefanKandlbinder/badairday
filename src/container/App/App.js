import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import PageVisibility from 'react-page-visibility';
import { CSSTransition } from 'react-transition-group';

import { fetchStations } from "../../redux/actions/stations";
import { clearState } from '../../redux/localStorage';

// import Stations from "../../components/dashboard/Stations/Stations";
import Stations from '../../components/Stations/Stations';
import Station from '../../components/Station/Station';
import Notifications from "../../components/UI/Notifications/Notifications";
import Button from "../../components/UI/Button/Button";
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
              className="air__button air__button--naked"
              clicked={() => this.onFetchStations()}>
              FETCH
              </Button>
            <Button
              className="air__button air__button--naked"
              clicked={() => this.onUpdateStations()}>
              UPDATE
              </Button>
            <Button
              className="air__button air__button--naked"
              clicked={() => this.clearStorage()}>
              CLEAR
              </Button>
          </ div>
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
    onFetchStations: (url, luftdatenProvider, method) => dispatch(fetchStations(url, luftdatenProvider, method))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));