import { productRepository } from "../repositories/productRepository.js";

export const productService = {
  /**
   * Get products with pagination and search
   */
  async getProducts(storeId: string, query: any) {
    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "10");
    const search = query.search || "";

    const result = await productRepository.getAll(storeId, page, limit, search);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      data: result.data,
      meta: result.meta,
    };
  },

  /**
   * Create new product
   */
  async createProduct(productData: {
    store_id: string;
    category_id: string;
    name: string;
    price_base: number;
    price_sell: number;
    stock: number;
    unit?: string;
  }) {
    // Validate required fields
    if (
      !productData.name ||
      !productData.category_id ||
      !productData.price_sell
    ) {
      throw new Error("Nama, kategori, dan harga jual wajib diisi");
    }

    const { data, error } = await productRepository.create(productData);

    if (error) {
      // Handle duplicate product name error
      if (error.code === "23505") {
        throw new Error("Nama produk sudah ada di toko Anda");
      }
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Update product
   */
  async updateProduct(
    id: string,
    storeId: string,
    updateData: {
      category_id?: string;
      name?: string;
      price_base?: number;
      price_sell?: number;
      stock?: number;
      unit?: string;
      is_active?: boolean;
    },
  ) {
    const { data, error } = await productRepository.update(
      id,
      storeId,
      updateData,
    );

    if (error) {
      // Handle duplicate product name error
      if (error.code === "23505") {
        throw new Error("Nama produk sudah ada di toko Anda");
      }
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Produk tidak ditemukan atau akses ditolak");
    }

    return data;
  },

  /**
   * Delete product
   */
  async deleteProduct(id: string, storeId: string) {
    // Check if product exists first
    const { data: existingProduct, error: findError } =
      await productRepository.findById(id, storeId);

    if (findError || !existingProduct) {
      throw new Error("Produk tidak ditemukan atau akses ditolak");
    }

    const { error } = await productRepository.delete(id, storeId);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  },
};
