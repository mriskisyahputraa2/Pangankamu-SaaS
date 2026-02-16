import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // URL API

// Inisialisasi Axios ke URL API
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Mendapatkan data toko dari URL API
export const getStores = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data toko:", error);
    throw error;
  }
};
