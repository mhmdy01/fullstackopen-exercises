const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res, next) => {
  const users = await User.find({}).populate("blogs", {
    link: 1,
    title: 1,
    author: 1,
  });
  res.json(users);
});

usersRouter.post("/", async (req, res, next) => {
  const receivedUser = req.body;
  if (!receivedUser.password || receivedUser.password.length < 3) {
    return res
      .status(400)
      .json({ error: "password must be 3 characters or more" });
  }

  const saltRounds = 10;
  const userToAdd = new User({
    username: receivedUser.username,
    name: receivedUser.name,
    passwordHash: await bcrypt.hash(receivedUser.password, saltRounds),
  });
  const savedUser = await userToAdd.save();

  res.status(201).json(savedUser);
});

module.exports = usersRouter;
