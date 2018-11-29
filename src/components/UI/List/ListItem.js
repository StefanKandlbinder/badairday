import React from 'react';

import './ListItem.scss';

export default props => {
    const { className, children, ...rest } = props;

    return (
        <div className={ className } { ...rest }>
            {children}
        </div>
    );
}