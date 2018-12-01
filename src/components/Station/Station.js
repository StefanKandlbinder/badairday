import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Howl, Howler } from 'howler';

import { STATIONS } from "../../redux/actions/stations";
import { favorizeStation, unfavorizeStation } from "../../redux/actions/stations";
import { setNotification } from '../../redux/actions/notifications';
import { getStationByID } from "../../redux/filters/getStationByID";
import getWebShare from '../../services/getWebShare';

import Aircomp from '../../components/Aircomp/Aircomp';
import Compass from '../../components/Compass/Compass';
import Button from '../../components/UI/Button/Button';

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

    share = () => {
        const title = "BadAirday / Luftqualität: " + this.props.station.name;
        const text =  'Verfolgen Sie die aktuelle Luftqualität an der Station ' + this.props.station.name;
        const url =  'https://badairday.herokuapp.com/station/' + this.props.station.provider + "/" + this.props.station.id;

        getWebShare(title, text, url).then((success, reject) => {
            // this.props.onSetNotification({ message: "Ihr Beitrag wurde geteilt.", feature: STATIONS, type: "success" });
          }).catch((error) => {
            // this.props.onSetNotification({ message: error.message, feature: STATIONS, type: "info" });
          });

        /*if (navigator.share) {
            navigator.share({
                title: "Airodrome / Luftqualität: " + this.props.station.name,
                text: 'Verfolgen Sie die aktuelle Luftqualität an der Station ' + this.props.station.name,
                url: 'https://airodrome.herokuapp.com/station/' + this.props.station.provider + "/" + this.props.station.id
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        }*/
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
        let sharedButton = null;
        let name = "Station";
        let x = "center";
        let y = "center";

        name = this.props.station.name;
        dateElement = <div className="air__station-date">{this.props.station.date}</div>;

        if (this.props.location.state !== undefined) {
            let innerWidth = window.innerWidth;

            if (innerWidth > 330)
                x = this.props.location.state.x - (window.innerWidth - 330) / 2 + "px";
            else
                x = this.props.location.state.x - (window.innerWidth - 288) / 2 + "px";

            y = this.props.location.state.y + "px";
        }


        button = <Button clicked={this.props.station.favorized ? this.onRemoveStation : this.onAddStation} className="air__button air__button--naked air__button--ghost air__station-button air__station-button-fav">
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 573.99 546.92"
                className="air__station-button-icon">
                <path d="M295.99 6.05l80.79 163.7a10 10 0 0 0 7.53 5.47l180.68 26.24a10 10 0 0 1 5.54 17.06L439.75 345.96a10 10 0 0 0-2.87 8.85l30.86 179.93a10 10 0 0 1-14.51 10.54l-161.59-85a9.94 9.94 0 0 0-9.3 0l-161.59 85a10 10 0 0 1-14.51-10.54l30.86-179.93a10 10 0 0 0-2.87-8.85L3.5 218.53a10 10 0 0 1 5.54-17.07l180.66-26.25a10 10 0 0 0 7.53-5.47L277.99 6.05a10 10 0 0 1 18 0z"
                    fill={this.props.station.favorized ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0)"}
                    stroke="rgba(255,255,255,0.9)"
                    strokeMiterlimit="10"
                    strokeWidth="24" />
            </svg>
        </Button>

        if (navigator.share) {
            sharedButton = <Button clicked={this.share} className="air__button air__button--naked air__button--ghost air__station-button air__station-button-share">
                <svg xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="air__station-button-icon">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path fill="white"
                        d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
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
                <div className="air__station" style={{ ...popOriginStyle }}>
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
                        {sharedButton}
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
        update: state.update,
        favorizedStations: state.favorizedStations
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onFavorizeStation: (id) => dispatch(favorizeStation(id)),
        onUnfavorizeStation: (id) => dispatch(unfavorizeStation(id)),
        onSetNotification: (message) => dispatch(setNotification(message))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Station));