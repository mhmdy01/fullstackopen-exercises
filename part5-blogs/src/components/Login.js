import React from "react";
import PropTypes from "prop-types";

const Login = ({
  login,
  username,
  updateUsername,
  password,
  updatePassword,
}) => {
  return (
    <div>
      <h2>login</h2>
      <form onSubmit={login}>
        <div>
          username:{" "}
          <input value={username} onChange={updateUsername} required />
        </div>
        <div>
          password:{" "}
          <input
            type="password"
            value={password}
            onChange={updatePassword}
            required
          />
        </div>
        <div>
          <input type="submit" value="log in" />
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  updateUsername: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default Login;
