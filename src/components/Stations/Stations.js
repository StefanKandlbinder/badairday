import React, { Component } from 'react';
import { withRouter } from 'react-router';
// import { CSSTransition } from 'react-transition-group';

import L from 'leaflet';
import { Map, TileLayer, Marker } from 'react-leaflet';

import { STATIONS } from "../../redux/actions/stations";
import './Stations.scss';

class Stations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasLocation: false,
            zoom: 13,
            stationMarkers: []
        }
    }

    componentDidMount() {
        console.log(this.props);
        
        this.getStations();
        this.refs.map.leafletElement.zoomControl.setPosition("bottomleft");
        // console.log(this.refs.map.leafletElement.zoomControl.options.position);
    }

    componentDidUpdate(prevProps) {
        if (this.props.stations.length && this.props.stations.length > prevProps.stations.length) {
            this.getStations();
        }

        if (this.props.update.timestamp > prevProps.update.timestamp) {
            this.updateStations();
        }

        if (this.props.position !== prevProps.position) {
            this.handleLocation();
        }

        if (this.props.stations.length) {
            this.updateFavorizedStations();
            this.updateNotifiedStations();
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
        console.log("Noteboard: ", this.props.noteboard, this.props.favboard);

        if (this.props.location.pathname === "/bottomsheet" || this.props.location.pathname.includes("/station")) {
            this.props.history.push("/");
        }

        if (this.props.media === "small" && this.props.favboard) {
            this.props.history.push("/");
            this.props.onSetFavboard({ state: false, feature: STATIONS });
        }

        if (this.props.noteboard) {
            this.props.history.push("/");
            this.props.onSetNoteboard({ state: false, feature: STATIONS });
        }
    }

    handleLocation = () => {
        this.setState({
            hasLocation: true
        }, () => {
            this.refs.map.leafletElement.flyTo(this.props.position, this.state.zoom);
        })
    }

    onZoom = (e) => {
        // let zoom = this.refs.map.leafletElement.getZoom();
    }

    onZoomStart = (e) => {
        this.markerPane = document.getElementsByClassName("leaflet-marker-pane")[0];
        this.markerPane.style.animationDelay = "0s";
        this.markerPane.style.opacity = 0;
        console.log("Zoom started!");
    }

    onZoomEnd = (e) => {
        this.markerPane.style.animationDelay = "1s";
        this.markerPane.style.opacity = 1;
        console.log("Zoom ended!");
    }

    onMoveEnd = (e) => {
        // let bounds = this.refs.map.leafletElement.getBounds();
        // console.log(bounds);
    }

    getStations = () => {
        let stationMarkers = this.props.stations.map(element => {
            let marker = "";

            if (element.provider === "luftdaten") {
                marker = L.divIcon({
                    html: `<svg xmlns="http://www.w3.org/2000/svg" 
                        class="" viewBox="0 0 24 24"
                        data-marker-id="${element.id}"
                        style="fill: ${element.components.PM10.update ? element.moodRGBA : "rgba(70,70,70,0.75)"}">
                        <use xlink:href="#airSVGLuftdatenMarker"></use>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            data-notify-id="${element.id}"
                            fill="${element.notify ? "rgba(255, 2255, 255, 0.9)" : "rgba(255,255,255,0.0)"}"
                            viewBox="0 0 24 24"
                            class="air__stations-notified-icon">
                            <use xlink:href="#airSVGNotify"></use>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            data-favorized-id="${element.id}"
                            fill="${element.favorized ? "rgba(255, 2255, 255, 0.9)" : "rgba(255,255,255,0.0)"}"
                            viewBox="0 0 24 24"
                            class="air__stations-favorized-icon">
                            <use xlink:href="#airSVGFavorize"></use>
                        </svg>`,
                    className: "air__stations-luftdaten-marker",
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                });
            }

            if (element.provider === "upperaustria") {
                marker = L.divIcon({
                    html: `<svg xmlns="http://www.w3.org/2000/svg" 
                        class="" viewBox="0 0 24 24"
                        data-marker-id="${element.id}"
                        style="fill: ${element.components.PM10.update ? element.moodRGBA : "rgba(70,70,70,0.75)"}">
                        <use xlink:href="#airSVGOfficialMarker"></use>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            data-notify-id="${element.id}"
                            fill="${element.notify ? "rgba(255, 2255, 255, 0.9)" : "rgba(255,255,255,0.0)"}"
                            viewBox="0 0 24 24"
                            class="air__stations-notified-icon">
                            <use xlink:href="#airSVGNotify"></use>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg"
                        data-favorized-id="${element.id}"
                        fill="${element.favorized ? "rgba(255, 2255, 255, 0.9)" : "rgba(255,255,255,0.0)"}"
                        viewBox="0 0 24 24"
                        class="air__stations-favorized-icon">
                        <use xlink:href="#airSVGFavorize"></use>
                        </svg>`,
                    className: "air__stations-upperaustria-marker",
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                });
            }

            return (
                <Marker
                    key={element.id}
                    icon={marker}
                    onClick={this.handleClickCircle(element.provider, element.id)}
                    bubblingMouseEvents={false}
                    position={[element.longitude, element.latitude]}
                    title={element.name}
                    stroke={false}
                    fillOpacity={1} />
            )
        });

        this.setState({ stationMarkers: stationMarkers });
    }

    updateStations = () => {
        this.props.stations.forEach(station => {
            let markerID = '[data-marker-id="' + station.id + '"]';
            let marker = document.querySelector(markerID);
            if (marker) {
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

    updateNotifiedStations = () => {
        this.props.stations.forEach(station => {
            if (station.notify) {
                let markerID = '[data-notify-id="' + station.id + '"]';
                let marker = document.querySelector(markerID);

                if (marker) {
                    marker.setAttribute("style", "fill: rgba(255, 255, 255, 0.9)");
                }
            }
            else {
                let markerID = '[data-notify-id="' + station.id + '"]';
                let marker = document.querySelector(markerID);

                if (marker) {
                    marker.setAttribute("style", "fill: rgba(255, 255, 255, 0)");
                }
            }
        })
    }

    render() {
        let location = null;

        if (this.state.hasLocation && this.props.position) {
            let marker = L.divIcon({
                hmtl: "",
                className: "air__icon-location",
                iconSize: [12, 12]
            });

            location = <Marker icon={marker} position={this.props.position}></Marker>
        }

        return (
            <React.Fragment>
                <Map className="air__stations"
                    onClick={this.handleClickMap}
                    onMovestart={this.handleClickMap}
                    // onMoveEnd={this.onMoveEnd}
                    center={this.props.position}
                    zoom={this.state.zoom}
                    maxZoom={16}
                    onZoom={this.onZoom}
                    // onZoomStart={this.onZoomStart}
                    // onZoomEnd={this.onZoomEnd}
                    preferCanvas="true"
                    doubleClickZoom="false"
                    useFlyTo="true"
                    ref="map">
                    <TileLayer
                        // https://wiki.openstreetmap.org/wiki/Tile_servers
                        // https://leaflet-extras.github.io/leaflet-providers/preview/
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        // url="https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    {this.state.stationMarkers}
                    {location}
                    {this.props.children}
                </Map>
            </React.Fragment>
        )
    }
}

export default withRouter(Stations);