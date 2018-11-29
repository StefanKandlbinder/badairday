import React from 'react';

import './Button.scss';

export default props => {
    const { className, children, clicked, ...rest } = props;

    return (
        <button className={ className } onClick={props.clicked} { ...rest }>
            {children}
        </button>
    );
}