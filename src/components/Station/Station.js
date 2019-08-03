import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Howl, Howler } from 'howler';

import { favorizeStation, unfavorizeStation, notifyStation, unnotifyStation } from "../../redux/actions/stations";
import { setNotification } from '../../redux/actions/notifications';
import { setSubscription } from '../../redux/actions/subscription';
import { getStationByID } from "../../redux/filters/getStationByID";
import { getNotifiedStations } from '../../redux/filters/getNotifiedStations';

import Aircomp from '../../components/Aircomp/Aircomp';
import Compass from '../../components/Compass/Compass';
import Button from '../../components/UI/Button/Button';
import BadAirDayNotifications from '../../services/Notifications/BadAirDayNotifications';

import './Station.scss';

// http://facebook.design/soundkit#scroll
import soundMount from '../../audio/Tab 2.m4a';
import soundUnmount from '../../audio/Tab 1.m4a';
import soundChange from '../../audio/Button 7.m4a';

// howl
const mount = new Howl({
    src: [soundMount]
});

const unmount = new Howl({
    src: [soundUnmount]
});

const change = new Howl({
    src: [soundChange]
});

let timeout;

Howler.volume(0.15);

const hexagon = "M41.59,163.45v273.1a21.91,21.91,0,0,0,10.95,19L289.05,592.07a21.91,21.91,0,0,0,21.9,0L547.46,455.52a21.91,21.91,0,0,0,10.95-19V163.45a21.91,21.91,0,0,0-10.95-19L311,7.93a21.91,21.91,0,0,0-21.9,0L52.54,144.48A21.91,21.91,0,0,0,41.59,163.45Z";
const circle = "M5,300v.1a294.91,294.91,0,0,0,147.46,255.4l.08,0a294.93,294.93,0,0,0,294.92,0l.08,0A294.91,294.91,0,0,0,595,300.05V300A294.91,294.91,0,0,0,447.54,44.55l-.08,0a294.93,294.93,0,0,0-294.92,0l-.08,0A294.91,294.91,0,0,0,5,300Z";

class Station extends Component {
    constructor(props) {
        super(props);

        this.BadAirDayNotifications = new BadAirDayNotifications();
        this.state = {
            shape: "",
            animationCircle: null,
            animationHexagon: null,
            comps: null,
            compass: null,
            isMounted: false
        }
    }

    componentWillMount() { }

    componentWillUnmount() {
        this.setState({ isMounted: false })

        unmount.play();
        window.clearTimeout(timeout);
    }

    componentDidMount() {
        this.setState({ isMounted: true })
        this.setState({ animationCircle: document.getElementById("animation-to-circle") })
        this.setState({ animationHexagon: document.getElementById("animation-to-hexagon") })
        this.setState({ comps: this.getAirComps() })

        if (this.props.station.provider === "upperaustria")
            this.setState({ shape: circle })

        if (this.props.station.provider === "luftdaten")
            this.setState({ shape: hexagon })

        timeout = window.setTimeout(mount.play(), 50);
    }

    componentDidUpdate(prevProps) {
        if (this.props.station.id !== prevProps.station.id) {
            this.setState({ comps: this.getAirComps() });
            change.play();
        }

        if (this.props.update.timestamp > prevProps.update.timestamp) {
            this.setState({ comps: this.getAirComps() });
        }

        if (this.props.station.provider !== "luftdaten" && prevProps.station.provider === "luftdaten") {
            this.state.animationCircle.beginElement();
        }

        if (this.props.station.provider !== "upperaustria" && prevProps.station.provider === "upperaustria") {
            this.state.animationHexagon.beginElement();
        }

        if (this.props.station.favorized !== prevProps.station.favorized) {
            change.play();
        }
    }

    onAddStation = () => {
        this.props.onFavorizeStation(this.props.station.id);
    }

    onRemoveStation = () => {
        this.props.onUnfavorizeStation(this.props.station.id);
    }

    onAddNotify = () => {
        this.props.onNotifyStation(this.props.station.id);

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
        this.props.onUnnotifyStation(this.props.station.id);
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

    getAirComps() {
        let compItems = [];

        if (this.props.station.provider === "upperaustria") {
            Object.entries(this.props.station.components).forEach(([key, value]) => {
                if (value.unit === "µg/m³") {

                    compItems.push(<Aircomp key={key}
                        component={key}
                        value={value.value}
                        unit={value.unit} />);
                }

                else if (key === "WIR") {
                    this.setState({
                        compass: <Compass
                            value={value.value} />
                    })

                    compItems.push(<Aircomp key={key}
                        component={key}
                        value={value.value}
                        unit={value.unit} />);
                }

                else {
                    compItems.push(<Aircomp key={key}
                        component={key}
                        value={value.value}
                        unit={value.unit} />);
                }
            });

            return (compItems);
        }

        if (this.props.station.provider === "luftdaten") {
            this.setState({ compass: null });

            Object.entries(this.props.station.components).forEach(([key, value]) => {
                if (value.unit === "µg/m³") {

                    compItems.push(<Aircomp key={key}
                        component={key}
                        value={value.value}
                        unit={value.unit} />);
                }
            });

            return (compItems);
        }
    }

    render() {
        let element = null;
        let dateElement = null;
        let button = null;
        let notifyButton = null;
        let name = "Station";
        let x = "center";
        let y = "center";

        name = this.props.station.name;
        dateElement = <div className="air__station-date">{this.props.station.date}</div>;

        if (this.props.location.state !== undefined) {
            let innerWidth = window.innerWidth;
            let dashboardWidth = 0;
            let stationWidth = 0;

            if (this.props.media === "medium" && this.props.dashboard) {
                dashboardWidth = 320;
                stationWidth = 330;
            }

            if (this.props.media === "medium" && !this.props.dashboard) {
                dashboardWidth = 0;
                stationWidth = 330;
            }

            if (this.props.media === "small") {
                dashboardWidth = 0;
                stationWidth = 288;
            }

            x = this.props.location.state.x - (innerWidth - stationWidth - dashboardWidth) / 2 + "px";
            y = this.props.location.state.y + "px";
        }


        button = <Button
            clicked={this.props.station.favorized ? this.onRemoveStation : this.onAddStation}
            className={`air__button air__button--naked air__button--ghost air__station-button air__station-button-fav${this.props.station.favorized ? " air__station-button-fav--active" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="air__station-button-icon"
                stroke="rgba(255,255,255,0.9)"
                strokeMiterlimit="10"
                strokeWidth="24">
                <use xlinkHref="#airSVGFavorize"></use>
            </svg>
        </Button>

        if ('Notification' in window && navigator.serviceWorker) {
            notifyButton = <Button
                clicked={this.props.station.notify ? this.onRemoveNotify : this.onAddNotify}
                className={`air__button air__button--naked air__button--ghost air__station-button air__station-button-notify${this.props.station.notify ? " air__station-button-notify--active" : ""}`}>
                <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="air__station-button-icon"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="1">
                    <use xlinkHref="#airSVGNotify"></use>
                </svg>
            </Button>
        }

        let popOriginStyle = {
            transformOrigin: x + " " + y
        }

        let moodStyle = {
            fill: this.props.station.components.PM10.update ? this.props.station.moodRGBA : "rgba(70,70,70,0.75)"
        }

        element = (
            <CSSTransition
                in={this.state.isMounted}
                classNames="a-station"
                timeout={300}>
                <div className={`air__station air__station--${this.props.station.provider} air__station--dashboard-${this.props.dashboard}`} style={{ ...popOriginStyle }}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        style={{ ...moodStyle }}
                        className="air__station-background"
                        viewBox="0 0 600 600"
                        filter="drop-shadow(rgba(0,0,0,.5) 10px 10px 20px)">
                        <path d={this.state.shape}>
                            <animate id="animation-to-circle"
                                begin="animation-to-hexagon.end"
                                restart="always"
                                fill="freeze"
                                attributeName="d"
                                dur="200ms"
                                to={circle} />
                            <animate id="animation-to-hexagon"
                                begin="animation-to-circle.end"
                                restart="always"
                                fill="freeze"
                                attributeName="d"
                                dur="200ms"
                                to={hexagon} />
                        </path>
                    </svg>

                    <h1 className="air__station-header">{name}</h1>
                    {dateElement}
                    {this.state.comps}
                    {this.state.compass}
                    <div className="air__action-container">
                        {button}
                    </div>
                    <div className="air__action-container air__action-container--top">
                        {notifyButton}
                    </div>
                </div>
            </CSSTransition>
        )

        return element;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        stations: state.stations,
        station: getStationByID(
            state.stations,
            ownProps.match.params.id
        ),
        dashboard: state.ui.dashboard,
        media: state.ui.media,
        update: state.update,
        favorizedStations: state.favorizedStations,
        subscription: state.subscription
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onFavorizeStation: (id) => dispatch(favorizeStation(id)),
        onUnfavorizeStation: (id) => dispatch(unfavorizeStation(id)),
        onNotifyStation: (id) => dispatch(notifyStation(id)),
        onUnnotifyStation: (id) => dispatch(unnotifyStation(id)),
        onSetNotification: (message) => dispatch(setNotification(message)),
        onSetSubscription: (id) => dispatch(setSubscription(id))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Station));