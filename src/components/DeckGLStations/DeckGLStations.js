import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';
import DeckGL, { HexagonLayer } from 'deck.gl';
import { isWebGL2 } from 'luma.gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
                maxZoom: 16,
                pitch: 0,
                bearing: 0
            },
            hexagon: {
                radius: 700
            }
        }
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
        const data = this.props.stations;

        return [
            new HexagonLayer({
                id: 'hexagon',
                data,
                pickable: true,
                getPosition: data => [data.latitude, data.longitude],
                getColorValue: this._getColorValue,
                // getElevationValue: this._getColorValue,
                radius: this.state.hexagon.radius,
                // elevationRange,
                colorDomain,
                colorRange,
                gpuAggregation: true,
                onClick: (event) => {
                    console.log(event)
                }
                
            })
        ];
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
        const zoom = changed.viewState.zoom 
        let initalRadius = 700;
        // console.log(zoom);

        if (zoom >= 0 && zoom <= 1) {
            this.setState({
                hexagon: { radius: initalRadius * 500}
            })    
        }

        if (zoom > 1 && zoom <= 2) {
            this.setState({
                hexagon: { radius: initalRadius * 300}
            })    
        }

        if (zoom > 2 && zoom <= 3) {
            this.setState({
                hexagon: { radius: initalRadius * 100}
            })    
        }
        if (zoom > 3 && zoom <= 4) {
            this.setState({
                hexagon: { radius: initalRadius * 50}
            })    
        }

        if (zoom > 4 && zoom <= 5) {
            this.setState({
                hexagon: { radius: initalRadius * 30}
            })    
        }

        if (zoom > 5 && zoom <= 6) {
            this.setState({
                hexagon: { radius: initalRadius * 20}
            })    
        }
        if (zoom > 6 && zoom <= 7) {
            this.setState({
                hexagon: { radius: initalRadius * 10}
            })    
        }

        if (zoom > 7 && zoom <= 8) {
            this.setState({
                hexagon: { radius: initalRadius * 5}
            })    
        }

        if (zoom > 8 && zoom <= 9) {
            this.setState({
                hexagon: { radius: initalRadius * 2}
            })    
        }

        if (zoom > 9 && zoom <= 10) {
            this.setState({
                hexagon: { radius: initalRadius}
            })    
        }

        if (zoom > 10 && zoom <= 11) {
            this.setState({
                hexagon: { radius: initalRadius / 2}
            })    
        }

        if (zoom > 11 && zoom <= 12) {
            this.setState({
                hexagon: { radius: initalRadius / 3.333}
            })    
        }

        if (zoom > 12 && zoom <= 13) {
            this.setState({
                hexagon: { radius: initalRadius / 10}
            })    
        }

        if (zoom > 13 && zoom <= 14) {
            this.setState({
                hexagon: { radius: initalRadius / 20}
            })    
        }

        if (zoom > 14 && zoom <= 15) {
            this.setState({
                hexagon: { radius: initalRadius / 33.333}
            })    
        }

        if (zoom > 15 && zoom <= 16) {
            this.setState({
                hexagon: { radius: initalRadius / 50}
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
                layers={this._renderLayers()}
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