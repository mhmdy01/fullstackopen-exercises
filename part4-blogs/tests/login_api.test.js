const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../models/user");
const helpers = require("./test_helpers");

const api = supertest(app);
const API_URL = "/api/login";

beforeEach(async () => {
  await User.deleteMany({});
  const user = helpers.initialUsers[0];
  const userDoc = new User({
    username: user.username,
    name: user.name,
    passwordHash: await bcrypt.hash(user.password, 10),
  });
  await userDoc.save();
});

describe("login", () => {
  test("correct username, password > token", async () => {
    const userToLogin = {
      username: helpers.initialUsers[0].username,
      password: helpers.initialUsers[0].password,
    };
    const res = await api
      .post(API_URL)
      .send(userToLogin)
      .expect(200)
      .expect("content-type", /application\/json/);

    const loggedUser = res.body;
    expect(loggedUser.token).toBeDefined();
    expect(loggedUser.username).toBe(userToLogin.username);
  });
  test("errors: wrong username > 401", async () => {
    const userToLogin_1 = {
      username: "i_dont_exist",
      password: helpers.initialUsers[0].password,
    };
    const userToLogin_2 = {
      username: undefined,
      password: helpers.initialUsers[0].password,
    };

    const res_1 = await api.post(API_URL).send(userToLogin_1).expect(401);
    const res_2 = await api.post(API_URL).send(userToLogin_2).expect(401);
    expect(res_1.body.error).toContain("wrong username or password");
    expect(res_2.body.error).toContain("wrong username or password");
  });
  test("errors: wrong password > 401", async () => {
    const userToLogin_1 = {
      username: helpers.initialUsers[0].username,
      password: "wrong_password",
    };
    const userToLogin_2 = {
      username: helpers.initialUsers[0].username,
      password: undefined,
    };

    const res_1 = await api.post(API_URL).send(userToLogin_1).expect(401);
    const res_2 = await api.post(API_URL).send(userToLogin_2).expect(401);
    expect(res_1.body.error).toContain("wrong username or password");
    expect(res_2.body.error).toContain("wrong username or password");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
