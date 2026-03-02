import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const storedData = localStorage.getItem("user");
  if (storedData) {
    try {
      const parsed = JSON.parse(storedData);
      // Mendukung kedua jalur: Signup Manual (parsed.data.token) atau Google (parsed.token)
      const token = parsed.token || parsed.data?.token || parsed.access_token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Token parsing failed, continue without auth header
    }
  }
  return config;
});
