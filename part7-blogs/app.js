require("express-async-errors");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const blogsRouter = require("./controllers/blogs");
const middleware = require("./utils/middleware");
const config = require("./utils/config");
const logger = require("./utils/logger");

mongoose
  .connect(config.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((msg) => logger.info(`connect_db | success | ${config.DB_URL}`))
  .catch((error) => {
    logger.error(`connect_db | error | ${error.name} | ${error.message}`);
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(middleware.customLogger);

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(
  "/api/blogs",
  middleware.authorizationTokenExtractor,
  middleware.authenticatedUserExtractor,
  blogsRouter
);

app.use(middleware.unknownEndpointHandler);
app.use(middleware.errorHandler);

module.exports = app;
