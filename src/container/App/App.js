import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageVisibility from 'react-page-visibility';

import { fetchStations } from "../../redux/actions/stations";
import { clearState } from '../../redux/localStorage';

import Stations from "../../components/Stations/Stations";
import Notifications from "../../ui/Notifications/Notifications";
import Button from "../../ui/Button/Button";
import Updatebar from "../../ui/Updatebar/Updatebar";
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
    let stations = null;

    if (this.props.loading) {
      loading = <Loading />
    }

    if (this.props.updating) {
      updating = <Updating />
    }

    if (this.props.options.autoupdating) {
      updateBar = <Updatebar interval={60 * 5 * 1000} update={this.onUpdateStations} />
    }

    if (this.props.notification.length) {
      notifications = <Notifications notifications={this.props.notification} />
    }

    if (this.props) {
      stations = <Stations stations={this.props.stations} options={this.props.options}/>;
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
          {stations}
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