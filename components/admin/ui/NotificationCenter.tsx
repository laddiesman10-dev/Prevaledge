import React, { useContext } from 'react';
import { SiteDataContext } from '../../../data/siteDataContext';
import NotificationToast from './NotificationToast';

const NotificationCenter: React.FC = () => {
  const { notifications, removeNotification } = useContext(SiteDataContext);

  return (
    <div className="fixed top-6 right-6 z-[100] w-full max-w-sm space-y-3" aria-live="polite">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationCenter;
