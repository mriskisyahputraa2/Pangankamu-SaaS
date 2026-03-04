import { useState } from "react";

export function useProductModals() {
  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Open Edit Modal
  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedProduct(null);
  };

  return {
    selectedProduct,
    isEditOpen,
    openEditModal,
    closeEditModal,
  };
}
