import React, { Component } from 'react';

import Button from '../../components/UI/Button/Button';
import { getNotifiedStations } from '../../redux/filters/getNotifiedStations';
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
        switch (this.props.type) {
            case "favorized":
                !this.props.station.properties.favorized ? this.props.onAdd(id) : this.props.onRemove(id);
                break;
            case "notify":
                !this.props.station.properties.notify ? this.props.onAdd(id) : this.props.onRemove(id);
                break;
            default:
                break;
        }
    }

    onAddStation = () => {
        this.props.onFavorizeStation(this.props.station.properties.id);
    }

    onRemoveStation = () => {
        this.props.onUnfavorizeStation(this.props.station.properties.id);
    }

    onAddNotify = () => {
        this.props.onNotifyStation(this.props.station.properties.id);

        if (this.props.subscription.id === "" || Notification.permission === "default") {
            this.BadAirDayNotifications.requestPermission()
                .then(res => {
                    this.BadAirDayNotifications.subscribeUser()
                        .then(res => {
                            this.BadAirDayNotifications.sendSubscription(res)
                                .then(res => {
                                    this.props.onSetSubscription(res.name);
                                    this.updateNotifiedStations(res.name);
                                })
                                .catch(err => {
                                    // console.log(err);
                                })
                        })
                        .catch(err => {
                            // console.log("Subscribe User: ", err);
                        });
                })
                .catch(err => {
                    // console.log(err);
                });
        }
        else {
            this.updateNotifiedStations(this.props.subscription.id.toString());
        }
    }

    onRemoveNotify = () => {
        this.props.onUnnotifyStation(this.props.station.properties.id);
        this.updateNotifiedStations(this.props.subscription.id.toString());
    }

    updateNotifiedStations = (id) => {
        var timeoutID; // this is HACKY!!!
        const url = `https://badairday22.firebaseio.com/subscriptions/${id}/notifiedStations.json`;

        function delayedUpdate() {
            timeoutID = window.setTimeout(update, 2000);
        }

        const update = () => {
            fetch(url, {
                method: 'PUT',
                body: JSON.stringify(getNotifiedStations(this.props.stations)),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(response => {
                    // console.log('Updated Notified Stations:', JSON.stringify(response));
                    window.clearTimeout(timeoutID);
                    // resolve(response);
                })
                .catch(error => {
                    // console.error('Error:', error)
                    // reject(Error("Couldn't add notify stations do database: ", error));
                })
        }

        delayedUpdate();
    }

    render() {
        let moodStyle = {
            backgroundColor: this.props.station.properties.components["PM10"].update ? this.props.station.properties.moodRGBA : "rgba(70, 70, 70, 0.75)"
        }

        let airStationClasses = "air__dashboard-item";

        let no2 = null;
        let pm10 = null;
        let pm25 = null;
        let wiv = null;
        let wir = null;
        let wind = null;
        let temp = null;
        let name = null;
        let officialIcon = null
        let notifyButton = null;
        let favorizeButton = null;

        name = this.props.station.properties.name;

        if (this.props.station.properties.provider === "luftdaten" && this.props.reversegeo && this.props.station.properties.reverseGeoName !== "") {
            name = this.props.station.properties.reverseGeoName;
        }

        if (this.props.station.properties.components.NO2) {
            no2 = <Sample classes="air__dashboard-item-component" component={this.props.station.properties.components.NO2}></Sample>
        }

        if (this.props.station.properties.components.PM10) {
            pm10 = <Sample classes="air__dashboard-item-component air__dashboard-component-content--main" component={this.props.station.properties.components.PM10}></Sample>
        }

        if (this.props.station.properties.components.PM25) {
            pm25 = <Sample classes="air__dashboard-item-component" component={this.props.station.properties.components.PM25}></Sample>
        }

        if (this.props.station.properties.components.WIV) {
            wiv = <div className="air__dashboard-item-wiv">
                <span className="air__dashboard-item-wiv-value">{this.props.station.properties.components.WIV.value}</span>
                <span className="air__dashboard-item-wiv-unit">{this.props.station.properties.components.WIV.unit}</span>
            </div>
        }

        if (this.props.station.properties.components.WIR) {
            const winddirection = this.props.station.properties.components.WIR.value || 0;
            const divStyle = {
                transform: 'rotate(' + (winddirection - 180) + 'deg)'
            };

            wir = <div className="air__dashboard-item-wir" style={divStyle}>
                <svg className="air__dashboard-item-wir-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 600 600">
                    <path d="M289.3 103.1L98.7 484.2c-5.2 10.3 5.8 21.3 16.1 16.1l179.8-89.9c3.4-1.7 7.4-1.7 10.7 0l179.8 89.9c10.3 5.2 21.3-5.8 16.1-16.1L310.7 103.1c-4.4-8.9-17-8.9-21.4 0zm4.1 276.4l-117.2 58.6c-10.3 5.2-21.3-5.8-16.1-16.1l117.2-234.3c5.7-11.3 22.7-7.3 22.7 5.4v175.8c0 4.4-2.6 8.6-6.6 10.6z" fill="#fff" />
                    <style xmlns="" /></svg>
            </div>
        }

        if (this.props.station.properties.components.WIV && this.props.station.properties.components.WIR) {
            wind = <div className="air__dashboard-item-wind">
                {wir}
                {wiv}
            </div>
        }

        if (this.props.station.properties.components.TEMP) {
            temp = <div className="air__dashboard-item-temp">
                <svg className="air__dashboard-item-temp-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 250.189 250.189">
                    <g>
                        <path d="M159.845,147.251V34.744C159.845,15.586,144.255,0,125.093,0c-19.159,0-34.746,15.586-34.746,34.744v112.506   c-14.234,10.843-22.617,27.59-22.617,45.575c0,31.631,25.732,57.364,57.363,57.364c31.633,0,57.367-25.733,57.367-57.364   C182.46,174.842,174.077,158.095,159.845,147.251z M125.093,235.189c-23.359,0-42.363-19.004-42.363-42.364   c0-14.294,7.188-27.537,19.228-35.425c2.115-1.386,3.39-3.745,3.39-6.273V34.744c0-10.887,8.858-19.744,19.746-19.744   c10.892,0,19.752,8.857,19.752,19.744v116.383c0,2.529,1.274,4.887,3.39,6.273c12.038,7.889,19.226,21.132,19.226,35.425   C167.46,216.185,148.454,235.189,125.093,235.189z" />
                        <path d="M132.595,169.042V69.924c0-4.142-3.357-7.5-7.5-7.5s-7.5,3.358-7.5,7.5v99.118c-10.104,3.183-17.43,12.622-17.43,23.783   c0,13.767,11.16,24.931,24.93,24.931c13.773,0,24.932-11.164,24.932-24.931C150.026,181.663,142.7,172.223,132.595,169.042z" />
                    </g>
                </svg>
                <div className="air__dashboard-item-temp-container">
                    <span className="air__dashboard-item-temp-value">{this.props.station.properties.components.TEMP.value}°</span>
                    <span className="air__dashboard-item-temp-unit">{this.props.station.properties.components.TEMP.unit}</span>
                </div>
            </div>
        }

        if (this.props.station.properties.favorized || this.props.station.properties.notify) {
            airStationClasses += " air__dashboard-item--favorized";
        }
        else {
            airStationClasses = "air__dashboard-item";
        }

        if ('Notification' in window && navigator.serviceWorker) {
            notifyButton = <Button
                clicked={this.props.station.properties.notify ? this.onRemoveNotify : this.onAddNotify}
                className={`air__button air__button--negative air__button-icon air__button--small air__button--naked air__button--ghost${this.props.station.properties.notify ? " air__button--active" : " air__button--inactive"}`}>
                <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="air__button-icon"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="1">
                    <use xlinkHref="#airSVGNotify"></use>
                </svg>
            </Button>
        }

        favorizeButton = <Button
            clicked={this.props.station.properties.favorized ? this.onRemoveStation : this.onAddStation}
            className={`air__button air__button--negative air__button--small air__button--naked air__button--ghost${this.props.station.properties.favorized ? " air__button--active" : " air__button--inactive"}`}>
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="air__button-icon"
                stroke="rgba(255,255,255,0.9)"
                strokeMiterlimit="10"
                strokeWidth="24">
                <use xlinkHref="#airSVGFavorize"></use>
            </svg>
        </Button>

        if (this.props.station.properties.provider === "upperaustria") {
            officialIcon = <div className="air__dashboard-item-official-icon"><svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 12">
                <use xlinkHref="#airSVGOfficialAustria"></use>
            </svg></div>
        }
        

        return <li className={airStationClasses} style={moodStyle}>
            <div className="air__dashboard-item-action">
                {officialIcon}
                {notifyButton}
                {favorizeButton}
            </div>
            <div className="air__dashboard-item-content air__dashboard-item--description">
                <div className="air__dashboard-item-name">
                    {name}
                </div>
                <div className="air__dashboard-item-date">{this.props.station.properties.date}</div>
                <div className="air__dashboard-item-container">
                    {wind}
                    {temp}
                </div>
            </div>
            <div className="air__dashboard-item-content air__dashboard-item-content--component">
                {pm10}
                {pm25}
                {no2}
            </div>
        </li>
    }
}

export default DashboardItem;