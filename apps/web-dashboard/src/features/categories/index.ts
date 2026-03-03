// Category feature exports
export { categoryService } from "./services/categoryService";

// Components
export { AddCategoryModal } from "./components/modals/add-category-modal";
export { EditCategoryModal } from "./components/modals/edit-category-modal";
export { DeleteCategoryDialog } from "./components/modals/delete-category-modal";
export { CategoryFilters } from "./components/CategoryFilters";
export { CategoryTable } from "./components/CategoryTable";
export { CategoryPagination } from "./components/CategoryPagination";

// Hooks
export { useCategoryData } from "./hooks/useCategoryData";
export { useCategoryModals } from "./hooks/useCategoryModals";

// Types
export type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./types/category.types";
