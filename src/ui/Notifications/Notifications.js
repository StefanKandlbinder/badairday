import React, { Component } from 'react';
import { connect } from 'react-redux';

import { removeNotification } from "../../redux/actions/notifications";
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
    this.props.onRemoveNotification(this.props.notifications[0].id);

    if (this.props.notifications.length) {
      this.setState({
        notification: this.props.notifications[0].message
      })
    }
  }

  componentDidUpdate(prevProps) {}

  render() {
    return (
      <ul className="Notifications">{this.state.notification}</ul>
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