import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:4000",
  timeout: 15000
});

export const setAuthToken = (token) => {
  if (token) instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete instance.defaults.headers.common["Authorization"];
};

export default instance;
