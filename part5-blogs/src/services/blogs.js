import axios from "axios";

const baseUrl = "/api/blogs";

let authorization = "";
let config = null;
const setAuthorizationHeader = (token) => {
  authorization = `Bearer ${token}`;
  setRequestConfig(authorization);
};
const setRequestConfig = (authorization) => {
  config = {
    headers: {
      Authorization: authorization,
    },
  };
};

const getAll = async () => {
  const res = await axios.get(baseUrl, config);
  return res.data;
};

const create = async (blog) => {
  const res = await axios.post(baseUrl, blog, config);
  return res.data;
};

const update = async (blog) => {
  const res = await axios.put(`${baseUrl}/${blog.id}`, blog, config);
  return res.data;
};

const remove = async (blog) => {
  const res = await axios.delete(`${baseUrl}/${blog.id}`, config);
  return res.data;
};

export default { getAll, create, update, remove, setAuthorizationHeader };
