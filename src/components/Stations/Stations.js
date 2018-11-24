import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import L from 'leaflet';
import { Map, TileLayer, Marker } from 'react-leaflet';

import './Stations.css';

class Stations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasLocation: false,
            zoom: 13,
            myStations: []
        }
    }

    componentDidMount() {
        this.getStations();
    }

    componentDidUpdate(prevProps) {
        if (this.props.stations.length && this.props.stations.length > prevProps.stations.length) {
            this.getStations();
        }

        if (this.props.update.timestamp > prevProps.update.timestamp) {
            this.updateStations();
        }

        if (this.props.location !== prevProps.location) {
            this.handleLocation();
        }
    }

    // forward to the official station when clicking on the corresponding placeholder on the map
    handleClickCircle = (provider, station) => (e) => {
        this.props.history.push({
            pathname: "/station/" + provider + "/" + station,
            state: {
                x: e.originalEvent.clientX,
                y: e.originalEvent.clientY
            }
        });
    }

    // go back to the main route
    handleClickMap = () => {
        this.props.history.push("/");
    }

    handleLocation = () => {
        this.refs.map.leafletElement.panTo(this.props.location);

    }

    getStations = () => {
        let myStations = this.props.stations.map(element => {
            let marker = "";

            if (element.provider === "luftdaten") {
                marker = L.divIcon({
                    html: `<svg xmlns="http://www.w3.org/2000/svg" 
                        class="" viewBox="0 0 600 600"
                        data-marker-id="${element.id}"
                        style="fill: ${element.components.PM10.update ? element.moodRGBA : "rgba(70,70,70,0.75)"}">
                        <path d="M41.1,165.29V434.71a25.57,25.57,0,0,0,12.78,22.15L287.21,591.57a25.58,25.58,0,0,0,25.58,0L546.12,456.86a25.57,25.57,0,0,0,12.78-22.15V165.29a25.57,25.57,0,0,0-12.78-22.15L312.79,8.43a25.58,25.58,0,0,0-25.58,0L53.88,143.14A25.57,25.57,0,0,0,41.1,165.29Z"/>
                        </svg>`,
                    className: "air__stations-luftdaten-marker",
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                });
            }

            if (element.provider === "upperaustria") {
                marker = L.divIcon({
                    html: `<svg xmlns="http://www.w3.org/2000/svg" 
                        class="" viewBox="0 0 600 600"
                        data-marker-id="${element.id}"
                        style="fill: ${element.components.PM10.update ? element.moodRGBA : "rgba(70,70,70,0.75)"}">
                        <path d="M5,300H5A295,295,0,0,0,152.5,555.48h0a295,295,0,0,0,295,0h0A295,295,0,0,0,595,300h0A295,295,0,0,0,447.5,44.52h0a295,295,0,0,0-295,0h0A295,295,0,0,0,5,300Z"/>
                        </svg>`,
                    className: "air__stations-upperaustria-marker-wrapper",
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                });
            }

            return (
                <CSSTransition
                    key={element.id}
                    in={true}
                    timeout={3000}
                    classNames="air__animation-fade-crunchy"
                    mountOnEnter
                    unmountOnExit>
                    <Marker
                        key={element.id}
                        icon={marker}
                        onClick={this.handleClickCircle(element.provider, element.id)}
                        bubblingMouseEvents={false}
                        position={[element.longitude, element.latitude]}
                        title={element.name}
                        stroke={false}
                        fillOpacity={1}></Marker>
                </CSSTransition>
            )
        });

        this.setState({ myStations: myStations });
    }

    updateStations = () => {
        this.state.myStations.forEach(station => {
            this.props.stations.forEach(newStation => {
                if (station.key === newStation.id) {
                    let markerID = '[data-marker-id="' + newStation.id + '"]';
                    let marker = document.querySelector(markerID);
                    marker.setAttribute("style", 'fill: ' + (newStation.components.PM10.update ? newStation.moodRGBA : "rgba(70,70,70,0.75)"));
                }
            })
        })
    }

    render() {
        const location = this.state.hasLocation ? (
            <Marker position={this.state.location}></Marker>
        ) : null;

        return (
            <div>
                <Map className="air__stations"
                    onClick={this.handleClickMap}
                    onMovestart={this.handleClickMap}
                    center={this.props.location}
                    zoom={this.state.zoom}
                    maxZoom={16}
                    // preferCanvas="true"
                    doubleClickZoom="false"
                    ref="map">
                    <TileLayer
                        // https://wiki.openstreetmap.org/wiki/Tile_servers
                        // https://leaflet-extras.github.io/leaflet-providers/preview/
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        // url="https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    {location}
                    {this.state.myStations}
                </Map>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        stations: state.stations,
        update: state.update,
        location: state.location
    };
}

export default withRouter(connect(mapStateToProps)(Stations));