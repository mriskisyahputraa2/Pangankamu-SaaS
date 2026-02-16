import { api } from "@/lib/api";

// Fetching dengan pagination
export const getProducts = async (page: number, limit: number) => {
  const response = await api.get(`/products?page=${page}&limit=${limit}`);
  return response.data;
};

// Create
export const createProduct = async (data: any) => {
  const response = await api.post("/products", data);
  return response.data;
};

// Update
export const updateProduct = async (id: string | number, data: any) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

// Delete
export const deleteProduct = async (id: string | number) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
