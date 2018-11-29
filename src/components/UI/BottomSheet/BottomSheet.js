import React from 'react';

import './BottomSheet.scss';

export default props => {
    const { className, children, ...rest } = props;
    
    return (
        <div className={ `air__bottom-sheet ${className}` } { ...rest }>
            {children}
        </div>
    );
}