import React from 'react';

import './Flex.css';

const flex = (props) => (
    <div className={`air__flex ${ props.className !== undefined ? props.className : "" }`}>
        {props.children}
    </div>
);

export default flex;