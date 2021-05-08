import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Login from "./components/Login";
import NewBlog from "./components/NewBlog";
import Notifications from "./components/Notifications";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    const getCachedUser = () => {
      const cachedUserJSON = window.localStorage.getItem("loggedUser");
      if (cachedUserJSON) {
        const cachedUser = JSON.parse(cachedUserJSON);
        setUser(cachedUser);
      }
    };
    getCachedUser();
  }, []);
  useEffect(() => {
    const setCachedUser = () => {
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
    };
    setCachedUser();

    if (!user) {
      return;
    }
    blogService.setAuthorizationHeader(user.token);
    const fetchBlogs = async () => {
      const fetchedBlogs = await blogService.getAll();
      setBlogs(fetchedBlogs);
    };
    fetchBlogs();
  }, [user]);

  const blogFormRef = useRef();

  const updateUsername = (event) => {
    setUsername(event.target.value);
  };
  const updatePassword = (event) => {
    setPassword(event.target.value);
  };
  const updateSortOrder = (event) => {
    setSortOrder(event.target.value);
  };

  const login = async (event) => {
    event.preventDefault();
    const credentials = { username, password };
    // console.log("log in:", credentials);
    try {
      const loggedUser = await loginService.login(credentials);
      setUser(loggedUser);
      setUsername("");
      setPassword("");
      createNotification({
        type: "success",
        msg: `${loggedUser.username} logged in`,
      });
    } catch (error) {
      console.log({ ...error });
      let errorMsg = error.response.data.error || error.message;
      createNotification({
        type: "error",
        msg: errorMsg,
      });
    }
  };
  const logOut = (event) => {
    setUser(null);
    createNotification({
      type: "success",
      msg: `${user.username} logged out`,
    });
  };

  const addBlog = async (blogToAdd) => {
    try {
      const createdBlog = await blogService.create(blogToAdd);
      setBlogs([...blogs, createdBlog]);
      createNotification({
        type: "success",
        msg: `added new blog (${createdBlog.title}) by (${createdBlog.author})`,
      });
      blogFormRef.current.toggleVisiblity();
    } catch (error) {
      console.log({ ...error });
      let errorMsg = error.response.data.error || error.message;
      createNotification({
        type: "error",
        msg: errorMsg,
      });
    }
  };
  const incrementBlogLikes = async (blogToUpdate) => {
    const changedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };
    try {
      const updatedBlog = await blogService.update(changedBlog);
      updatedBlog.user = changedBlog.user;
      setBlogs(
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
      );
      createNotification({
        type: "success",
        msg: `liked blog (${updatedBlog.title}) by (${updatedBlog.author})`,
      });
    } catch (error) {
      console.log({ ...error });
      let errorMsg = error.response.data.error || error.message;
      if (error.response.status === 404) {
        setBlogs(blogs.filter((blog) => blog.id !== blogToUpdate.id));
        errorMsg = `error: ${blogToUpdate.title} doesn't exist on server`;
      }
      createNotification({
        type: "error",
        msg: errorMsg,
      });
    }
  };
  const deleteBlog = async (blogToDelete) => {
    const answer = window.confirm(
      `delete blog ${blogToDelete.title} by ${blogToDelete.author}?`
    );
    if (!answer) {
      return;
    }
    // console.log("deleting", blogToDelete.title);
    try {
      await blogService.remove(blogToDelete);
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
      createNotification({
        type: "success",
        msg: `deleted blog ${blogToDelete.title} by ${blogToDelete.author}`,
      });
    } catch (error) {
      console.log({ ...error });
      let errorMsg = error.response.data.error || error.message;
      if (error.response.status === 404) {
        setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
        errorMsg = `error: ${blogToDelete.title} doesn't exist on server`;
      }
      createNotification({
        type: "error",
        msg: errorMsg,
      });
    }
  };

  const createNotification = (notification, delay = 3) => {
    const id = setTimeout(() => {
      clearNotification(id);
    }, delay * 1000);

    const notificationToAdd = { ...notification, id };
    setNotifications((notifications) => [...notifications, notificationToAdd]);
  };
  const clearNotification = (notificationId) => {
    setNotifications((notifications) =>
      notifications.filter((notif) => notif.id !== notificationId)
    );
  };

  if (user === null) {
    return (
      <div>
        <Notifications notifications={notifications} />
        <Login
          login={login}
          username={username}
          updateUsername={updateUsername}
          password={password}
          updatePassword={updatePassword}
        />
      </div>
    );
  }

  const blogsToShow =
    sortOrder === "desc"
      ? [...blogs].sort((a, b) => b.likes - a.likes)
      : sortOrder === "asc"
      ? [...blogs].sort((a, b) => a.likes - b.likes)
      : blogs;
  // console.log(blogsToShow.map((b) => b.likes));

  return (
    <div>
      <Notifications notifications={notifications} />
      <h2>blogs</h2>
      <p>
        {user.username} logged in <button onClick={logOut}>logout</button>
      </p>
      <div>
        <h2>add new</h2>
        <Togglable label="add blog" ref={blogFormRef}>
          <NewBlog addBlog={addBlog} />
        </Togglable>
      </div>
      <div>
        sort by likes{" "}
        <select value={sortOrder} onChange={updateSortOrder}>
          <option value=""> -- select an option -- </option>
          <option value="desc">descending</option>
          <option value="asc">ascending</option>
        </select>
      </div>
      <div>
        {blogsToShow.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            incrementBlogLikes={() => incrementBlogLikes(blog)}
            deleteBlog={() => deleteBlog(blog)}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
