import React from 'react';

import './Spacer.scss';

export default props => {
    const { className, ...rest } = props;

    return (
        <div className={ `air__spacer ${className !== undefined ? props.className : ""}` } { ...rest }></div>
    );
}