import React, { Component } from 'react';
import { connect } from 'react-redux';

import { favorizeStation, unfavorizeStation } from "../../../redux/actions/stations";
import getMood from '../../../utilities/GetMood';
import './Station.css';
import austria from '../../../assets/austria.svg';

class Sample extends Component {
    render() {
        return <div className={this.props.classes}>
            <div className="air__station-component-type">{this.props.component.type}:</div>
            <div className="air__station-component-value">{this.props.component.update ? this.props.component.value : "-"}</div>
        </div>
    }
}

class Station extends Component {

    onToggleFavorized = (id) => {
        !this.props.station.favorized ? this.props.onFavorizeStation(id) : this.props.onUnfavorizeStation(id);
    }

    render() {
        let moodStyle = {
            backgroundColor: this.props.station.components["PM10"].update ? this.props.station.moodRGBA : "rgba(70, 70, 70, 0.75)"
        }

        let airStationClasses = "air__station";

        let no2 = null;
        let pm10 = null;
        let pm25 = null;

        if (this.props.station.components.NO2) {
            no2 = <Sample classes="air__station-component" component={this.props.station.components.NO2}></Sample>
        }

        if (this.props.station.components.PM10) {
            pm10 = <Sample classes="air__station-component air__station-component--main" component={this.props.station.components.PM10}></Sample>
        }

        if (this.props.station.components.PM25) {
            pm25 = <Sample classes="air__station-component" component={this.props.station.components.PM25}></Sample>
        }

        if (this.props.station.favorized) {
            airStationClasses += " air__station--favorized";
        }
        else {
            airStationClasses = "air__station";
        }

        return <li className={airStationClasses} style={moodStyle} onClick={() => this.onToggleFavorized(this.props.station.id)}>
            <div className="air__station-item air__station--description">
                <div className="air__station-name">{this.props.station.name} {this.props.station.provider === "upperaustria" ? <img src={austria} className="air__station-official" alt="austria" /> : ""}</div>
                <div className="air__station-date">{this.props.station.date}</div>
            </div>
            <div className="air__station-item air__station-item--component">
                {pm10}
                {pm25}
                {no2}
            </div>
        </li>
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onFavorizeStation: (id) => dispatch(favorizeStation(id)),
        onUnfavorizeStation: (id) => dispatch(unfavorizeStation(id))
    }
}

export default connect(null, mapDispatchToProps)(Station);