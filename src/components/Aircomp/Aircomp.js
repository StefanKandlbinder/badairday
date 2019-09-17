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
                    <div className="air__comp-wind-force">
                        <div className="air__comp-value">{windforce.toFixed(1)}</div>
                        <div className="air__comp-unit">km/h</div>
                    </div>
                )

                break;

            case "TEMP":
                element = (
                    <div className="air__comp air__comp--temp">
                        <svg className="air__comp-temp-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 250.189 250.189">
                            <g>
                                <path d="M159.845,147.251V34.744C159.845,15.586,144.255,0,125.093,0c-19.159,0-34.746,15.586-34.746,34.744v112.506   c-14.234,10.843-22.617,27.59-22.617,45.575c0,31.631,25.732,57.364,57.363,57.364c31.633,0,57.367-25.733,57.367-57.364   C182.46,174.842,174.077,158.095,159.845,147.251z M125.093,235.189c-23.359,0-42.363-19.004-42.363-42.364   c0-14.294,7.188-27.537,19.228-35.425c2.115-1.386,3.39-3.745,3.39-6.273V34.744c0-10.887,8.858-19.744,19.746-19.744   c10.892,0,19.752,8.857,19.752,19.744v116.383c0,2.529,1.274,4.887,3.39,6.273c12.038,7.889,19.226,21.132,19.226,35.425   C167.46,216.185,148.454,235.189,125.093,235.189z"/>
                                <path d="M132.595,169.042V69.924c0-4.142-3.357-7.5-7.5-7.5s-7.5,3.358-7.5,7.5v99.118c-10.104,3.183-17.43,12.622-17.43,23.783   c0,13.767,11.16,24.931,24.93,24.931c13.773,0,24.932-11.164,24.932-24.931C150.026,181.663,142.7,172.223,132.595,169.042z"/>
                            </g>
                        </svg>
                        <div>
                            <div className="air__comp-value">{this.props.value.toFixed(1) || 0.0}°</div>
                            <div className="air__comp-unit">Grad</div>
                        </div>
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