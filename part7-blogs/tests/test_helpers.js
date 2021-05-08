const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = new Array(5).fill(0).map((e, i) => {
  return {
    link: `link #${i + 1}`,
    title: `title #${i + 1}`,
    author: `author #${i + 1}`,
    likes: 0,
  };
});
const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const initialUsers = [{ username: "root", name: "the root", password: "root" }];
const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const nonValidId = 123;
const nonExistingId = async () => {
  const blog = new Blog(initialBlogs[0]);
  await blog.save();
  await blog.remove();
  return blog._id.toString();
};

const jsonSerialize = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

module.exports = {
  initialBlogs,
  blogsInDb,
  initialUsers,
  usersInDb,
  nonValidId,
  nonExistingId,
  jsonSerialize,
};
