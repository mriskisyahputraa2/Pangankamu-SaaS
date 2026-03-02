import { categoryRepository } from "../repositories/categoryRepository.js";

export const categoryService = {
  async getCategories(storeId: string, queryParams: any) {
    const page = Math.max(1, parseInt(queryParams.page || "1"));
    const limit = Math.max(1, parseInt(queryParams.limit || "10"));
    const search = queryParams.search || "";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      const { data, error, count } = await categoryRepository.getAll(
        storeId,
        search,
        from,
        to,
      );

      if (error) {
        throw new Error(error.message);
      }

      return {
        data: data || [],
        meta: {
          total_data: count || 0,
          current_page: page,
          row_per_page: limit,
          total_pages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (err) {
      throw err;
    }
  },

  async addCategory(name: string, storeId: string) {
    const { data, error } = await categoryRepository.create(name, storeId);
    if (error) {
      if (error.code === "23505")
        throw new Error("Nama kategori sudah ada di toko Anda");
      throw new Error(error.message);
    }
    return data;
  },

  async updateCategory(id: string, name: string, storeId: string) {
    const { data, error } = await categoryRepository.update(id, name, storeId);
    if (error) {
      if (error.code === "23505") {
        throw new Error("Nama kategori sudah ada di toko Anda");
      }
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Kategori tidak ditemukan atau akses ditolak");
    }

    return data;
  },

  async deleteCategory(id: string, storeId: string) {
    const { error } = await categoryRepository.delete(id, storeId);
    if (error) throw new Error("Gagal menghapus kategori: " + error.message);
    return true;
  },
};
