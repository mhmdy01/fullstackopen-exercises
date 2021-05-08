const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helpers = require("./test_helpers");

const api = supertest(app);
const API_URL = "/api/blogs";

let authorization = null;
beforeEach(async () => {
  await User.deleteMany({});
  const user = helpers.initialUsers[0];
  const userDoc = new User({
    username: user.username,
    name: user.name,
    passwordHash: await bcrypt.hash(user.password, 10),
  });
  const savedUser = await userDoc.save();

  const userFieldsForToken = {
    id: savedUser._id,
    username: savedUser.username,
  };
  const token = jwt.sign(userFieldsForToken, process.env.JWT_SECRET);
  authorization = `Bearer ${token}`;

  await Blog.deleteMany({});
  for (let blog of helpers.initialBlogs) {
    const blogDoc = new Blog({ ...blog, user: savedUser._id });
    const savedBlog = await blogDoc.save();
    savedUser.blogs = savedUser.blogs.concat(savedBlog._id);
    await savedUser.save();
  }
});

describe("read:all", () => {
  test("correct status, headers", async () => {
    await api
      .get(API_URL)
      .set("Authorization", authorization)
      .expect(200)
      .expect("content-type", /application\/json/);
  });
  test("correct data: #records, specific record exists", async () => {
    const res = await api.get(API_URL).set("Authorization", authorization);

    const fetchedBlogs = res.body;
    expect(fetchedBlogs).toHaveLength(helpers.initialBlogs.length);
    expect(fetchedBlogs[0].link).toBe(helpers.initialBlogs[0].link);
    expect(fetchedBlogs.map((b) => b.title)).toContain(
      helpers.initialBlogs[1].title
    );
    expect(fetchedBlogs.map((b) => b.user)).toHaveLength(
      helpers.initialBlogs.length
    );
  });
  test("correct data: each blog has an id field", async () => {
    const res = await api.get(API_URL).set("Authorization", authorization);
    const fetchedBlogs = res.body;
    expect(fetchedBlogs[0].id).toBeDefined();
  });
  test("errors: token (missing or invalid) -> 401", async () => {
    await api
      .get(API_URL)
      // .set("Authorization", authorization)
      .expect(401);

    const wrong_authorization = authorization + "x";
    await api
      .get(API_URL)
      .set("Authorization", wrong_authorization)
      .expect(401);
  });
});

describe("create", () => {
  test("correct status, headers", async () => {
    const blogToAdd = helpers.initialBlogs[0];
    await api
      .post(API_URL)
      .set("Authorization", authorization)
      .send(blogToAdd)
      .expect(201)
      .expect("content-type", /application\/json/);
  });
  test("correct data: created record exists, #records increased", async () => {
    const blogsBefore = await helpers.blogsInDb();
    const blogToAdd = helpers.initialBlogs[0];

    const res = await api
      .post(API_URL)
      .send(blogToAdd)
      .set("Authorization", authorization);
    const createdBlog = res.body;
    expect(createdBlog.link).toBe(blogToAdd.link);

    const blogsAfter = await helpers.blogsInDb();
    expect(blogsAfter).toHaveLength(blogsBefore.length + 1);
    expect(blogsAfter.map((b) => b.title)).toContain(blogToAdd.title);
  });
  test("correct data: created blog must have a user field", async () => {
    const blogToAdd = helpers.initialBlogs[0];

    const res = await api
      .post(API_URL)
      .send(blogToAdd)
      .set("Authorization", authorization);
    const createdBlog = res.body;
    expect(createdBlog.user).toBeDefined();

    const usersInDb = await helpers.usersInDb();
    expect(usersInDb[0].id).toBe(createdBlog.user);
  });
  test("errors: constraints (optional field missing) > use dflt", async () => {
    const blogsBefore = await helpers.blogsInDb();
    const blogToAdd = {
      ...helpers.initialBlogs[0],
      likes: undefined,
    };

    const res = await api
      .post(API_URL)
      .set("Authorization", authorization)
      .send(blogToAdd)
      .expect(201);
    const createdBlog = res.body;
    expect(createdBlog.likes).toBeDefined();
    expect(createdBlog.likes).toBe(0);

    const blogsAfter = await helpers.blogsInDb();
    expect(blogsAfter).toHaveLength(blogsBefore.length + 1);
  });
  test("errors: constraints (required field missing) > 400", async () => {
    const blogsBefore = await helpers.blogsInDb();
    const blogToAdd_1 = { ...helpers.initialBlogs[0], link: undefined };
    const blogToAdd_2 = { ...helpers.initialBlogs[0], title: undefined };

    await api
      .post(API_URL)
      .set("Authorization", authorization)
      .send(blogToAdd_1)
      .expect(400);
    await api
      .post(API_URL)
      .set("Authorization", authorization)
      .send(blogToAdd_2)
      .expect(400);

    const blogsAfter = await helpers.blogsInDb();
    expect(blogsAfter).toHaveLength(blogsBefore.length);
  });
  test("errors: token (missing or invalid) -> 401", async () => {
    const blogToAdd = helpers.initialBlogs[0];

    await api
      .post(API_URL)
      // .set("Authorization", authorization)
      .send(blogToAdd)
      .expect(401)
      .expect("content-type", /application\/json/);

    const wrong_authorization = authorization + "x";
    await api
      .post(API_URL)
      .set("Authorization", wrong_authorization)
      .send(blogToAdd)
      .expect(401)
      .expect("content-type", /application\/json/);
  });
});

describe("delete:one", () => {
  test("correct status, headers", async () => {
    const blogsInDb = await helpers.blogsInDb();
    const blogToDelete = blogsInDb[0];

    await api
      .delete(`${API_URL}/${blogToDelete.id}`)
      .set("Authorization", authorization)
      .expect(204);
  });
  test("correct data: deleted record doesn't exist, #records decreased", async () => {
    const blogsBefore = await helpers.blogsInDb();
    const blogToDelete = blogsBefore[0];

    await api
      .delete(`${API_URL}/${blogToDelete.id}`)
      .set("Authorization", authorization);

    const blogsAfter = await helpers.blogsInDb();
    expect(blogsAfter).toHaveLength(blogsBefore.length - 1);
    expect(blogsAfter.map((b) => b.link)).not.toContain(blogToDelete.link);
  });
  test("errors: wrong id (not found: 404, not valid: 400)", async () => {
    const nonExistingId = await helpers.nonExistingId();
    const nonValidId = helpers.nonValidId;

    await api
      .delete(`${API_URL}/${nonExistingId}`)
      .set("Authorization", authorization)
      .expect(404);

    await api
      .delete(`${API_URL}/${nonValidId}`)
      .set("Authorization", authorization)
      .expect(400);

    const blogsInDb = await helpers.blogsInDb();
    expect(blogsInDb).toHaveLength(helpers.initialBlogs.length);
  });
  test("errors: token (missing or invalid) -> 401", async () => {
    const blogsInDb = await helpers.blogsInDb();
    const blogToDelete = blogsInDb[0];

    await api
      .delete(`${API_URL}/${blogToDelete.id}`)
      // .set("Authorization", authorization)
      .expect(401);

    const wrong_authorization = authorization + "x";
    await api
      .delete(`${API_URL}/${blogToDelete.id}`)
      .set("Authorization", wrong_authorization)
      .expect(401);
  });
});

describe("update", () => {
  test("correct status, headers, data (field value changed)", async () => {
    const blogsInDb = await helpers.blogsInDb();
    const blogToUpdate = blogsInDb[0];
    const changedBlog = helpers.jsonSerialize({
      ...blogToUpdate,
      likes: blogToUpdate.likes + 100,
    });

    const res = await api
      .put(`${API_URL}/${blogToUpdate.id}`)
      .set("Authorization", authorization)
      .send(changedBlog)
      .expect(200)
      .expect("content-type", /application\/json/);

    const updatedBlog = res.body;
    expect(updatedBlog.likes).not.toBe(blogToUpdate.likes);
    expect(updatedBlog.likes).toBe(changedBlog.likes);
  });
  test("errors: wrong id (notfound -> 404, notvalid -> 400)", async () => {
    const blogsInDb = await helpers.blogsInDb();
    const blogToUpdate = blogsInDb[0];
    const changedBlog = helpers.jsonSerialize({
      ...blogToUpdate,
      likes: blogToUpdate.likes + 100,
    });
    const nonExistingId = await helpers.nonExistingId();
    const nonValidId = helpers.nonValidId;

    await api
      .put(`${API_URL}/${nonExistingId}`)
      .set("Authorization", authorization)
      .send(changedBlog)
      .expect(404);

    await api
      .put(`${API_URL}/${nonValidId}`)
      .set("Authorization", authorization)
      .send(changedBlog)
      .expect(400);
  });
  test("errors: token (missing or invalid) -> 401", async () => {
    const blogsInDb = await helpers.blogsInDb();
    const blogToUpdate = blogsInDb[0];
    const changedBlog = helpers.jsonSerialize({
      ...blogToUpdate,
      likes: blogToUpdate.likes + 100,
    });

    await api
      .put(`${API_URL}/${blogToUpdate.id}`)
      // .set("Authorization", authorization)
      .send(changedBlog)
      .expect(401);

    const wrong_authorization = authorization + "x";
    await api
      .put(`${API_URL}/${blogToUpdate.id}`)
      .set("Authorization", wrong_authorization)
      .send(changedBlog)
      .expect(401);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
