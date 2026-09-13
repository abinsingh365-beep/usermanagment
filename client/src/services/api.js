
import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL;

if (!apiURL) {
  throw new Error("VITE_API_URL is not configured");
}

const baseURL = apiURL.endsWith("/api")
  ? apiURL
  : `${apiURL}/api`;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

