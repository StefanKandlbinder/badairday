import React from 'react';

import './Toggle.scss';

export default props => {
    const { className, clicked, children, ...rest } = props;

    return (
        <div className={ className } onClick={props.clicked} { ...rest }>
            <label className="air__toggle-label">{children}</label>
            <div className="air__toggle-knob-wrapper">
                <div className="air__toggle-knob"></div>
            </div>
        </div>
    );
}