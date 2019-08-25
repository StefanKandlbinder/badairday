import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {H3ClusterLayer} from '@deck.gl/geo-layers';
import { isWebGL2 } from 'luma.gl';
import geojson2h3 from 'geojson2h3';
import 'mapbox-gl/dist/mapbox-gl.css';
import getMood from '../../utilities/getMood';

const h3 = require("h3-js");

// Set your mapbox token here
const MAPBOX_TOKEN = "pk.eyJ1IjoiYmFkYWlyZGF5IiwiYSI6ImNqcHdtNmlubzA1N2Y0Mm8xa2UyMXJzcTcifQ.nkVX7LX7t6tR2VX71ZpI3A";

const colorDomain = [0, 500];
const colorRange = [
    [0, 121, 107, 200],
    [0, 121, 107, 200],
    [249, 168, 37, 200],
    [230, 81, 0, 200],
    [221, 44, 0, 200], 
    [150, 0, 132, 200]
];

const elevationRange = [0, 500];

export default class DeckGLStations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewport: {
                width: "100%",
                height: "100%",
                longitude: this.props.position.lng,
                latitude: this.props.position.lat,
                zoom: 10,
                maxZoom: 13.5,
                pitch: 0,
                bearing: 0
            },
            hexagons: null,
            resolution: 8
        }
    }

    componentDidMount() {
        this._renderLayers();
    }

    _getColorValue(points) {
        let sum = 0;

        points.forEach(element => {
            sum += element.mood;
        })

        const mean = sum / points.length;

        // console.log(points, points.length, mean);

        return 200;
    }

    _renderLayers() {
        const hexagons = this.props.stations.features.map(feature => {
            const [lng, lat] = feature.geometry.coordinates;
            let mood = getMood(feature.properties.mood, 1).replace("rgb(", "").replace(")", "");
            mood = mood.split(",");

            const hexagon = {
                mean: mood,
                count: 1,
                hexIDs: [
                    h3.geoToH3(lng, lat, this.state.resolution)
                ]
            }

            return hexagon;
        });
        
        // const hexagonSet = h3.h3SetToMultiPolygon(hexagons, false);

        // console.info(hexagonSet);
        this.setState({
            hexagons: new H3ClusterLayer({
                id: 'h3-cluster-layer',
                data: hexagons,
                pickable: true,
                stroked: true,
                filled: true,
                extruded: false,
                opacity: 0.75,
                getHexagons: d => d.hexIDs,
                getFillColor: d => [parseInt(d.mean[0]), parseInt(d.mean[1]), parseInt(d.mean[2])],
                getLineColor: [255, 255, 255],
                lineWidthMinPixels: 1,
                onClick: ({object}) => {
                    console.info(object);
                }
              })
        })
    }

    _onInitialized(gl) {
        if (!isWebGL2(gl)) {
            console.warn('GPU aggregation is not supported'); // eslint-disable-line
            if (this.props.disableGPUAggregation) {
                this.props.disableGPUAggregation();
            }
        }
    }

    mapChanged = (changed) => {
        // console.log(changed);
        // console.log(changed.isZooming);
    }

    _viewStateChanged = (changed) => {
        const zoom = changed.viewState.zoom;

        if (zoom >= 0 && zoom <= 1.5) {
            this.setState({
                resolution: 1
            }, () => {
                this._renderLayers();
            })    
        }

        if (zoom > 1.5 && zoom <= 3) {
            this.setState({
                resolution: 2
            }, () => {
                this._renderLayers();
            })    
        }

        if (zoom > 3 && zoom <= 4.5) {
            this.setState({
                resolution: 3
            }, () => {
                this._renderLayers();
            })    
        }
        if (zoom > 4.5 && zoom <= 6) {
            this.setState({
                resolution: 4
            }, () => {
                this._renderLayers();
            })    
        }

        if (zoom > 6 && zoom <= 7.5) {
            this.setState({
                resolution: 5
            }, () => {
                this._renderLayers();
            })    
        }

        if (zoom > 7.5 && zoom <= 8.5) {
            this.setState({
                resolution: 6
            }, () => {
                this._renderLayers();
            })    
        }

        if (zoom > 8.5 && zoom <= 9.5) {
            this.setState({
                resolution: 7
            }, () => {
                this._renderLayers();
            })    
        }

        if (zoom > 9.5 && zoom <= 11) {
            this.setState({
                resolution: 8
            }, () => {
                this._renderLayers();
            })    
        }

        if (zoom > 11 && zoom <= 13) {
            this.setState({
                resolution: 9
            }, () => {
                this._renderLayers();
            })    
        }

        if (zoom > 12.5 && zoom <= 13.5) {
            this.setState({
                resolution: 10
            }, () => {
                this._renderLayers();
            })    
        }
        // console.log(this.state.hexagon.radius, zoom);
        // console.log(this.refs.map.getMap());
        // this.radius = (this.state.maxZoom - zoom) * 100;
        // console.log(changed.isZooming);
    }

    render() {
        const { viewport } = this.state;

        return (
            <DeckGL
                layers={this.state.hexagons}
                initialViewState={viewport}
                onWebGLInitialized={this._onInitialized.bind(this)}
                onViewStateChange={this._viewStateChanged}
                //viewState={...viewport}
                controller={true}>
                    <ReactMapGL
                        reuseMaps
                        // mapStyle="mapbox://styles/mapbox/dark-v9"
                        preventStyleDiffing={true}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                        ref="map"
                        // onInteractionStateChange={this.mapChanged}
                    />                
            </DeckGL>
        );
    }
}