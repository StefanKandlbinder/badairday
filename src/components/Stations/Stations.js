import React, { Component } from 'react';
import { connect } from 'react-redux';
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

const mapStateToProps = state => {
    return {
        stations: state.stations,
        options: state.options
    };
}

const mapDispatchToProps = dispatch => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Stations);