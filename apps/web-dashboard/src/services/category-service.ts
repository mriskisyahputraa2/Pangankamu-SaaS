import { api } from "@/lib/api";
import { Category, ApiResponse } from "@/types";

/**
 * Mengambil Daftar Kategori (Read)
 * Mengisolasi data antar toko untuk keamanan SaaS
 */
export const getCategories = async (
  storeId: string,
  page: number,
  limit: number,
  search: string = "",
): Promise<ApiResponse<Category[]>> => {
  const response = await api.get(`/categories`, {
    params: {
      store_id: storeId, // Filter wajib Multi-Tenancy
      page,
      limit,
      search,
    },
  });
  return response.data;
};

/**
 * Menambah Kategori Baru (Create)
 * Mencatat store_id agar kategori tidak muncul di toko lain
 */
export const createCategory = async (data: {
  store_id: string;
  name: string;
}): Promise<ApiResponse<Category>> => {
  const response = await api.post("/categories", data, {
    params: { store_id: data.store_id }, // Kirim store_id di URL agar backend mudah baca
  });
  return response.data;
};

/**
 * Memperbarui Nama Kategori (Update)
 */
export const updateCategory = async (
  id: string,
  data: {
    store_id: string;
    name: string;
  },
): Promise<ApiResponse<Category>> => {
  const response = await api.put(`/categories/${id}`, data, {
    params: { store_id: data.store_id }, // Validasi kepemilikan tenant
  });
  return response.data;
};

/**
 * Menghapus Kategori (Delete)
 */
export const deleteCategory = async (
  id: string,
  storeId: string,
): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/categories/${id}`, {
    params: { store_id: storeId }, // Pastikan hanya pemilik yang bisa hapus
  });
  return response.data;
};
