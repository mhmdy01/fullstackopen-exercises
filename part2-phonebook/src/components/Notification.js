import React from "react";

const Notification = ({ notification }) => {
  const baseStyle = {
    margin: 10,
    border: "2px solid",
    borderRadius: 5,
    padding: 10,
    fontSize: 25,
    backgroundColor: "lightgrey",
  };
  const successStyle = {
    ...baseStyle,
    borderColor: "green",
    color: "green",
  };
  const errorStyle = {
    ...baseStyle,
    borderColor: "red",
    color: "red",
  };
  const style = notification.type === "success" ? successStyle : errorStyle;

  return <div style={style}>{notification.msg}</div>;
};

export default Notification;
