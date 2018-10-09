import React from 'react';

import './Notifications.css';

export default function Notifications(props) {
    const notifications = props.notifications;
    const listItems = notifications.map((notification) =>
      <li className="Notification" 
        key={notification.id}>
        {notification.message}
      </li>
    );

    return (
      <ul className="Notifications">{listItems}</ul>
    );
  }