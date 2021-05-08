import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { incrementVotes } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    return filter
      ? anecdotes.filter((anecdote) =>
          anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
      : anecdotes;
  });
  const dispatch = useDispatch();

  const vote = (anecdote) => {
    dispatch(incrementVotes(anecdote));
    dispatch(
      setNotification(`you voted '${anecdote.content.substring(0, 50)}...'`, 3)
    );
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
