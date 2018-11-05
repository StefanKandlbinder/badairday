import React, { Component } from 'react';
import sortBy from 'lodash/sortBy';

import Station from "../../components/Station/Station";
import './Stations.css';

class Stations extends Component {
    render() {
        let stations = this.props.stations;

        if (this.props.options.sort) {
          stations = sortBy(this.props.stations, ['mood']).reverse();
        }

        return (
            <ul className="air__stations">
                {stations.map((station) =>
                    <Station
                        key={station.id}
                        station={station} />
                )}
            </ul>
        );
    }
}

export default Stations;