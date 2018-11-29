import React, { Component } from 'react';
import { withRouter } from 'react-router';

import './Tabbar.scss';

class Tabbar extends Component {
    render() {
        return <div className="air__tabbar">
            {this.props.children}
        </div>
    }
}

export default withRouter(Tabbar);