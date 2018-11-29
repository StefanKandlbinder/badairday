import React, { Component } from 'react';

import './Compass.scss';

class Compass extends Component {
    state = {
        orientation: 0,
        available: false,
        platform: navigator.platform
    }

    componentDidMount() {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', this.deviceOrientationHandler.bind(this), false);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('deviceorientation', this.deviceOrientationHandler.bind(this));
    }

    deviceOrientationHandler(event) {
        if (event.webkitCompassHeading && this.state.platform === "iPhone") {
            this.setState({ available: true });
            this.setState({ orientation: event.webkitCompassHeading.toFixed(0) });
        }
    }

    render() {
        let windFrom = 0;
        let grid = 0;
        let winddirection = 0;

        winddirection = this.props.value || 0;

        windFrom = parseFloat(this.state.orientation) - parseFloat(winddirection);
        windFrom = -windFrom;

        grid = -this.state.orientation;

        let windStyle = {
            transform: 'rotate(' + windFrom + 'deg)'
        };

        let gridStyle = {
            transform: 'rotate(' + grid + 'deg)'
        };

        let legendStyle = {
            transform: 'rotate(' + (this.state.orientation) + 'deg)'
        };

        let lineStyle0 = {
            transform: 'rotate(' + (-this.state.orientation) + 'deg)'
        };

        let lineStyle90 = {
            transform: 'rotate(' + (-this.state.orientation + 90) + 'deg)'
        };

        let element = null;

        if (this.state.available) {
            element = <div className="air__compass">
                <div style={windStyle} className="air__compass-wind">
                    <svg
                        // style={windSVGStyle}
                        className="air__compass-wind-svg"
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        id="Layer_1"
                        x="0px" y="0px"
                        width="24px" height="24px"
                        viewBox="0 0 512 512">
                        <path fill={this.props.moodRGBA} d="M348.219,256l92.219,184.438L71.563,256 M512,0L0,256l512,256L384,256L512,0L512,0z" />
                    </svg>
                </div>
                <div style={gridStyle} className="air__compass-grid">
                    <div style={legendStyle} className="air__compass-grid-n">
                        <div className="air__compass-grid-n-text">N</div>
                        <div style={lineStyle0} className="air__compass-grid-n-line"></div>
                    </div>
                    <div style={legendStyle} className="air__compass-grid-o">
                        <div className="air__compass-grid-o-text">O</div>
                        <div style={lineStyle90} className="air__compass-grid-o-line"></div>
                    </div>
                    <div style={legendStyle} className="air__compass-grid-s">
                        <div className="air__compass-grid-s-text">S</div>
                        <div style={lineStyle0} className="air__compass-grid-s-line"></div>
                    </div>
                    <div style={legendStyle} className="air__compass-grid-w">
                        <div className="air__compass-grid-w-text">W</div>
                        <div style={lineStyle90} className="air__compass-grid-w-line"></div>
                    </div>
                </div>
            </div>;
        }

        //  window.requestAnimationFrame(deviceOrientationHandler);

        return element;
    }
}

export default Compass;