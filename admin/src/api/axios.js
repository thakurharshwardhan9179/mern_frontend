import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-backend-1-wd9z.onrender.com/api"
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