import React, { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { removeNotification } from '../../../redux/reducers/notificationsReducer';
import { Notification } from '../../../types';
import './Notifications.scss';

interface Props {
  notifications: Notification[];
}

export default function Notifications({ notifications }: Props) {
  const dispatch = useAppDispatch();
  const typeRef = useRef<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (notifications.length > 0) {
        dispatch(removeNotification(notifications[0].id));
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [notifications, dispatch]);

  if (notifications.length) {
    typeRef.current = notifications[0].type;
  }

  return (
    <div className={`air__notifications air__notifications--${typeRef.current}`}>
      <div className="air__notifications-content">
        {notifications[0] ? notifications[0].message : null}
      </div>
    </div>
  );
}
