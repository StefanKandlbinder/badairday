import React from 'react';

import './Spinner.css';

const spinner = (props) => (
    <div className="spinner" >
        <div className="spinner__backdrop"></div>
        <div className="spinner__bounce spinner__bounce-1"></div>
        <div className="spinner__bounce spinner__bounce-2"></div>
        <div className="spinner__bounce spinner__bounce-3"></div>
    </div>
);

export default spinner;