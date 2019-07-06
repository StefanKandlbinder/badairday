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
        let wiv = null;
        let wir = null;
        let wind = null;

        if (this.props.station.components.NO2) {
            no2 = <Sample classes="air__dashboard-item-component" component={this.props.station.components.NO2}></Sample>
        }

        if (this.props.station.components.PM10) {
            pm10 = <Sample classes="air__dashboard-item-component air__dashboard-component-content--main" component={this.props.station.components.PM10}></Sample>
        }

        if (this.props.station.components.PM25) {
            pm25 = <Sample classes="air__dashboard-item-component" component={this.props.station.components.PM25}></Sample>
        }

        if (this.props.station.components.WIV) {
            wiv = <div className="air__dashboard-item-wiv">{this.props.station.components.WIV.value} {this.props.station.components.WIV.unit}</div>
        }

        if (this.props.station.components.WIR) {
            const winddirection = this.props.station.components.WIR.value || 0;
            const divStyle = {
                transform: 'rotate(' + (winddirection - 180) + 'deg)'
            };

            wir = <div className="air__dashboard-item-wir" style={divStyle}>
                <svg className="air__dashboard-item-wir-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 600 600">
                    <path d="M289.3 103.1L98.7 484.2c-5.2 10.3 5.8 21.3 16.1 16.1l179.8-89.9c3.4-1.7 7.4-1.7 10.7 0l179.8 89.9c10.3 5.2 21.3-5.8 16.1-16.1L310.7 103.1c-4.4-8.9-17-8.9-21.4 0zm4.1 276.4l-117.2 58.6c-10.3 5.2-21.3-5.8-16.1-16.1l117.2-234.3c5.7-11.3 22.7-7.3 22.7 5.4v175.8c0 4.4-2.6 8.6-6.6 10.6z" fill="#fff" />
                    <style xmlns="" /></svg>
                </div>
        }

        if (this.props.station.components.WIV && this.props.station.components.WIR) {
            wind = <div className="air__dashboard-item-wind">
                    {wiv}
                    {wir}
                </div>
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
                {wind}
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