import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import L from 'leaflet';
import { Map, TileLayer, Marker } from 'react-leaflet';

import './Stations.scss';

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

        if (this.props.stations.length) {
            this.updateFavorizedStations();
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
        this.setState({
            hasLocation: true
        })
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
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg"
                        data-favorized-id="${element.id}"
                        fill="${element.favorized ? "rgba(255, 2255, 255, 0.9)" : "rgba(255,255,255,0.0)"}"
                        viewBox="0 0 573.99 546.92"
                        class="air__stations-favorized-icon">
                        <path d="M295.99 6.05l80.79 163.7a10 10 0 0 0 7.53 5.47l180.68 26.24a10 10 0 0 1 5.54 17.06L439.75 345.96a10 10 0 0 0-2.87 8.85l30.86 179.93a10 10 0 0 1-14.51 10.54l-161.59-85a9.94 9.94 0 0 0-9.3 0l-161.59 85a10 10 0 0 1-14.51-10.54l30.86-179.93a10 10 0 0 0-2.87-8.85L3.5 218.53a10 10 0 0 1 5.54-17.07l180.66-26.25a10 10 0 0 0 7.53-5.47L277.99 6.05a10 10 0 0 1 18 0z"/>
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
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg"
                        data-favorized-id="${element.id}"
                        fill="${element.favorized ? "rgba(255, 2255, 255, 0.9)" : "rgba(255,255,255,0.0)"}"
                        viewBox="0 0 573.99 546.92"
                        class="air__stations-favorized-icon">
                        <path d="M295.99 6.05l80.79 163.7a10 10 0 0 0 7.53 5.47l180.68 26.24a10 10 0 0 1 5.54 17.06L439.75 345.96a10 10 0 0 0-2.87 8.85l30.86 179.93a10 10 0 0 1-14.51 10.54l-161.59-85a9.94 9.94 0 0 0-9.3 0l-161.59 85a10 10 0 0 1-14.51-10.54l30.86-179.93a10 10 0 0 0-2.87-8.85L3.5 218.53a10 10 0 0 1 5.54-17.07l180.66-26.25a10 10 0 0 0 7.53-5.47L277.99 6.05a10 10 0 0 1 18 0z"/>
                        </svg>`,
                    className: "air__stations-upperaustria-marker",
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
        this.props.stations.forEach(station => {
            let markerID = '[data-marker-id="' + station.id + '"]';
            if (markerID) {
                let marker = document.querySelector(markerID);
                marker.setAttribute("style", 'fill: ' + (station.components.PM10.update ? station.moodRGBA : "rgba(70,70,70,0.75)"));
            }
        })
    }

    updateFavorizedStations = () => {
        this.props.stations.forEach(station => {
            if (station.favorized) {
                let markerID = '[data-favorized-id="' + station.id + '"]';
                let marker = document.querySelector(markerID);

                if (marker) {
                    marker.setAttribute("style", "fill: rgba(255, 255, 255, 0.9)");
                }
            }
            else {
                let markerID = '[data-favorized-id="' + station.id + '"]';
                let marker = document.querySelector(markerID);
                
                if (marker) {
                    marker.setAttribute("style", "fill: rgba(255, 255, 255, 0)");
                }
            }
        })
    }

    render() {
        let location = null;

        if (this.state.hasLocation && this.props.location) {
            let marker = L.divIcon({
                hmtl: "",
                className: "air__icon-location",
                iconSize: [12, 12]
            });

            location = <Marker icon={marker} position={this.props.location}></Marker>
        }

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
                    {this.state.myStations}
                    {location}
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