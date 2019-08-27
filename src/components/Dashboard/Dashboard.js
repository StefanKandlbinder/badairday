import React, { Component } from 'react';
import { withRouter } from 'react-router';
import sortBy from 'lodash/sortBy';

import { STATIONS } from "../../redux/actions/stations";

import DashboardItem from "./DashbaordItem";
import Button from "../../components/UI/Button/Button";
import './Dashboard.scss';

class Dashboard extends Component {
    componentDidUpdate(prevProps) {
        if (!this.props.getActive(this.props.stations).length && this.props.getActive(prevProps.stations).length === 1) {
            this.props.history.push("/");
        }
    }

    onHandleBack = () => {
        this.props.onSetFavboard({ state: false, feature: STATIONS });
        this.props.history.push("/");        
    }
    
    render() {
        let stations = this.props.getActive(this.props.stations);

        if (this.props.options.sort) {
          stations = sortBy(stations, ['properties.mood']).reverse();
          
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
            if ((stations[stations.length - 1].properties.mood === 0)) {
                moodStyle = { backgroundColor: "rgba(70, 70, 70, 0.75)" }
            }
            else {
                moodStyle = { backgroundColor: stations[stations.length - 1].properties.moodRGBA };
            }
        }

        else {
            this.props.onSet({ state: false, feature: STATIONS });
        }

        return (
            <ul className="air__dashboard">
                <li className="air__dashboard-header">
                    <Button
                        clicked={this.onHandleBack}
                        className={`air__button air__button-icon air__button--naked air__button--ghost air__button--active air__dashboard-header-button`}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="air__button-icon air__dashboard-header-icon"
                            stroke="rgba(255,255,255,0.9)"
                            strokeWidth="1">
                            <use xlinkHref="#airSVGChevronLeft"></use>
                        </svg>
                    </Button>
                    <div className="air__dahboard-header-title">{this.props.header}</div>
                    <Button
                        className={`air__button air__button-icon air__button--naked air__button--ghost air__button--active air__dashboard-header-button`}>
                    </Button>
                </li>
                {stations.map((station) =>
                    <DashboardItem
                        key={station.properties.id}
                        stations={this.props.stations}
                        station={station}
                        subscription={this.props.subscription}
                        reversegeo={this.props.options.reversegeo} 
                        onFavorizeStation={this.props.onFavorizeStation}
                        onUnfavorizeStation={this.props.onUnfavorizeStation}
                        onNotifyStation={this.props.onNotifyStation}
                        onUnnotifyStation={this.props.onUnnotifyStation}
                        type={this.props.type} />
                )}
                <li className="air__spacer" style={moodStyle}></li>
            </ul>
        );
    }
}

export default withRouter(Dashboard);