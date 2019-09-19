import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { CSSTransition } from 'react-transition-group';

import L from 'leaflet';
import { Map, TileLayer, Marker, withLeaflet } from 'react-leaflet';

import { STATIONS } from "../../redux/actions/stations";
import './Stations.scss';

import HexbinLayer from './HexBinLayer';
import Dashboard from '../../components/Dashboard/Dashboard';

const WrappedHexbinLayer = withLeaflet(HexbinLayer);
const options = {};

class Stations extends Component {
    constructor(props) {
        super(props);

        this.map = React.createRef();
        this.centerTimeout = null;

        this.state = {
            hasLocation: false,
            hasCenter: false,
            zoom: 13,
            stationMarkers: [],
            polygons: null,
            hexToStation: [],
            clusterIds: [],
            zoomEnd: false,
            moveEnd: false,
            res: 9
        };
    }

    componentDidMount() {
        this.map.current.leafletElement.zoomControl.setPosition("bottomleft");
    }

    componentDidUpdate(prevProps) {
        if (this.props.position !== prevProps.position) {
            this.handleLocation();
        }

        if (this.props.center !== prevProps.center) {
            this.posCenter();
        }

        if ((this.state.moveEnd || this.state.zoomEnd) && this.state.hasCenter) {
            this.showCenter();
        }
    }

    handleHexCLick = (d, i, coords) => {
        if (d.length <= 1) {
            this.props.history.push({
                pathname: "/station/" + d[0].o.properties.provider + "/" + d[0].o.properties.id,
                state: {
                    x: coords[0],
                    y: coords[1]
                }
            });
        }
        else {
            this.getClusterIds(d);

            this.setState({
                
            })
        }
    }

    // go back to the main route
    handleMoveStart = () => {
        if (this.props.location.pathname === "/bottomsheet" || this.props.location.pathname.includes("/station")) {
            this.props.history.push("/");
        }

        if (this.props.media === "small" && this.props.favboard) {
            this.props.history.push("/");
            this.props.onSetFavboard({ state: false, feature: STATIONS });
        }

        if (this.props.clusterboard) {
            this.props.history.push("/");
            this.props.onSetClusterboard({ state: false, feature: STATIONS });
        }
    }

    handleLocation = () => {
        this.setState({
            hasLocation: true
        }, () => {
            this.props.history.push("/");
            this.map.current.leafletElement.setView(this.props.position, this.state.zoom);
        })
    }

    posCenter = () => {
        this.setState({
            hasCenter: true,
            zoomEnd: false,
            moveEnd: false
        }, () => {
            this.map.current.leafletElement.setView(
                { lat: this.props.center.station.geometry.coordinates[0],
                  lng: this.props.center.station.geometry.coordinates[1] }, 
                  13
            );
            // this.map.current.leafletElement.panBy([0, 50]);
        })
    }

    showCenter = () => {
        this.centerTimeout = window.setTimeout(() => {
            this.props.history.push({
                pathname: "/station/" + this.props.center.station.properties.provider + "/" + this.props.center.station.properties.id + "/center",
                state: {
                    x: "50%",
                    y: "50%"
                }
            });
        }, 200);

        this.setState({
            hasCenter: false
        })
    }

    onZoom = (e) => {
        // let zoom = this.map.current.leafletElement.getZoom();
    }

    onZoomStart = (e) => {
        this.setState({
            zoomEnd: false,
            zoomStart: true
        })

        this.markerPane = document.getElementsByClassName("leaflet-marker-pane")[0];
        this.markerPane.style.animationDelay = "0s";
        this.markerPane.style.opacity = 0;
        console.log("Zoom started!");
    }

    onZoomEnd = (e) => {
        this.setState({
            zoomStart: false,
            zoomEnd: true
        })
        // this.markerPane.style.animationDelay = "1s";
        // this.markerPane.style.opacity = 1;
        /* this.setState({
            zoom: this.map.current.leafletElement.getZoom()
        }, () => {
            this.setState({
                res: this.setRes(this.state.zoom)
            }, () => {
                this.getHexIds(this.state.res)
            })

        }) */
        /* let bounds = this.map.current.leafletElement.getBounds();
        let center = this.map.current.leafletElement.getCenter();
        let distance = this.map.current.leafletElement.distance(L.latLng(bounds._northEast.lat, bounds._northEast.lng),L.latLng(bounds._southWest.lat, bounds._southWest.lng));

        luftdatenURL += bounds._northEast.lat + "," + 
            bounds._northEast.lng + "," +
            bounds._southWest.lat + "," +
            bounds._southWest.lng + ",";

        let url = luftdatenURLRadius + center.lat + "," + center.lng + "," + Math.round(distance / 1000);
        
        console.info(url); */
            
        // this.props.onFetchStations(url, luftdatenProvider, "FETCH");

        console.log("Zoom ended!");
    }

    onMoveEnd = (e) => {
        this.setState({
            moveEnd: true
        })
    }

    getClusterIds(d) {
        let ids = [];

        d.forEach(d => {
            this.props.stations.features.forEach(station => {
                if (station.properties.id === d.o.properties.id) {
                    ids.push(station.properties.id)
                }
            })
        })

        this.setState({
            clusterIds: ids
        }, () => {
            this.props.onSetClusterboard({ state: true, feature: STATIONS });
            this.props.history.push("/clusterboard");
        })
    }

    render() {
        let location = null;
        let center = null;
        let hexbins = null;
        let clusterBoard = null;

        clusterBoard = <div className="air__site air__site--favboard air__site--cluster">
            <Dashboard 
                stations={this.props.stations}
                header="Cluster"
                options={this.props.options}
                media={this.props.media}
                subscription={this.props.subscription}
                onSetFavboard={this.props.onSetFavboard}
                onSetClusterboard={this.props.onSetClusterboard}
                onFavorizeStation={this.props.onFavorizeStation}
                onUnfavorizeStation={this.props.onUnfavorizeStation}
                onNotifyStation={this.props.onNotifyStation}
                onUnnotifyStation={this.props.onUnnotifyStation}
                onSetCenter={this.props.onSetCenter}
                getActive={this.state.clusterIds}
                type = "cluster" />
        </div>;

        if (this.props.stations.features.length) {
            hexbins = <WrappedHexbinLayer 
                data={this.props.stations}
                updating={this.props.updating}
                timestamp = {this.props.update.timestamp}
                onClick={this.handleHexCLick}
                {...options} />
        }

        if (this.state.hasLocation && this.props.position) {
            let marker = L.divIcon({
                hmtl: "",
                className: "air__icon-location",
                iconSize: [12, 12]
            });

            location = <Marker icon={marker} position={this.props.position}></Marker>
        }

        /* if (this.state.hasCenter) {
            let marker = L.divIcon({
                hmtl: "",
                className: "air__icon-center",
                iconSize: [12, 12]
            });

            center = <Marker icon={marker} position={this.props.center}></Marker>
        } */

        return (
            <React.Fragment>
                <Map className="air__stations"
                    onClick={this.handleClickMap}
                    onMovestart={this.handleMoveStart}
                    onMoveEnd={this.onMoveEnd}
                    center={this.props.position}
                    zoom={this.state.zoom}
                    maxZoom={15}
                    minZoom={2}
                    // onZoom={this.onZoom}
                    // onZoomStart={this.onZoomStart}
                    onZoomEnd={this.onZoomEnd}
                    preferCanvas="true"
                    doubleClickZoom="false"
                    useFlyTo="false"
                    ref={this.map} >
                    <TileLayer
                        // https://wiki.openstreetmap.org/wiki/Tile_servers
                        // https://leaflet-extras.github.io/leaflet-providers/preview/
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        // url="https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    {location}
                    {center}
                    {hexbins}
                    {this.props.children}
                </Map>

                <CSSTransition
                    in={this.props.clusterboard}
                    // in={this.props.media === "medium" ? true : false}
                    classNames="air__animation-site-transition"
                    timeout={300}
                    mountOnEnter
                    unmountOnExit>
                    {clusterBoard}
                </CSSTransition>
            </React.Fragment>
        )
    }
}

export default withRouter(Stations);