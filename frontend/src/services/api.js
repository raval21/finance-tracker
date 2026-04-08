import axios from "axios";

const API = axios.create({
  baseURL: "https://finance-tracker-production-d494.up.railway.app/api", // backend url
});

// Attach token automatically (later use)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = token;
  }
  return req;
});

export default API;