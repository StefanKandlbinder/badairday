import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchStations, updateStations } from "../../redux/actions/stations";
import Notifications from "../Notifications/Notifications";
import Button from "../Button/Button";
import './App.css';

const luftdatenURL = "https://api.luftdaten.info/v1/filter/type=SDS011&area=48.323368,14.298756,1";
const luftdatenProvider = "luftdaten";
const upperAustriaURL = "https://www2.land-oberoesterreich.gv.at/imm/jaxrs/messwerte/json?";
const upperAustriaProvider = "upperaustria";

class App extends Component {
  
  onFetchStations = () => {
    this.props.onFetchStations(luftdatenURL, luftdatenProvider, "FETCH");
    // this.props.onFetchStations(upperAustriaURL, upperAustriaProvider, "FETCH");
  }

  onUpdateStations = () => {
    this.props.onFetchStations(luftdatenURL, luftdatenProvider, "UPDATE");
    // this.props.onUpdateStations(upperAustriaURL, upperAustriaProvider);
  }

  render() {
    let loading = null;
    let notifications = null;

    if (this.props.loading) {
      loading = <div>Loading...</div>
    }

    if (this.props.notification.length) {
      notifications = <Notifications notifications={this.props.notification} />
    }

    return (
      <div className="App">
        {loading}
        <Button
          className="air__button"
          clicked={() => this.onFetchStations()}>
          FETCH STATIONS
        </Button>
        <Button
          className="air__button"
          clicked={() => this.onUpdateStations()}>
          UPDATE STATIONS
        </Button>
        {notifications}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.ui.loading,
    notification: state.notification
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchStations: (url, luftdatenProvider, method) => dispatch(fetchStations(url, luftdatenProvider, method)),
    onUpdateStations: (url, luftdatenProvider, method) => dispatch(updateStations(url, luftdatenProvider, method))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);