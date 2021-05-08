const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("./logger");

const customLogger = (req, res, next) => {
  const msg = `
------
method: ${req.method}
path: ${req.path}
payload: ${JSON.stringify(req.body)}
`;
  logger.info(msg);
  next();
};

const authorizationTokenExtractor = (req, res, next) => {
  const authHeader = req.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    req.token = authHeader.substring(6).trim();
  } else {
    req.token = null;
  }
  next();
};

const authenticatedUserExtractor = async (req, res, next) => {
  const token = req.token;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (token && decodedToken.id) {
    const authenticatedUser = await User.findById(decodedToken.id);
    req.user = authenticatedUser;
  } else {
    req.user = null;
  }
  next();
};

const unknownEndpointHandler = (req, res, next) => {
  res.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  logger.error(`${error.name} | ${error.message}`);
  switch (error.name) {
    case "CastError":
      return res.status(400).json({ error: "wrong field: id" });
    case "ValidationError":
      return res.status(400).json({ error: error.message });
    case "JsonWebTokenError":
      return res.status(401).json({ error: error.message });
    default:
      next(error);
  }
};

module.exports = {
  customLogger,
  authorizationTokenExtractor,
  authenticatedUserExtractor,
  unknownEndpointHandler,
  errorHandler,
};
