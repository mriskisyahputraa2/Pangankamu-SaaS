import { api } from "@/lib/api";

/**
 * SERVICE KATEGORI - PANGANKAMU SAAS (V1.0)
 * Sesuai Dokumen Perencanaan: Manajemen Tenant & Multi-Tenancy
 */

// 1. Ambil Semua Kategori (Berdasarkan Store ID)
// Sesuai dokumen: Mengisolasi data antar toko untuk keamanan SaaS
export const getCategories = async (
  storeId: string,
  page: number,
  limit: number,
  search: string = "",
) => {
  const response = await api.get(`/categories`, {
    params: {
      store_id: storeId, // Wajib sesuai poin 3A dokumen
      page,
      limit,
      search,
    },
  });
  return response.data;
};

// 2. Tambah Kategori Baru
// Mencatat store_id agar kategori tidak muncul di toko lain
export const createCategory = async (data: {
  store_id: string;
  name: string;
}) => {
  const response = await api.post("/categories", data);
  return response.data;
};

// 3. Update Data Kategori
export const updateCategory = async (
  id: string,
  data: {
    store_id: string;
    name: string;
  },
) => {
  const response = await api.put(`/categories/${id}`, data);
  return response.data;
};

// 4. Hapus Kategori
// Mengirim store_id untuk validasi kepemilikan sebelum penghapusan dilakukan
export const deleteCategory = async (id: string, storeId: string) => {
  const response = await api.delete(`/categories/${id}`, {
    params: {
      store_id: storeId,
    },
  });
  return response.data;
};
