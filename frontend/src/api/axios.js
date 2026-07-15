import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Attach JWT token to every outgoing request, when present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nf_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized handling for expired/invalid sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("nf_token");
      localStorage.removeItem("nf_user");
    }
    return Promise.reject(error);
  }
);

export default api;
