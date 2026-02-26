import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const storedData =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;

  if (storedData) {
    try {
      const parsed = JSON.parse(storedData);

      // BERDASARKAN RESPON POSTMAN KAMU:
      // Token ada di dalam objek 'data', maka aksesnya adalah parsed.data.token
      const token = parsed.data?.token || parsed.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token ditemukan dan ditempelkan!"); // Debug jika perlu
      }
    } catch (error) {
      console.error("Gagal parse token:", error);
    }
  }
  return config;
});
