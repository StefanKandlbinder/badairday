import React, { Component } from 'react';
import sortBy from 'lodash/sortBy';

import Station from "../Station/Station";
import './Stations.css';

class Stations extends Component {
    render() {
        let stations = this.props.stations;

        if (this.props.options.sort) {
          stations = sortBy(this.props.stations, ['mood']).reverse();
          stations.forEach((station, i) => {
            if (station.favorized) {
                stations.splice(i, 1);
                stations.unshift(station);
            }
          })
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