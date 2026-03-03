import { useState } from "react";
import { Category } from "../types/category.types";

export function useCategoryModals() {
  // Modal States
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Open Edit Modal
  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedCategory(null);
  };

  return {
    selectedCategory,
    isEditOpen,
    openEditModal,
    closeEditModal,
  };
}
