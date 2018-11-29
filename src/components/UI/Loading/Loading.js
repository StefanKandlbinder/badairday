import React from 'react';

import './Loading.scss';

export default props => {
    const { children } = props;

    return (
        <div className="air__loading" >
            {children}
        </div>
    );
}