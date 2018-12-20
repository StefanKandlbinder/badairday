import React, { Component } from 'react';

import './DashboardItem.scss';

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
            {this.props.station.provider === "upperaustria" ? 
                <svg className="air__dashboard-item-marker air__dashboard-item-marker--official" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#airSVGOfficialMarker"></use></svg> : 
                <svg className="air__dashboard-item-marker" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#airSVGLuftdatenMarker"></use></svg>}
            <div className="air__dashboard-item-content air__dashboard-item--description">
                <div className="air__dashboard-item-name">
                    {this.props.station.name}
                </div>
                <div className="air__dashboard-item-date">{this.props.station.date}</div>
            </div>
            <div className="air__dashboard-item-content air__dashboard-item-content--component">
                {no2}
                {pm10}
                {pm25}
            </div>
        </li>
    }
}

export default DashboardItem;