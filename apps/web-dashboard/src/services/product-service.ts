import { api } from "@/lib/api";

export const getStoreData = async () => {
  try {
    const response = await api.get("/"); // Memanggil route '/' di Hono
    return response.data;
  } catch (error) {
    console.error("Error fetching store data:", error);
    throw error;
  }
};
