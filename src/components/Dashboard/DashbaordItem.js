import React, { Component } from 'react';
import { connect } from 'react-redux';

import { favorizeStation, unfavorizeStation } from "../../redux/actions/stations";
import './DashboardItem.scss';
import austria from '../../assets/austria.svg';

class Sample extends Component {
    render() {
        return <div className={this.props.classes}>
            <div className="air__dashboard-item-component-type">{this.props.component.type}:</div>
            <div className="air__dashboard-item-component-value">{this.props.component.update ? this.props.component.value : "-"}</div>
        </div>
    }
}

class DashboardItem extends Component {

    onToggleFavorized = (id) => {
        !this.props.station.favorized ? this.props.onFavorizeStation(id) : this.props.onUnfavorizeStation(id);
    }

    render() {
        let moodStyle = {
            backgroundColor: this.props.station.components["PM10"].update ? this.props.station.moodRGBA : "rgba(70, 70, 70, 0.75)"
        }

        let airStationClasses = "air__dashboard-item";

        let no2 = null;
        let pm10 = null;
        let pm25 = null;

        if (this.props.station.components.NO2) {
            no2 = <Sample classes="air__dashboard-item-component" component={this.props.station.components.NO2}></Sample>
        }

        if (this.props.station.components.PM10) {
            pm10 = <Sample classes="air__dashboard-item-component air__dashboard-component-content--main" component={this.props.station.components.PM10}></Sample>
        }

        if (this.props.station.components.PM25) {
            pm25 = <Sample classes="air__dashboard-item-component" component={this.props.station.components.PM25}></Sample>
        }

        if (this.props.station.favorized) {
            airStationClasses += " air__dashboard-item--favorized";
        }
        else {
            airStationClasses = "air__dashboard-item";
        }

        return <li className={airStationClasses} style={moodStyle} onClick={() => this.onToggleFavorized(this.props.station.id)}>
            <div className="air__dashboard-item-content air__dashboard-item--description">
                <div className="air__dashboard-item-name">{this.props.station.name} {this.props.station.provider === "upperaustria" ? <img src={austria} className="air__dashboard-item-official" alt="austria" /> : ""}</div>
                <div className="air__dashboard-item-date">{this.props.station.date}</div>
            </div>
            <div className="air__dashboard-item-content air__dashboard-item-content--component">
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

export default connect(null, mapDispatchToProps)(DashboardItem);