import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchStations } from "../../redux/actions/stations";
import Notifications from "../Notifications/Notifications";
import Button from "../Button/Button";
import getMood from '../../utilities/GetMood';
import './App.css';

const luftdatenURL = "https://api.luftdaten.info/v1/filter/type=SDS011&area=48.323368,14.298756,5";
const luftdatenProvider = "luftdaten";
// const upperAustriaURL = "https://www2.land-oberoesterreich.gv.at/imm/jaxrs/messwerte/json?";
// const upperAustriaProvider = "upperaustria";

class App extends Component {
  
  onFetchStations = () => {
    this.props.onFetchStations(luftdatenURL, luftdatenProvider, "FETCH");
    // this.props.onFetchStations(upperAustriaURL, upperAustriaProvider, "FETCH");
  }

  onUpdateStations = () => {
    this.props.onFetchStations(luftdatenURL, luftdatenProvider, "UPDATE");
    // this.props.onFetchStations(upperAustriaURL, upperAustriaProvider, "UPDATE");
  }

  render() {
    let loading = null;
    let updating = null;
    let notifications = null;

    if (this.props.loading) {
      loading = <div>Loading...</div>
    }

    if (this.props.updating) {
      updating = <div>Updating...</div>
    }

    if (this.props.notification.length) {
      notifications = <Notifications notifications={this.props.notification} />
    }

    function Station(props) {

      let moodStyle = {
        backgroundColor: getMood(props.station.mood, 0.65),
        borderColor: getMood(props.station.mood, 0.4)
      }

      return <li className="station" style={moodStyle}>
          <div className="station__name">{props.station.name.value}
          <div className="station__date">{props.station.date}</div>
          </div>
          <div className="station__mood">{props.station.mood}</div>
        </li>
    }

    function Stations(props) {
      const stations = props.stations;
      return (
        <ul className="stations">
          {stations.map((station) =>
            <Station 
              key={station.id}
              station={station} />
          )}
        </ul>
      );
    }

    return (
      <div className="App">
        {loading}
        {updating}
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
        <Stations stations = {this.props.stations}/>
        {notifications}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.ui.loading,
    updating: state.ui.updating,
    notification: state.notification,
    update: state.update,
    stations: state.stations
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchStations: (url, luftdatenProvider, method) => dispatch(fetchStations(url, luftdatenProvider, method))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);