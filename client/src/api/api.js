import axios from "axios";

// 🚀 PRODUCTION FALLBACK: Hardcoded Render URL if Vercel fails to load .env
const PROD_URL = "https://quickbites-backend-738z.onrender.com";

const getBaseURL = () => "/api"; 

const url = getBaseURL();
console.log(`🚀 API Base URL: ${url}`);

const API = axios.create({
  baseURL: url,
  timeout: 15000 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;