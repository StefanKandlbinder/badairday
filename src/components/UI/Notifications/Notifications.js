import React, { Component } from 'react';
import { connect } from 'react-redux';

import { removeNotification } from "../../../redux/actions/notifications";
import "./Notifications.css";

class Notifications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notification: null
    }
  }

  componentDidMount() {
    this.myInterval = setInterval(this.setNotification, 3000);
    
    this.setState({
      notification: this.props.notifications[0].message
    })
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  setNotification = () => {

    if (this.props.notifications.length > 1) {
      this.props.onRemoveNotification(this.props.notifications[0].id);
      
      this.setState({
        notification: this.props.notifications[0].message
      })
    }
    else if (this.props.notifications.length === 1) {
      this.setState({
        notification: this.props.notifications[0].message
      }, () => {
        this.props.onRemoveNotification(this.props.notifications[0].id);
      })
    }
  }

  render() {
    return (
      <div className="air__notifications">
        <div className="air__notifications-content">
          {this.state.notification}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    notifications: state.notifications
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onRemoveNotification: (id) => dispatch(removeNotification({ notificationId: id, feature: "[Notifications]" }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);