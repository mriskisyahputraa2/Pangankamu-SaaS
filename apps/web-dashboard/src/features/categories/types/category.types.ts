// Category feature types
export interface Category {
  id: string;
  name: string;
  store_id: string;
  created_at: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

export interface CategoryListResponse {
  data: Category[];
  meta: {
    total_data: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
}
