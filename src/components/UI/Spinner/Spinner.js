import React from 'react';

import './Spinner.scss';

export default props => {
    return (
        <div className="spinner" >
            <div className="spinner__backdrop"></div>
            <div className="spinner__bounce spinner__bounce-1"></div>
            <div className="spinner__bounce spinner__bounce-2"></div>
            <div className="spinner__bounce spinner__bounce-3"></div>
        </div>
    );
}