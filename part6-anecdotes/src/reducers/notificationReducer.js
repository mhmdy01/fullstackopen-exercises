const reducer = (state = "", action) => {
  switch (action.type) {
    case "CREATE_NOTIFICATION":
      return action.payload;
    case "CLEAR_NOTIFICATION":
      return action.payload;
    default:
      return state;
  }
};
export default reducer;

export const createNotification = (notification) => {
  return {
    type: "CREATE_NOTIFICATION",
    payload: notification,
  };
};

export const clearNotification = () => {
  return {
    type: "CLEAR_NOTIFICATION",
    payload: "",
  };
};

let currentNotificationId = null;
export const setNotification = (notification, delay = 3) => {
  return (dispatch) => {
    clearTimeout(currentNotificationId);

    dispatch(createNotification(notification));

    currentNotificationId = setTimeout(() => {
      dispatch(clearNotification());
    }, delay * 1000);
  };
};
