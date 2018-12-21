import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import './MapGLStations.scss';

class MapGLStations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewport: {
                width: "100vw",
                height: "100vh",
                latitude: 48.323368,
                longitude: 14.298756,
                zoom: 10
            }
        }
    }

    render() {
        return (
            <ReactMapGL
                mapboxApiAccessToken={"pk.eyJ1IjoiYmFkYWlyZGF5IiwiYSI6ImNqcHdtNmlubzA1N2Y0Mm8xa2UyMXJzcTcifQ.nkVX7LX7t6tR2VX71ZpI3A"}
                {...this.state.viewport}
                onViewportChange={(viewport) => this.setState({ viewport })}
            />
        )
    }
}

export default MapGLStations;