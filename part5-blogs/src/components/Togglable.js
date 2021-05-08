import React, { useState, useImperativeHandle } from "react";

const Togglable = React.forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisiblity = (e) => setIsVisible(!isVisible);

  useImperativeHandle(ref, () => ({ toggleVisiblity }));

  const showWhenVisible = { display: isVisible ? "" : "none" };
  const hideWhenVisible = { display: isVisible ? "none" : "" };

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisiblity}>{props.label}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisiblity}>cancel</button>
      </div>
    </div>
  );
});

Togglable.displayName = "Togglable";

export default Togglable;
