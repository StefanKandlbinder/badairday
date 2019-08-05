import React, { Component } from 'react';
import { withRouter } from 'react-router';
import sortBy from 'lodash/sortBy';

import { STATIONS } from "../../redux/actions/stations";

import DashboardItem from "./DashbaordItem";
import './Dashboard.scss';

class Dashboard extends Component {
    componentDidUpdate(prevProps) {
        if (!this.props.getActive(this.props.stations).length && this.props.getActive(prevProps.stations).length === 1) {
            this.props.history.push("/");
        }
    }
    
    render() {
        let stations = this.props.getActive(this.props.stations);

        if (this.props.options.sort) {
          stations = sortBy(stations, ['mood']).reverse();
          
          /* stations.forEach((station, i) => {
            // put the favorites on top
            if (station.favorized) {
                stations.splice(i, 1);
                stations.unshift(station);
            }
          }) */
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

        else {
            this.props.onSet({ state: false, feature: STATIONS });
        }

        return (
            <ul className="air__dashboard">
                {stations.map((station) =>
                    <DashboardItem
                        key={station.id}
                        station={station} 
                        onAdd={this.props.onAdd} 
                        onRemove={this.props.onRemove}
                        type={this.props.type} />
                )}
                <li className="air__spacer" style={moodStyle}></li>
            </ul>
        );
    }
}

export default withRouter(Dashboard);