import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchStations } from "../redux/actions/stations";
import './App.css';

const luftdatenURL = "https://api.luftdaten.info/v1/filter/type=SDS011&area=48.323368,14.298756,50";
const luftdatenProvider = "luftdaten";
const upperAustriaURL = "https://www2.land-oberoesterreich.gv.at/imm/jaxrs/messwerte/json?";
const upperAustriaProvider = "upperaustria";

class App extends Component {
  onFetchStations = () => {
    this.props.onFetchStations(luftdatenURL, luftdatenProvider);
    this.props.onFetchStations(upperAustriaURL, upperAustriaProvider);
  }

  render() {
    let loading = null;

    if (this.props.loading) {
      loading = <div>Loading...</div>
    }

    return (
      <div className="App">
        {loading}
        <button 
          className="dispatch-button" 
          onClick={() => this.onFetchStations()}>
          <i className="fa fa-rocket" />FETCH STATIONS
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.ui.loading
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchStations: (url, luftdatenProvider) => dispatch(fetchStations(url, luftdatenProvider))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);