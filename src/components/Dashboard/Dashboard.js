import React, { Component } from 'react';
import { withRouter } from 'react-router';
import sortBy from 'lodash/sortBy';

import { getFavorizedStations } from '../../redux/filters/getFavorizedStations';

import DashboardItem from "./DashbaordItem";
import './Dashboard.scss';

class Dashboard extends Component {
    render() {
        let stations = getFavorizedStations(this.props.stations);

        if (this.props.options.sort) {
          stations = sortBy(stations, ['mood']).reverse();
          stations.forEach((station, i) => {
            if (station.favorized) {
                stations.splice(i, 1);
                stations.unshift(station);
            }
          })
        }

        let moodStyle = null;

        if (stations.length) {
            if ((stations[stations.length - 1].mood === 0)) {
                moodStyle = { backgroundColor: "rgba(70, 70, 70, 0.75)" }
            }
            else {
                moodStyle = { backgroundColor: stations[stations.length - 1].moodRGBA };
            }
        }

        return (
            <ul className="air__dashboard">
                {stations.map((station) =>
                    <DashboardItem
                        key={station.id}
                        station={station} />
                )}
                <li className="air__spacer" style={moodStyle}></li>
            </ul>
        );
    }
}

export default withRouter(Dashboard);