import React from 'react';

import './Legend.scss';

export default props => {
    const { className, children, ...rest } = props;

    return (
        <div className={`air__legend ${className !== undefined ? className : ""}`} { ...rest }>
            <div className="air__legend-scale">
                <div className="air__legend-scale-stop air__legend-scale-stop--0">0 µg/m³</div>
                <div className="air__legend-scale-stop air__legend-scale-stop--1">25</div>
                <div className="air__legend-scale-stop air__legend-scale-stop--2 air__legend-scale--limit">
                    <div className="air__legend-scale--limit-text">50 PM10</div>
                </div>
                <div className="air__legend-scale-stop air__legend-scale-stop--3">75</div>
                <div className="air__legend-scale-stop air__legend-scale-stop--4">100</div>
                <div className="air__legend-scale-stop air__legend-scale-stop--5">500</div>
            </div>
        </div>
    );
}