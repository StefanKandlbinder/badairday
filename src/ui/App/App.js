import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageVisibility from 'react-page-visibility';

import { fetchStations } from "../../redux/actions/stations";
import Notifications from "../Notifications/Notifications";
import Button from "../Button/Button";
import getMood from '../../utilities/GetMood';
import { clearState } from '../../redux/localStorage';
import './App.css';

const luftdatenURL = "https://api.luftdaten.info/v1/filter/type=SDS011&area=48.323368,14.298756,50";
const luftdatenProvider = "luftdaten";
// const upperAustriaURL = "https://www2.land-oberoesterreich.gv.at/imm/jaxrs/messwerte/json?";
// const upperAustriaProvider = "upperaustria";

class Stations extends Component {
  render() {
    return (
      <ul className="air__stations">
        {this.props.stations.map((station) =>
          <Station
            key={station.id}
            station={station} />
        )}
      </ul>
    );
  }
}

class Station extends Component {
  render() {
    let moodStyle = {
      backgroundColor: getMood(this.props.station.mood, 0.75),
      borderColor: getMood(this.props.station.mood, 0.4)
    }

    return <li className="air__station" style={moodStyle}>
      <div className="air__station-name">{this.props.station.name.value}
        <div className="air__station-date">{this.props.station.date}</div>
      </div>
      <div className="air__station-mood">
        <div className="air__station-mood-main">{this.props.station.components[0].value.toFixed(2)}</div>
        <div className="air__station-mood-sub">{this.props.station.components[1].value.toFixed(2)}</div>
      </div>
    </li>
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
  render() {
    
    let style = { transform: `scaleX(${ (this.props.counter / this.props.interval) })`  };

    return <div style={style} className="air__update-bar"></div>
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      counter: 0,
      updateInterval: 120
    }
  }

  componentDidMount() {
    if (this.props.options.autoupdating)
      this.activateAutoupdater();
    
    if (!this.props.stations.length) {
      this.onFetchStations();
    }
    else {
      this.onUpdateStations();
    }
  }

  componentWillUnmount() {
    this.clearAutoupdater();
  }

  activateAutoupdater = () => {
    this.updateTimer = setInterval(
      () => this.update(),
      1000
    );
  }

  clearAutoupdater = () => {
    if (this.props.options.autoupdating)
      clearInterval(this.updateTimer);
  }

  update() {
    this.setState({
      counter: this.state.counter + 1
    })

    if (this.state.counter === this.state.updateInterval) {
      this.setState({
        counter: 0
      })
      this.onUpdateStations();
    }
  }

  clearStorage() {
    clearState();
    window.location.reload();
  }

  onFetchStations = () => {
    this.props.onFetchStations(luftdatenURL, luftdatenProvider, "FETCH");
    // this.props.onFetchStations(upperAustriaURL, upperAustriaProvider, "FETCH");
  }

  onUpdateStations = () => {
    this.props.onFetchStations(luftdatenURL, luftdatenProvider, "UPDATE");
    // this.props.onFetchStations(upperAustriaURL, upperAustriaProvider, "UPDATE");
  }

  handleVisibilityChange = isVisible => {
    this.onUpdateStations();
  }

  render() {
    let loading = null;
    let updating = null;
    let notifications = null;

    if (this.props.loading) {
      loading = <Loading />
    }

    if (this.props.updating) {
      updating = <Updating />
    }

    if (this.props.notification.length) {
      notifications = <Notifications notifications={this.props.notification} />
    }

    return (
      <PageVisibility onChange={this.handleVisibilityChange}>
        <div className="App">
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
          <UpdateBar counter={this.state.counter} interval={this.state.updateInterval} />
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