import React from 'react';

import './Spinner.scss';

export default props => {
    return (
        <div className="air__spinner" >
            <div className="air__spinner__backdrop"></div>
            <div className="air__spinner__bounce air__spinner__bounce-1"></div>
            <div className="air__spinner__bounce air__spinner__bounce-2"></div>
            <div className="air__spinner__bounce air__spinner__bounce-3"></div>
        </div>
    );
}