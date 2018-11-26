import React, { Component } from 'react';
import { connect } from 'react-redux';

import { removeNotification } from "../../../redux/actions/notifications";
import "./Notifications.css";

class Notifications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notification: null,
      type: ""
    }
  }

  componentDidMount() {
    this.myInterval = setInterval(this.setNotification, 4000);
    
    this.setState({
      notification: this.props.notifications[0].payload.message
    })

    this.setState({
      type: this.props.notifications[0].meta.type
    })

    console.log(this.props.notifications[0]);
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  setNotification = () => {
    if (this.props.notifications.length > 1) {
      this.props.onRemoveNotification(this.props.notifications[0].payload.id);
      
      this.setState({
        notification: this.props.notifications[0].payload.message
      })

      this.setState({
        type: this.props.notifications[0].meta.type
      })

      
    }
    else if (this.props.notifications.length === 1) {
      this.setState({
        notification: this.props.notifications[0].payload.message
      }, () => {
        this.props.onRemoveNotification(this.props.notifications[0].payload.id);
      })
    }
  }

  render() {
    let classes = "air__notifications";

    if (this.state.type === "info") {
      classes += " air__notifications--info"
    }
    else if (this.state.type === "error") {
      classes += " air__notifications--error"
    }

    return (
      <div className={classes}>
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