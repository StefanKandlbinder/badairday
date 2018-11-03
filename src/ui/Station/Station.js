import React, { Component } from 'react';
import { connect } from 'react-redux';

import { favorizeStation, unfavorizeStation } from "../../redux/actions/stations";
import getMood from '../../utilities/GetMood';
import './Station.css';

class Station extends Component {

    onToggleFavorized = (id) => {
        this.props.onFavorizeStation(id);
    }

    render() {
        let moodStyle = {
            backgroundColor: getMood(this.props.station.mood, 0.75),
            borderColor: getMood(this.props.station.mood, 0.4)
        }

        return <li className="air__station" style={moodStyle} onClick={() => this.onToggleFavorized(this.props.station.id)}>
            <div className="air__station-item air__station--description">
                <div className="air__station-name">{this.props.station.name} {this.props.station.provider === "upperaustria" ? "[AUT]" : ""}</div>
                <div className="air__station-date">{this.props.station.date}</div>
            </div>
            <div className="air__station-item">
                <div className="air__station-favorized">{this.props.station.favorized ? "FAV" : ""}</div>
            </div>
            <div className="air__station-item air__station-item--mood">
                <div className="air__station-mood-main">{this.props.station.components.PM10 ? this.props.station.components.PM10.value.toFixed(2) : 0}</div>
                <div className="air__station-mood-sub">{this.props.station.components.PM25 ? this.props.station.components.PM25.value.toFixed(2) : 0}</div>
            </div>
        </li>
    }
}

const mapStateToProps = state => {
    return {
        stations: state.stations
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onFavorizeStation: (id) => dispatch(favorizeStation(id)),
        onUnfavorizeStation: (id) => dispatch(unfavorizeStation(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Station);