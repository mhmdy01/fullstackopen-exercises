const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  const authenticatedUser = req.user;
  if (!authenticatedUser) {
    return res.status(401).end();
  }

  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const authenticatedUser = req.user;
  if (!authenticatedUser) {
    return res.status(401).end();
  }

  const recievedBlog = req.body;
  const blogToAdd = new Blog({
    link: recievedBlog.link,
    title: recievedBlog.title,
    author: recievedBlog.author,
    likes: recievedBlog.likes,
    user: authenticatedUser._id,
  });
  const savedBlog = await blogToAdd.save();
  authenticatedUser.blogs = authenticatedUser.blogs.concat(savedBlog._id);
  await authenticatedUser.save();

  res.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (req, res, next) => {
  const authenticatedUser = req.user;
  if (!authenticatedUser) {
    return res.status(401).end();
  }

  const id = req.params.id;
  const blog = await Blog.findOne({ _id: id, user: authenticatedUser._id });
  if (!blog) {
    return res.status(404).end();
  }

  const removedBlog = await blog.remove();
  authenticatedUser.blogs = authenticatedUser.blogs.filter(
    (b) => b.toString() !== removedBlog._id.toString()
  );
  await authenticatedUser.save();

  res.status(204).end();
});

blogsRouter.put("/:id", async (req, res, next) => {
  const authenticatedUser = req.user;
  if (!authenticatedUser) {
    return res.status(401).end();
  }

  const id = req.params.id;
  const recievedBlog = req.body;
  const changedBlog = {
    likes: recievedBlog.likes,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(id, changedBlog, {
    new: true,
    runValidators: true,
  });

  if (!updatedBlog) {
    return res.status(404).end();
  }
  res.json(updatedBlog);
});

module.exports = blogsRouter;
