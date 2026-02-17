import { api } from "@/lib/api";

/**
 * SERVICE PRODUK - PANGANKAMU SAAS (V1.0)
 * Sesuai Dokumen Perencanaan: Manajemen Inventaris & Multi-Tenancy
 */

// 1. Ambil Semua Produk (Berdasarkan Store ID)
// Sesuai dokumen: Data dipisahkan secara logika menggunakan store_id
export const getProducts = async (
  storeId: string,
  page: number,
  limit: number,
  search: string = "",
) => {
  const response = await api.get(`/products`, {
    params: {
      store_id: storeId, // Wajib ada untuk isolasi data SaaS
      page,
      limit,
      search,
    },
  });
  return response.data;
};

// 2. Tambah Produk Baru
// Mengirimkan price_base (modal) dan price_sell (jual) untuk hitung profit otomatis
export const createProduct = async (data: {
  store_id: string;
  category_id: string;
  name: string;
  price_base: number;
  price_sell: number;
  stock: number;
  unit?: string;
}) => {
  const response = await api.post("/products", data);
  return response.data;
};

// 3. Update Data Produk
// Digunakan untuk manajemen stok dan perubahan harga pasar
export const updateProduct = async (
  id: string,
  data: {
    store_id: string;
    category_id?: string;
    name?: string;
    price_base?: number;
    price_sell?: number;
    stock?: number;
    unit?: string;
    is_active?: boolean;
  },
) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

// 4. Hapus Produk
// Mengirim store_id sebagai query param untuk validasi kepemilikan tenant
export const deleteProduct = async (id: string, storeId: string) => {
  const response = await api.delete(`/products/${id}`, {
    params: {
      store_id: storeId,
    },
  });
  return response.data;
};
