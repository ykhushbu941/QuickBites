import axios from "axios";

// 🚀 PRODUCTION FALLBACK: Hardcoded Render URL if Vercel fails to load .env
const PROD_URL = "https://quickbites-backend-738z.onrender.com";

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  // Use the env variable if provided, UNLESS we are on localhost and the variable is pointing to production
  if (envUrl && envUrl !== "undefined") {
    if (isLocal && envUrl.includes("render.com")) {
      console.warn("⚠️ API points to Production (Render) while on Localhost. Using Proxy instead.");
      return "/api"; 
    }
    return `${envUrl}/api`;
  }
  
  // Vercel Production Check
  if (window.location.hostname.includes("vercel") && !isLocal) {
     return `${PROD_URL}/api`;
  }
  
  return "/api"; 
};

const url = getBaseURL();
console.log(`🚀 API Base URL: ${url}`);

const API = axios.create({
  baseURL: url,
  timeout: 15000 // 15s timeout to prevent hanging
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;