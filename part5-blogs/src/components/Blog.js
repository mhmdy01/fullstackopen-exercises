import React, { useState } from "react";

const Blog = ({ blog, incrementBlogLikes, deleteBlog, user }) => {
  const [infoVisible, setInfoVisible] = useState(false);

  const toggleInfoVisibility = (event) => {
    setInfoVisible(!infoVisible);
  };

  const showWhenVisible = { display: infoVisible ? "" : "none" };
  const style = {
    margin: 5,
    border: "1px solid black",
    borderRadius: 5,
    padding: 5,
  };

  return (
    <div style={style}>
      <div>
        {blog.title}{" "}
        <button onClick={toggleInfoVisibility}>
          {infoVisible ? "hide" : "show"}
        </button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.link}</div>
        <div>
          {blog.likes} <button onClick={incrementBlogLikes}>like</button>
        </div>
        <div>{blog.author}</div>
        <div>
          {user.username === blog.user.username && (
            <button onClick={deleteBlog}>remove</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
