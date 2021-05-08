const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  link: { type: String, required: true },
  title: { type: String, required: true },
  author: String,
  likes: { type: Number, required: false, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
blogSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
