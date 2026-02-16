import axios from "axios";

// Pastikan mengambil URL dari env, jika tidak ada baru gunakan localhost:3000
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tambahkan interceptor untuk membantu debugging di console browser
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika terjadi Network Error, kita bisa tahu URL mana yang dipanggil
    console.error("AXIOS ERROR DETAILS:", {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
    });
    return Promise.reject(error);
  },
);
