import anecdoteService from "../services/anecdotes";

const reducer = (state = [], action) => {
  // console.log("state now: ", state);
  // console.log("action", action);
  switch (action.type) {
    case "INIT_ANECDOTES":
      return action.payload;
    case "ADD_ANECDOTE":
      return [...state, action.payload];
    case "INCREMENT_VOTES":
      const updatedAnecdote = action.payload;
      return state.map((anecdote) =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      );
    default:
      return state;
  }
};
export default reducer;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const fetchedAnecdotes = await anecdoteService.readAll();
    dispatch({
      type: "INIT_ANECDOTES",
      payload: fetchedAnecdotes,
    });
  };
};

export const addAnecdote = (content) => {
  const anecdoteToAdd = {
    content,
    votes: 0,
  };
  return async (dispatch) => {
    const createdAnecdote = await anecdoteService.create(anecdoteToAdd);
    dispatch({
      type: "ADD_ANECDOTE",
      payload: createdAnecdote,
    });
  };
};

export const incrementVotes = (anecdote) => {
  const changedAnecdote = {
    ...anecdote,
    votes: anecdote.votes + 1,
  };
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.update(changedAnecdote);
    dispatch({
      type: "INCREMENT_VOTES",
      payload: updatedAnecdote,
    });
  };
};
