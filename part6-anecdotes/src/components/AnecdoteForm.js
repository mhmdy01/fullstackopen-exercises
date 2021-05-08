import React from "react";
import { useDispatch } from "react-redux";
import { addAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const createAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    dispatch(addAnecdote(content));
    event.target.anecdote.value = "";

    dispatch(setNotification(`new anecdote '${content}'`, 4));
  };

  return (
    <div>
      <form onSubmit={createAnecdote}>
        <div>
          <input name="anecdote" placeholder="type anecdote" />
        </div>
        <button>create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
