// Definisi Struktur Kategori
export interface Category {
  id: string;
  store_id: string;
  name: string;
  created_at?: string;
}

// Definisi Struktur Produk (Inventory & Financial Core)
export interface Product {
  id: string;
  store_id: string;
  category_id: string;
  name: string;
  price_base: number; // Modal (HPP) untuk hitung profit
  price_sell: number; // Harga jual ke customer
  stock: number;
  unit: string; // kg, ekor, pcs
  image_url?: string;
  is_active: boolean;
  created_at?: string;
  // Menampung hasil JOIN dengan tabel categories
  categories?: {
    name: string;
  };
}

// Struktur Standar Respon API dari Backend Hono.js
export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
  meta?: {
    total_data: number;
    current_page: number;
    total_pages: number;
  };
}
