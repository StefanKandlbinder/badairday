import React from 'react';

import './Flex.scss';

export default props => {
    const { className, children, ...rest } = props;

    return (
        <div className={ `${className !== undefined ? props.className : ""}` } { ...rest }>
            {children}
        </div>
    );
}