import axios from "axios";

console.log("DEBUG: Connecting to Backend at:", import.meta.env.VITE_API_URL || "LOCAL_RELATIVE_PATH");

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;