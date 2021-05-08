import React, { useState } from "react";

const NewBlog = (props) => {
  const [newLink, setNewLink] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  // const [newLikes, setNewLikes] = useState("");

  const updateNewLink = (event) => setNewLink(event.target.value);
  const updateNewTitle = (event) => setNewTitle(event.target.value);
  const updateNewAuthor = (event) => setNewAuthor(event.target.value);
  // const updateNewLikes = (event) => setNewLikes(event.target.value);

  const addBlog = async (event) => {
    event.preventDefault();
    const blogToAdd = {
      link: newLink,
      title: newTitle,
      author: newAuthor,
      // likes: newLikes,
    };
    // console.log("adding blog", blogToAdd);
    await props.addBlog(blogToAdd);
    setNewLink("");
    setNewTitle("");
    setNewAuthor("");
    // setNewLikes("");
  };

  return (
    <div>
      <form onSubmit={addBlog}>
        <div>
          link: <input value={newLink} onChange={updateNewLink} required />
        </div>
        <div>
          title: <input value={newTitle} onChange={updateNewTitle} required />
        </div>
        <div>
          author: <input value={newAuthor} onChange={updateNewAuthor} />
        </div>
        {/* <div>
            likes:{" "}
            <input type="number" value={newLikes} onChange={updateNewLikes} />
          </div> */}
        <div>
          <input type="submit" value="add" />
        </div>
      </form>
    </div>
  );
};

export default NewBlog;
