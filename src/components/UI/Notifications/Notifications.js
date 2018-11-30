import React, { Component } from 'react';
import { connect } from 'react-redux';

import { removeNotification } from "../../../redux/actions/notifications";
import "./Notifications.scss";

class Notifications extends Component {
  componentDidMount() {
    this.myInterval = setInterval(this.setNotification, 4000);
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  setNotification = () => {
    if (this.props.notifications.length > 1) {
      this.props.onRemoveNotification(this.props.notifications[0].payload.id);
    }
    
    else if (this.props.notifications.length === 1) {
      this.props.onRemoveNotification(this.props.notifications[0].payload.id);
    }
  }

  render() {
    if (this.props.notifications.length) {
      this.type = this.props.notifications[0].meta.type;
    }

    return (
      <div className={`air__notifications air__notifications--${this.type}`}>
        <div className="air__notifications-content">
          {this.props.notifications[0] ? this.props.notifications[0].payload.message : null}
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onRemoveNotification: (id) => dispatch(removeNotification({ notificationId: id, feature: "[Notifications]" }))
  }
}

export default connect(null, mapDispatchToProps)(Notifications);