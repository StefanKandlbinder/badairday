import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageVisibility from 'react-page-visibility';
import sortBy from 'lodash/sortBy';

import { fetchStations } from "../../redux/actions/stations";
import { clearState } from '../../redux/localStorage';

import Station from "../Station/Station";
import Notifications from "../Notifications/Notifications";
import Button from "../Button/Button";
import './App.css';

const luftdatenURL = "https://api.luftdaten.info/v1/filter/type=SDS011&area=48.323368,14.298756,10";
const luftdatenProvider = "luftdaten";
const upperAustriaURL = "https://www2.land-oberoesterreich.gv.at/imm/jaxrs/messwerte/json?";
const upperAustriaProvider = "upperaustria";

class Stations extends Component {
  render() {
    let stations = sortBy(this.props.stations, ['mood']).reverse();

    return (
      <ul className="air__stations">
        {stations.map((station) =>
          <Station
            key={station.id}
            station={station} />
        )}
      </ul>
    );
  }
}

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

class UpdateBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // counter: 0,
      progress: 0
    }
  }

  componentDidMount() {
    this.animate();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
  }

  animate() {
    // if (this.props.animate) {
      let start = null;
      let step = timestamp => {
        if (!start) start = timestamp;
        
        let progress = timestamp - start;
        this.setState({ progress });

        if (progress > this.props.interval) {
          this.props.update();
          start = null;
        }

        this.rafId = requestAnimationFrame(step);
      };
      this.rafId = requestAnimationFrame(step);
    // }
  }

  render() {
    let style = { transform: `scaleX(${(this.state.progress / this.props.interval)})` };

    return <div style={style} className="air__update-bar"></div>
  }
}

class App extends Component {
  componentDidMount() {
    if (!this.props.stations.length) {
      this.onFetchStations();
    }
    else {
      this.onUpdateStations();
    }
  }

  componentWillUnmount() {}

  clearStorage() {
    clearState();
    window.location.reload(true);
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
    let loading = null;
    let updating = null;
    let notifications = null;
    let updateBar = null;

    if (this.props.loading) {
      loading = <Loading />
    }

    if (this.props.updating) {
      updating = <Updating />
    }

    if (this.props.options.autoupdating) {
      updateBar = <UpdateBar interval={30 * 1000} update={this.onUpdateStations} />
    }

    if (this.props.notification.length) {
      notifications = <Notifications notifications={this.props.notification} />
    }

    return (
      <PageVisibility onChange={this.handleVisibilityChange}>
        <div className="air">
          <div className="air__button-group">
            <Button
              className="air__button"
              clicked={() => this.onFetchStations()}>
              FETCH
            </Button>
            <Button
              className="air__button"
              clicked={() => this.onUpdateStations()}>
              UPDATE
            </Button>
            <Button
              className="air__button"
              clicked={() => this.clearStorage()}>
              CLEAR
            </Button>
          </ div>
          <Stations stations={this.props.stations} />
          <div className="air__spacer"></div>
          {loading}
          {updating}
          {notifications}
          {updateBar}
        </div>
      </PageVisibility>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.ui.loading,
    updating: state.ui.updating,
    notification: state.notification,
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

export default connect(mapStateToProps, mapDispatchToProps)(App);