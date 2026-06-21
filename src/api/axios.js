import axios from "axios";

/*Base URLs*/
const BASE_API_URL = import.meta.env.VITE_API_URL;
const BASE_FILE_URL = import.meta.env.VITE_FILE_URL;

/*File URL Utility Function*/
export const getFileUrl = (path) => {
  if (!path) return "";

  // Remove duplicate Uploads or extra slashes
  const cleanPath = path.replace(/^\/+/, "").replace(/^Uploads\/+/, "Uploads/");

  // If full URL, return as is
  if (cleanPath.startsWith("http")) return cleanPath;

  // Always return single absolute URL
  return `${BASE_FILE_URL}/${cleanPath}`;
};

/*Axios Setup*/
const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically for protected routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
