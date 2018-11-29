import React, { Component } from 'react';

import './Aircomp.scss';

class Aircomp extends Component {

    render() {
        let element = null;
        let windforce = 0;
        let winddirection = 0;

        switch (this.props.component) {
            case "NO2":
            case "PM10":
            case "PM25":
                let classes = "air__comp air__comp--dust air__comp--dust-" + this.props.component;

                if(this.props.value > 0) {
                    element = (
                        <div className={classes}>
                            <div className="air__comp-title">{this.props.component}:</div>
                            <div className="air__comp-value">{this.props.value === 0 ? "-" : this.props.value}<span className="air__comp-unit">&nbsp;{this.props.unit}</span></div>
                        </div>
                    )
                }

                break;

            case "WIR":
                winddirection = this.props.value || 0;

                const divStyle = {
                    transform: 'rotate(' + (winddirection - 180) + 'deg)'
                };

                element = (
                    <div className="air__comp-wind-direction" style={divStyle}>
                        <svg className="air__comp-wind-direction-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 600 600">
                            <path d="M289.3 103.1L98.7 484.2c-5.2 10.3 5.8 21.3 16.1 16.1l179.8-89.9c3.4-1.7 7.4-1.7 10.7 0l179.8 89.9c10.3 5.2 21.3-5.8 16.1-16.1L310.7 103.1c-4.4-8.9-17-8.9-21.4 0zm4.1 276.4l-117.2 58.6c-10.3 5.2-21.3-5.8-16.1-16.1l117.2-234.3c5.7-11.3 22.7-7.3 22.7 5.4v175.8c0 4.4-2.6 8.6-6.6 10.6z" fill="#fff" />
                            <style xmlns="" /></svg>
                    </div>
                )

                break;

            case "WIV":
                windforce = this.props.value || 0;

                element = (
                    <div className="air__comp-wind-force">{windforce.toFixed(1)} km/h</div>
                )

                break;

            case "TEMP":
                element = (
                    <div
                        className="air__comp air__comp--temp"
                        style={{
                            fontSize: this.props.unit === 'Grad' ? '11px' : 'inherit'
                        }}>
                        <div className="air__comp-value">{this.props.value.toFixed(1) || 0.0}</div>
                        <div className="air__comp-unit">&nbsp;°C</div>
                    </div>
                )
                break;

            default:
                break;
        }

        return element;
    }
}

export default Aircomp;