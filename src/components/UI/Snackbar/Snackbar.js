import React, { Component } from 'react';

import Button from '../Button/Button';
import './Snackbar.css';

class Snackbar extends Component {
    constructor(props) {
        super(props);
        this.state = { didMount: false };
    }


    componentDidMount() {
        this.setState({ didMount: true })
    }

    onClick() {
        window.location.pathname = "";
        
        // window.location.reload(true);
    }

    render() {
        let element = <div>
            <div className="air__background">
                <svg className="air__background-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 600 600">
                    <path d="M289.3 103.1L98.7 484.2c-5.2 10.3 5.8 21.3 16.1 16.1l179.8-89.9c3.4-1.7 7.4-1.7 10.7 0l179.8 89.9c10.3 5.2 21.3-5.8 16.1-16.1L310.7 103.1c-4.4-8.9-17-8.9-21.4 0zm4.1 276.4l-117.2 58.6c-10.3 5.2-21.3-5.8-16.1-16.1l117.2-234.3c5.7-11.3 22.7-7.3 22.7 5.4v175.8c0 4.4-2.6 8.6-6.6 10.6z" fill="#fff" /></svg>
            </div>
            <div className="air__snackbar-wrapper" data-show={this.state.didMount}>
                <div className="air__snackbar">
                    <div className="air__snackbar-header">{this.props.header}</div>
                    <div className="air__snackbar-cta" onClick={this.onClick}>
                        <Button title={this.props.cta} />
                    </div>
                </div>
            </div>
        </div>

        return element
    }
}

export default Snackbar;