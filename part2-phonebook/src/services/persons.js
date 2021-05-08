import axios from "axios";

const API_URL = "http://localhost:3001/persons";

const readAll = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const remove = async (person) => {
  const res = await axios.delete(`${API_URL}/${person.id}`);
  return res.data;
};

const update = async (person) => {
  const res = await axios.put(`${API_URL}/${person.id}`, person);
  return res.data;
};

const create = async (person) => {
  const res = await axios.post(API_URL, person);
  return res.data;
};

const personService = {
  readAll,
  remove,
  update,
  create,
};

export default personService;
