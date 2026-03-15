<<<<<<< HEAD
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// ✅ AUTO ATTACH TOKEN
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
=======
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// ✅ AUTO ATTACH TOKEN
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
