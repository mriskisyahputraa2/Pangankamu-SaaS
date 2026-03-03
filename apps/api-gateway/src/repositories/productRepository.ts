import { supabase } from "../config/supabase.js";

export const productRepository = {
  /**
   * Get products with search and pagination
   */
  async getAll(storeId: string, page: number, limit: number, search?: string) {
    const offset = (page - 1) * limit;

    let query = supabase
      .from("products")
      .select(`*, categories (name)`, { count: "exact" })
      .eq("store_id", storeId);

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    return {
      data,
      error,
      meta: {
        total_data: count || 0,
        current_page: page,
        total_pages: Math.ceil((count || 0) / limit),
        per_page: limit,
      },
    };
  },

  /**
   * Create new product
   */
  async create(productData: {
    store_id: string;
    category_id: string;
    name: string;
    price_base: number;
    price_sell: number;
    stock: number;
    unit?: string;
  }) {
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          ...productData,
          price_base: productData.price_base || 0,
          stock: productData.stock || 0,
          unit: productData.unit || "pcs",
        },
      ])
      .select(`*, categories (name)`)
      .single();

    return { data, error };
  },

  /**
   * Update product by ID and store_id
   */
  async update(
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
    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .eq("store_id", storeId)
      .select(`*, categories (name)`)
      .single();

    return { data, error };
  },

  /**
   * Delete product by ID and store_id
   */
  async delete(id: string, storeId: string) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("store_id", storeId);

    return { error };
  },

  /**
   * Get product by ID and store_id
   */
  async findById(id: string, storeId: string) {
    const { data, error } = await supabase
      .from("products")
      .select(`*, categories (name)`)
      .eq("id", id)
      .eq("store_id", storeId)
      .single();

    return { data, error };
  },
};
