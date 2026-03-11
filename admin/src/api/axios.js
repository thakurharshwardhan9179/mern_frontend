import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
    }
  }

  return req;
});

export default API;