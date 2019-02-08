import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';
import DeckGL, { ScreenGridLayer } from 'deck.gl';
// import 'mapbox-gl/dist/mapbox-gl.css';

import './MapGLStations.scss';

const colorDomain = [1, 500];
const colorRange = [
    [0, 121, 107, 75],
    [249, 168, 37, 75],
    [230, 81, 0, 75],
    [221, 44, 0, 0.75], [150, 0, 132, 75]];

class MapGLStations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewport: {
                width: "100%",
                height: "100%",
                zoom: 10,
                longitude: this.props.position.lng,
                latitude: this.props.position.lat
            }
        }
    }

    updateViewport = (viewport) => {
        // console.log(this);
        this.setState({ viewport });
    }

    render() {
        const data = this.props.stations;
        
        const layer = new ScreenGridLayer({
            id: 'screen-grid-layer',
            data,
            pickable: false,
            opacity: 0.8,
            cellSizePixels: 40,
            colorDomain,
            colorRange,
            getPosition: data => [data.longitude, data.latitude],
            getWeight: data => data.mood,
            onHover: ({ object, x, y }) => {
                const tooltip = 'aggregated cell';
                /* Update tooltip
                   http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
                */
            }
        });
        
        const { viewport } = this.state;

        return (
            <ReactMapGL
                {...viewport}
                reuseMaps={true}
                layers={[layer]}
                mapboxApiAccessToken={"pk.eyJ1IjoiYmFkYWlyZGF5IiwiYSI6ImNqcHdtNmlubzA1N2Y0Mm8xa2UyMXJzcTcifQ.nkVX7LX7t6tR2VX71ZpI3A"}
                onViewportChange={this.updateViewport}
            />
        )
    }
}

export default MapGLStations;