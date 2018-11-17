import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
// import { CSSTransitionGroup } from 'react-transition-group'; /* https://github.com/reactjs/react-transition-group/tree/v1-stable */
import { connect } from 'react-redux';

import getMood from '../../../utilities/GetMood';
import './Tabbar.css';

/* <div className ="air__tabbar-item air__tabbar-item--home">
        <NavLink exact to="/">
            <svg className="air__tabbar-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 600 600">
                    <path d="M289.3 103.1L98.7 484.2c-5.2 10.3 5.8 21.3 16.1 16.1l179.8-89.9c3.4-1.7 7.4-1.7 10.7 0l179.8 89.9c10.3 5.2 21.3-5.8 16.1-16.1L310.7 103.1c-4.4-8.9-17-8.9-21.4 0zm4.1 276.4l-117.2 58.6c-10.3 5.2-21.3-5.8-16.1-16.1l117.2-234.3c5.7-11.3 22.7-7.3 22.7 5.4v175.8c0 4.4-2.6 8.6-6.6 10.6z" fill="#fff" /></svg>
        </NavLink>
    </div>
<div className ="air__tabbar-item air__tabbar-item--home">
            <svg className="air__tabbar-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 600 600">
                    <path d="M289.3 103.1L98.7 484.2c-5.2 10.3 5.8 21.3 16.1 16.1l179.8-89.9c3.4-1.7 7.4-1.7 10.7 0l179.8 89.9c10.3 5.2 21.3-5.8 16.1-16.1L310.7 103.1c-4.4-8.9-17-8.9-21.4 0zm4.1 276.4l-117.2 58.6c-10.3 5.2-21.3-5.8-16.1-16.1l117.2-234.3c5.7-11.3 22.7-7.3 22.7 5.4v175.8c0 4.4-2.6 8.6-6.6 10.6z" fill="#fff" /></svg>
        </div> */

class Tabbar extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();

        this.state = {
            tabItems: []
        }
    }

    componentDidMount() { }

    componentDidUpdate(prevProps) {
        this.props.stations.forEach((station) => {
            if (this.props.favorizedStations.length !== prevProps.favorizedStations.length) {
                this.getTabItems()
            }

            if (this.props.favorizedStations.length && this.props.favorizedStations.length > prevProps.favorizedStations.length) {
                this.scrollToLeft();
            }
        })
    }

    scrollToLeft() {
        if (this.myRef.current) {
            this.myRef.current.scrollLeft = 0;
        }
    }

    getTabItems() {
        let tabItems = [];

        if (this.props.favorizedStations.length) {
            this.props.favorizedStations.forEach((item) => {
                this.props.stations.forEach((station) => {
                    if (station.id === item.id) {
                        tabItems.unshift(<div key={item.id} className="air__tabbar-item">
                            <NavLink
                                style={{ background: getMood(station.mood, "1") }}
                                className="air__tabbar-link"
                                to={"/station/" + item.provider + "/" + item.id}>{item.name}</NavLink>
                        </div>);
                    }
                })
            })
        }

        return (tabItems)
    }

    render() {
        return <div className="air__tabbar">
            <div className="air__tabbar-scroll" ref={this.myRef}>
                { this.getTabItems() }
            </div>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        stations: state.stations,
        favorizedStations: state.favorizedStations
    };
}

export default withRouter(connect(mapStateToProps)(Tabbar));