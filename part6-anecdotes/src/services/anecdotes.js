import axios from "axios";

const API_URL = "http://localhost:3001/anecdotes";

const readAll = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const create = async (anecdote) => {
  const res = await axios.post(API_URL, anecdote);
  return res.data;
};

const update = async (anecdote) => {
  const res = await axios.put(`${API_URL}/${anecdote.id}`, anecdote);
  return res.data;
};

export default { readAll, create, update };
