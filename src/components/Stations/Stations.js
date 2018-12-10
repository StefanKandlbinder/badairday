import React, { Component } from 'react';
import { withRouter } from 'react-router';
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

        if (this.props.position !== prevProps.position) {
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
        this.setState({
            hasLocation: true
        }, () => {
            this.refs.map.leafletElement.flyTo(this.props.position, this.state.zoom);
        })
    }

    onZoom = (e) => {
        let zoom = this.refs.map.leafletElement.getZoom();
        console.log(zoom);
    }

    onMoveEnd = (e) => {
        let bounds = this.refs.map.leafletElement.getBounds();
        console.log(bounds);
    }

    getStations = () => {
        let myStations = this.props.stations.map(element => {
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
            <Map className="air__stations"
                onClick={this.handleClickMap}
                onMovestart={this.handleClickMap}
                center={this.props.position}
                zoom={this.state.zoom}
                maxZoom={16}
                // onZoom={this.onZoom}
                // onMoveEnd={this.onMoveEnd}
                // preferCanvas="true"
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
                {this.state.myStations}
                {location}
            </Map>
        )
    }
}

export default withRouter(Stations);