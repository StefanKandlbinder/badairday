import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { removeNotification } from '../../../redux/actions/notifications';
import { Notification } from '../../../types';
import './Notifications.scss';

interface Props {
  notifications: Notification[];
}

export default function Notifications({ notifications }: Props) {
  const dispatch = useDispatch();
  const typeRef = useRef<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (notifications.length > 0) {
        dispatch(removeNotification({ notificationId: notifications[0].payload.id, feature: '[Notifications]' }));
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [notifications, dispatch]);

  if (notifications.length) {
    typeRef.current = notifications[0].meta.type;
  }

  return (
    <div className={`air__notifications air__notifications--${typeRef.current}`}>
      <div className="air__notifications-content">
        {notifications[0] ? notifications[0].payload.message : null}
      </div>
    </div>
  );
}
