import { api } from "@/lib/api";

// Mengambil daftar kategori
export const getCategories = async (
  page: number,
  limit: number,
  search: string = "",
) => {
  // mengirim request get dengan query params
  const reponse = await api.get(
    `/categories?page=${page}&limit=${limit}&search=${search}`,
  );

  // mengambailkan data JSON dari backend (status, data, total, page, limit)
  return reponse.data;
};

// Create kategori
export const createCategory = async (name: string) => {
  // mengirim data nama kategori dalam bentuk object JSON ke backend
  const response = await api.post("/categories", { name });
  return response.data;
};

// edit/update categories
export const updateCategory = async (id: number, name: string) => {
  // mengirim ID di URL dan data nama baru di body
  const response = await api.put(`/categories/${id}`, { name });
  return response.data;
};

// delete categories
export const deleteCategory = async (id: number) => {
  // mengirim request DELETE berdasarkan ID kategori
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
