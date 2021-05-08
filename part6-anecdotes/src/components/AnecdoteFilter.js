import React from "react";
import { useDispatch } from "react-redux";
import { setFilter } from "../reducers/filterReducer";

const AnecdoteFilter = () => {
  const dispatch = useDispatch();

  const updateFilter = (event) => {
    const filter = event.target.value;
    dispatch(setFilter(filter));
  };

  return (
    <div>
      filter <input onChange={updateFilter} placeholder="search for anecdote" />
    </div>
  );
};

export default AnecdoteFilter;
