import React from "react";
import Notification from "./Notification";

const Notifications = ({ notifications }) => {
  return (
    <div>
      {notifications.map((notif) => (
        <Notification key={notif.id} notification={notif} />
      ))}
    </div>
  );
};

export default Notifications;
