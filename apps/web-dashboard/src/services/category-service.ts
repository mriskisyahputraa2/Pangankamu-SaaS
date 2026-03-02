import { api } from "@/lib/api";
import { Category, ApiResponse } from "@/types";
import axios from "axios";

/**
 * Mengambil Daftar Kategori (Read)
 * Backend mengambil store_id dari JWT middleware otomatis
 */
export const getCategories = async (
  page: number,
  limit: number,
  search: string = "",
): Promise<ApiResponse<Category[]>> => {
  try {
    const response = await api.get(`/categories`, {
      params: {
        page,
        limit,
        search,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Menambah Kategori Baru (Create)
 * store_id diambil dari JWT di backend
 */
export const createCategory = async (data: {
  name: string;
}): Promise<ApiResponse<Category>> => {
  try {
    const response = await api.post("/categories", data);
    return response.data;
  } catch (error) {
    // Re-throw error to be handled by component
    throw error;
  }
};

/**
 * Memperbarui Nama Kategori (Update)
 */
export const updateCategory = async (
  id: string,
  name: string,
): Promise<ApiResponse<Category>> => {
  try {
    const response = await api.put(`/categories/${id}`, { name });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Menghapus Kategori (Delete)
 */
export const deleteCategory = async (
  id: string,
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export default service object
export const categoryService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
