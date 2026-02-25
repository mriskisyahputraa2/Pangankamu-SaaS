import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- 1. REQUEST INTERCEPTOR (PENYESUAIAN PENTING) ---
// Bagian ini bertugas "menempelkan" Token ke setiap permintaan secara otomatis
api.interceptors.request.use(
  (config) => {
    const storedData = localStorage.getItem("user");

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        // Mengambil token dari data login (sesuaikan path-nya jika perlu)
        // Ganti bagian ini di api.ts
        const token =
          parsed.token ||
          parsed.access_token ||
          parsed.session?.access_token ||
          parsed.data?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Gagal parse token di interceptor:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- 2. RESPONSE INTERCEPTOR (DEBUGGING & ERROR HANDLING) ---
api.interceptors.request.use((config) => {
  const storedData = localStorage.getItem("user");

  if (storedData) {
    try {
      const parsed = JSON.parse(storedData);

      // Mencoba mengambil token dari berbagai kemungkinan struktur
      const token =
        parsed.token ||
        parsed.access_token ||
        parsed.data?.token ||
        parsed.session?.access_token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token berhasil ditempelkan ke header");
      } else {
        console.warn("Data 'user' ada, tapi token tidak ditemukan di dalamnya");
      }
    } catch (error) {
      console.error("Gagal parse data user dari localStorage", error);
    }
  } else {
    console.warn("Key 'user' tidak ditemukan di localStorage");
  }
  return config;
});
